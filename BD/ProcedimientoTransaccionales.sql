-- M�DULO 8: PROCEDIMIENTOS QUE USAN TRANSACCIONES
GO

-- 1) Recepcionar orden de compra -> crear factura y actualizar existencias (transaccional)
CREATE PROCEDURE sp_RecepcionOrdenCompra_ConTransaccion
    @IdOrdenCompra INT,
    @IdFacturaOut INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @IdProveedor INT = (SELECT IdProveedor FROM OrdenCompra WHERE IdOrdenCompra=@IdOrdenCompra);

        DECLARE @Total DECIMAL(18,2) = (SELECT ISNULL(SUM(CantidadSolicitada * PrecioUnitario),0) FROM OrdenCompraDetalle WHERE IdOrdenCompra=@IdOrdenCompra);

        INSERT INTO FacturaProveedor(IdProveedor,Fecha,Total,Saldo,Estado)
        VALUES(@IdProveedor,GETDATE(),@Total,@Total,'Abierta');

        SET @IdFacturaOut = SCOPE_IDENTITY();

        UPDATE OrdenCompra SET Estado='Recibida' WHERE IdOrdenCompra=@IdOrdenCompra;

        UPDATE OrdenCompraDetalle
        SET CantidadRecibida = CantidadSolicitada
        WHERE IdOrdenCompra = @IdOrdenCompra;

        -- Registrar kardex y actualizar producto
        INSERT INTO InventarioKardex(IdProducto,Movimiento,Cantidad,Saldo,Observaciones,Fecha)
        SELECT d.IdProducto,'Entrada Recepcion OC',d.CantidadRecibida,
               (SELECT Existencia + d.CantidadRecibida FROM Producto WHERE IdProducto=d.IdProducto),
               CONCAT('Recepci�n OC ',@IdOrdenCompra), GETDATE()
        FROM OrdenCompraDetalle d
        WHERE d.IdOrdenCompra = @IdOrdenCompra;

        UPDATE p
        SET p.Existencia = p.Existencia + d.CantidadRecibida
        FROM Producto p
        JOIN OrdenCompraDetalle d ON p.IdProducto = d.IdProducto
        WHERE d.IdOrdenCompra = @IdOrdenCompra;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en recepcion: %s',16,1,@ErrMsg);
    END CATCH
END
GO

-- 2) Procesar venta mayorista (ejemplo transaccional: crea la venta)
CREATE PROCEDURE sp_ProcesarVentaMayorista_Transaccional
    @IdCliente INT,
    @Total DECIMAL(18,2),
    @IdVentaOut INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

         INSERT INTO VentaMayorista(IdCliente, Fecha, Total, Estado, Saldo)
        VALUES(@IdCliente, GETDATE(), @Total, 'Pendiente', @Total);
        
        SET @IdVentaOut = SCOPE_IDENTITY();

        -- Se asume que la aplicaci�n insertar� detalles con el SP correspondiente
        COMMIT TRANSACTION;
        SELECT @IdVentaOut AS IdVenta;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error al procesar venta mayorista: %s',16,1,@ErrMsg);
    END CATCH
END
GO

