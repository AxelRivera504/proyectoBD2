-- MÓDULO 8: PROCEDIMIENTOS QUE USAN TRANSACCIONES
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
               CONCAT('Recepción OC ',@IdOrdenCompra), GETDATE()
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

        INSERT INTO VentaMayorista(IdCliente,Fecha,Total,Estado)
        VALUES(@IdCliente,GETDATE(),@Total,'Pendiente');

        SET @IdVentaOut = SCOPE_IDENTITY();

        -- Se asume que la aplicación insertará detalles con el SP correspondiente
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

-- 3) Pago proveedor transaccional que aplica montos a facturas (usa cursor internamente)
CREATE PROCEDURE sp_PagoProveedor_Transaccional
    @IdProveedor INT,
    @MontoTotal DECIMAL(18,2),
    @TipoPago NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO PagoProveedor(Fecha,MontoTotal,TipoPago) VALUES(GETDATE(),@MontoTotal,@TipoPago);
        DECLARE @IdPago INT = SCOPE_IDENTITY();

        DECLARE @MontoRestante DECIMAL(18,2) = @MontoTotal;
        DECLARE @IdFactura INT; DECLARE @SaldoFactura DECIMAL(18,2);

        DECLARE curF CURSOR FOR
            SELECT IdFactura, Saldo FROM FacturaProveedor WHERE IdProveedor=@IdProveedor AND Saldo>0 ORDER BY Fecha;

        OPEN curF;
        FETCH NEXT FROM curF INTO @IdFactura, @SaldoFactura;
        WHILE @@FETCH_STATUS = 0 AND @MontoRestante > 0
        BEGIN
            IF @MontoRestante >= @SaldoFactura
            BEGIN
                INSERT INTO PagoProveedorDetalle(IdPago,IdFactura,MontoPagado) VALUES(@IdPago,@IdFactura,@SaldoFactura);
                UPDATE FacturaProveedor SET Saldo=0, Estado='Pagada' WHERE IdFactura=@IdFactura;
                SET @MontoRestante = @MontoRestante - @SaldoFactura;
            END
            ELSE
            BEGIN
                INSERT INTO PagoProveedorDetalle(IdPago,IdFactura,MontoPagado) VALUES(@IdPago,@IdFactura,@MontoRestante);
                UPDATE FacturaProveedor SET Saldo = Saldo - @MontoRestante, Estado='Parcial' WHERE IdFactura=@IdFactura;
                SET @MontoRestante = 0;
            END

            FETCH NEXT FROM curF INTO @IdFactura, @SaldoFactura;
        END

        CLOSE curF; DEALLOCATE curF;

        UPDATE Proveedor SET SaldoActual = SaldoActual - @MontoTotal WHERE IdProveedor=@IdProveedor;

        COMMIT TRANSACTION;
        SELECT @IdPago AS IdPagoAplicado;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en pago proveedor transaccional: %s',16,1,@ErrMsg);
    END CATCH
END
GO