-- 3) Pago a proveedor por factura especifica (transaccional)
CREATE PROCEDURE [dbo].[sp_PagoProveedor_FacturaEspecifica_Transaccional]
(
    @IdFactura INT,
    @MontoPagado DECIMAL(18,2),
    @TipoPago NVARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Obtener proveedor solo para control interno (opcional)
        DECLARE @IdProveedor INT;
        SELECT @IdProveedor = IdProveedor
        FROM FacturaProveedor
        WHERE IdFactura = @IdFactura;

        -- Crear encabezado de pago
        INSERT INTO PagoProveedor(Fecha, MontoTotal, TipoPago)
        VALUES(GETDATE(), @MontoPagado, @TipoPago);

        DECLARE @IdPago INT = SCOPE_IDENTITY();

        -- Insertar detalle
        INSERT INTO PagoProveedorDetalle(IdPago, IdFactura, MontoPagado)
        VALUES(@IdPago, @IdFactura, @MontoPagado);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END

GO


-- 4) Pago a proveedor por factura multiple (transaccional)
CREATE PROCEDURE [dbo].[sp_PagoProveedor_MultiplesFacturas_Split_Transaccional]
(
    @IdProveedor INT,
    @FacturasCadena NVARCHAR(MAX),
    @TipoPago NVARCHAR(20),
    @MontoTotal DECIMAL(18,2)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Crear pago (encabezado)
        INSERT INTO PagoProveedor(Fecha, MontoTotal, TipoPago)
        VALUES(GETDATE(), @MontoTotal, @TipoPago);

        DECLARE @IdPago INT = SCOPE_IDENTITY();

        -- Tabla temporal
        CREATE TABLE #FacturasPagar
        (
            IdFactura INT,
            MontoPagado DECIMAL(18,2)
        );

        -- Primer split
        DECLARE @Item NVARCHAR(200);

        DECLARE c1 CURSOR FOR
            SELECT TRIM(value)
            FROM STRING_SPLIT(@FacturasCadena, ';')
            WHERE TRIM(value) <> '';

        OPEN c1;
        FETCH NEXT FROM c1 INTO @Item;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @IdF INT;
            DECLARE @MontoF DECIMAL(18,2);

            SELECT 
                @IdF = PARSENAME(REPLACE(@Item,'|','.'), 2),
                @MontoF = PARSENAME(REPLACE(@Item,'|','.'), 1);

            INSERT INTO #FacturasPagar(IdFactura, MontoPagado)
            VALUES(@IdF, @MontoF);

            FETCH NEXT FROM c1 INTO @Item;
        END

        CLOSE c1;
        DEALLOCATE c1;

        -- Segundo cursor: insertar detalles
        DECLARE @IdFactura INT;
        DECLARE @Monto DECIMAL(18,2);

        DECLARE c2 CURSOR FOR
            SELECT IdFactura, MontoPagado
            FROM #FacturasPagar;

        OPEN c2;
        FETCH NEXT FROM c2 INTO @IdFactura, @Monto;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            INSERT INTO PagoProveedorDetalle(IdPago, IdFactura, MontoPagado)
            VALUES(@IdPago, @IdFactura, @Monto);

            FETCH NEXT FROM c2 INTO @IdFactura, @Monto;
        END

        CLOSE c2;
        DEALLOCATE c2;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END
GO


--Pago Cliente una venta
CREATE PROCEDURE sp_PagoCliente_FacturaEspecifica
(
    @IdCliente INT,
    @IdVenta INT,
    @MontoPagado DECIMAL(18,2),
    @TipoPago NVARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        ---------------------------------------------------
        -- 1) Insertar encabezado del pago
        ---------------------------------------------------
        INSERT INTO PagoCliente(IdCliente, Fecha, Monto)
        VALUES(@IdCliente, GETDATE(), @MontoPagado);

        DECLARE @IdPagoCliente INT = SCOPE_IDENTITY();

        ---------------------------------------------------
        -- 2) Insertar detalle (solo histórico, no afecta saldo)
        ---------------------------------------------------
        INSERT INTO PagoClienteDetalle(IdPagoCliente, IdVenta, MontoPagado)
        VALUES(@IdPagoCliente, @IdVenta, @MontoPagado);

        ---------------------------------------------------
        -- 3) Actualizar saldo global del cliente
        ---------------------------------------------------
        UPDATE Cliente
        SET Saldo = Saldo - @MontoPagado
        WHERE IdCliente = @IdCliente;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err,16,1);
    END CATCH
END;
GO



--Pago cliente para varias ventas
CREATE PROCEDURE sp_PagoCliente_MultiplesFacturas
(
    @IdCliente INT,
    @FacturasCadena NVARCHAR(MAX),  -- ejemplo: '2310|5000;2312|3500'
    @TipoPago NVARCHAR(20),
    @MontoTotal DECIMAL(18,2)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        ---------------------------------------------------
        -- 1) Crear encabezado del pago
        ---------------------------------------------------
        INSERT INTO PagoCliente(IdCliente, Fecha, Monto)
        VALUES(@IdCliente, GETDATE(), @MontoTotal);

        DECLARE @IdPagoCliente INT = SCOPE_IDENTITY();

        ---------------------------------------------------
        -- 2) Crear tabla temporal para detalles
        ---------------------------------------------------
        CREATE TABLE #DetallePagoCliente (
            IdVenta INT,
            MontoPagado DECIMAL(18,2)
        );

        ---------------------------------------------------
        -- 3) Primer split por ';'
        ---------------------------------------------------
        DECLARE @Item NVARCHAR(200);

        DECLARE c1 CURSOR FOR
            SELECT TRIM(value)
            FROM STRING_SPLIT(@FacturasCadena,';')
            WHERE TRIM(value) <> '';

        OPEN c1;
        FETCH NEXT FROM c1 INTO @Item;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @IdVenta INT;
            DECLARE @Monto DECIMAL(18,2);

            -- Separar cada item en formato 'IdVenta|Monto'
            SELECT 
                @IdVenta = PARSENAME(REPLACE(@Item,'|','.'),2),
                @Monto   = PARSENAME(REPLACE(@Item,'|','.'),1);

            INSERT INTO #DetallePagoCliente(IdVenta, MontoPagado)
            VALUES(@IdVenta, @Monto);

            FETCH NEXT FROM c1 INTO @Item;
        END

        CLOSE c1;
        DEALLOCATE c1;

        ---------------------------------------------------
        -- 4) Insertar detalles reales uno por uno
        ---------------------------------------------------
        DECLARE @IdVenta2 INT;
        DECLARE @Monto2 DECIMAL(18,2);

        DECLARE c2 CURSOR FOR
            SELECT IdVenta, MontoPagado
            FROM #DetallePagoCliente;

        OPEN c2;
        FETCH NEXT FROM c2 INTO @IdVenta2, @Monto2;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            INSERT INTO PagoClienteDetalle(IdPagoCliente, IdVenta, MontoPagado)
            VALUES(@IdPagoCliente, @IdVenta2, @Monto2);

            FETCH NEXT FROM c2 INTO @IdVenta2, @Monto2;
        END

        CLOSE c2;
        DEALLOCATE c2;

        ---------------------------------------------------
        -- 5) Actualizar saldo total del cliente SOLO UNA VEZ
        ---------------------------------------------------
        UPDATE Cliente
        SET Saldo = Saldo - @MontoTotal
        WHERE IdCliente = @IdCliente;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
GO

CREATE PROCEDURE [dbo].[sp_DevolucionProveedor_Transaccional]
(
    @IdFacturaProveedor INT,
    @IdProducto INT,
    @Cantidad INT,
    @Motivo NVARCHAR(300)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        --------------------------------------------------------
        -- 0) Validar que la factura exista
        --------------------------------------------------------
        IF NOT EXISTS (SELECT 1 FROM FacturaProveedor WHERE IdFactura = @IdFacturaProveedor)
        BEGIN
            RAISERROR('La factura no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        --------------------------------------------------------
        -- 1) Validar que la factura NO esté pagada
        --------------------------------------------------------
        IF (SELECT Saldo FROM FacturaProveedor WHERE IdFactura = @IdFacturaProveedor) <= 0
        BEGIN
            RAISERROR('La factura ya está pagada. No se pueden realizar devoluciones.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        --------------------------------------------------------
        -- 2) Validar que el producto pertenece al detalle factura
        --------------------------------------------------------
        IF NOT EXISTS (
            SELECT 1 FROM FacturaProveedorDetalle
            WHERE IdFactura = @IdFacturaProveedor
              AND IdProducto = @IdProducto
        )
        BEGIN
            RAISERROR('El producto no pertenece a esta factura.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        --------------------------------------------------------
        -- 3) Validar que cantidad a devolver no exceda lo facturado
        --------------------------------------------------------
        DECLARE @CantidadFacturada INT = (
            SELECT Cantidad 
            FROM FacturaProveedorDetalle
            WHERE IdFactura = @IdFacturaProveedor 
              AND IdProducto = @IdProducto
        );

        IF @Cantidad > @CantidadFacturada
        BEGIN
            RAISERROR('No se puede devolver más cantidad de la facturada.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        --------------------------------------------------------
        -- 4) Obtener datos de proveedor y precio compra
        --------------------------------------------------------
        DECLARE @IdProveedor INT = (
            SELECT IdProveedor FROM FacturaProveedor WHERE IdFactura = @IdFacturaProveedor
        );

        DECLARE @PrecioCompra DECIMAL(18,2) = (
            SELECT PrecioCompra 
            FROM FacturaProveedorDetalle
            WHERE IdFactura = @IdFacturaProveedor 
              AND IdProducto = @IdProducto
        );

        DECLARE @MontoDevolucion DECIMAL(18,2) = @Cantidad * @PrecioCompra;

        --------------------------------------------------------
        -- 4.5) RESTAR cantidad del detalle de factura
        --------------------------------------------------------
        UPDATE FacturaProveedorDetalle
        SET Cantidad = Cantidad - @Cantidad
        WHERE IdFactura = @IdFacturaProveedor
          AND IdProducto = @IdProducto;

        --------------------------------------------------------
        -- 5) Insertar registro de devolución
        --------------------------------------------------------
        INSERT INTO DevolucionProveedor(IdProveedor, IdProducto, Cantidad, Motivo, Fecha, IdFacturaProveedor)
        VALUES(@IdProveedor, @IdProducto, @Cantidad, @Motivo, GETDATE(), @IdFacturaProveedor);

        --------------------------------------------------------
        -- 6) Registrar Kardex (Salida de inventario)
        --------------------------------------------------------
        INSERT INTO InventarioKardex(IdProducto, Movimiento, Cantidad, Saldo, Observaciones, Fecha)
        VALUES(
            @IdProducto,
            'Devolucion Proveedor',
            -@Cantidad,
            (SELECT Existencia - @Cantidad FROM Producto WHERE IdProducto=@IdProducto),
            CONCAT('Devolución de factura #', @IdFacturaProveedor),
            GETDATE()
        );

        --------------------------------------------------------
        -- 7) Actualizar inventario del producto
        --------------------------------------------------------
        UPDATE Producto
        SET Existencia = Existencia - @Cantidad
        WHERE IdProducto = @IdProducto;

        --------------------------------------------------------
        -- 8) Restar saldo de factura proveedor
        --------------------------------------------------------
        UPDATE FacturaProveedor
        SET Saldo = Saldo - @MontoDevolucion
        WHERE IdFactura = @IdFacturaProveedor;

        --------------------------------------------------------
        -- 9) Actualizar estado de factura
        --------------------------------------------------------
        UPDATE FacturaProveedor
        SET Estado = CASE 
                        WHEN Saldo <= 0 THEN 'Pagada'
                        WHEN Saldo < Total THEN 'Parcial'
                        ELSE 'Abierta'
                     END
        WHERE IdFactura = @IdFacturaProveedor;

        --------------------------------------------------------
        -- 10) Restar saldo actual del proveedor
        --------------------------------------------------------
        UPDATE Proveedor
        SET SaldoActual = SaldoActual - @MontoDevolucion
        WHERE IdProveedor = @IdProveedor;

        --------------------------------------------------------
        -- FIN EXITOSO
        --------------------------------------------------------
        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
GO


CREATE PROCEDURE sp_ElaborarProducto_Transaccional
(
    @IdProductoFinal INT,
    @CantidadElaborada INT,
    @InsumosCadena NVARCHAR(MAX)   -- ejemplo: '5|2;7|1;9|3'
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -----------------------------------------------------
        -- 1. Crear encabezado de elaboración
        -----------------------------------------------------
        INSERT INTO ElaboracionProducto(IdProductoFinal, Fecha, CantidadElaborada)
        VALUES(@IdProductoFinal, GETDATE(), @CantidadElaborada);

        DECLARE @IdElaboracion INT = SCOPE_IDENTITY();

        -----------------------------------------------------
        -- 2. Crear tabla temporal para los insumos
        -----------------------------------------------------
        CREATE TABLE #Insumos (
            IdProductoInsumo INT,
            CantidadUsada INT
        );

        -----------------------------------------------------
        -- 3. Procesar cadena de insumos
        -----------------------------------------------------
        DECLARE @Item NVARCHAR(200);

        DECLARE cursorInsumos CURSOR FOR
            SELECT TRIM(value) 
            FROM STRING_SPLIT(@InsumosCadena, ';')
            WHERE TRIM(value) <> '';

        OPEN cursorInsumos;
        FETCH NEXT FROM cursorInsumos INTO @Item;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @IdInsumo INT, @CantUsada INT;

            SELECT 
                @IdInsumo = PARSENAME(REPLACE(@Item,'|','.'), 2),
                @CantUsada = PARSENAME(REPLACE(@Item,'|','.'), 1);

            INSERT INTO #Insumos
            VALUES(@IdInsumo, @CantUsada);

            FETCH NEXT FROM cursorInsumos INTO @Item;
        END

        CLOSE cursorInsumos;
        DEALLOCATE cursorInsumos;

        -----------------------------------------------------
        -- 4. Validar inventario disponible para cada insumo
        -----------------------------------------------------
        IF EXISTS (
            SELECT 1
            FROM #Insumos i
            JOIN Producto p ON p.IdProducto = i.IdProductoInsumo
            WHERE p.Existencia < i.CantidadUsada
        )
        BEGIN
            RAISERROR('Inventario insuficiente para uno o más insumos.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -----------------------------------------------------
        -- 5. Registrar detalle de elaboración
        -----------------------------------------------------
        INSERT INTO ElaboracionDetalle(IdElaboracion, IdProductoInsumo, CantidadUsada)
        SELECT @IdElaboracion, IdProductoInsumo, CantidadUsada
        FROM #Insumos;

        -----------------------------------------------------
        -- 6. Descontar inventario de los insumos
        -----------------------------------------------------
        UPDATE p
        SET p.Existencia = p.Existencia - i.CantidadUsada
        FROM Producto p
        JOIN #Insumos i ON p.IdProducto = i.IdProductoInsumo;

        -----------------------------------------------------
        -- 7. Aumentar inventario del producto final
        -----------------------------------------------------
        UPDATE Producto
        SET Existencia = Existencia + @CantidadElaborada
        WHERE IdProducto = @IdProductoFinal;

        -----------------------------------------------------
        -- 8. Registrar KARDEX (si aplica)
        -----------------------------------------------------
        -- Salida de insumos
        INSERT INTO InventarioKardex(IdProducto, Movimiento, Cantidad, Saldo, Observaciones, Fecha)
        SELECT 
            IdProductoInsumo,
            'Elaboración - Consumo',
            -CantidadUsada,
            (SELECT Existencia FROM Producto WHERE IdProducto = IdProductoInsumo),
            CONCAT('Elaboración #', @IdElaboracion),
            GETDATE()
        FROM #Insumos;

        -- Entrada del producto final
        INSERT INTO InventarioKardex(IdProducto, Movimiento, Cantidad, Saldo, Observaciones, Fecha)
        VALUES(
            @IdProductoFinal,
            'Elaboración - Producción',
            @CantidadElaborada,
            (SELECT Existencia FROM Producto WHERE IdProducto = @IdProductoFinal),
            CONCAT('Elaboración #', @IdElaboracion),
            GETDATE()
        );

        -----------------------------------------------------
        -- FIN
        -----------------------------------------------------
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
GO



