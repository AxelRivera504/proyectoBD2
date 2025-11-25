-- MÓDULO 7: PROCEDIMIENTOS CON CURSORES
GO

-- a) Procesar saldos mensuales de proveedores (usa cursor para iterar proveedores)
CREATE PROCEDURE sp_ProcesarSaldosMensuales_Proveedores
    @FechaCorte DATE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @IdProv INT, @Nombre NVARCHAR(150), @TotalFacturas DECIMAL(18,2);

    DECLARE @Report TABLE (IdProv INT, Nombre NVARCHAR(150), TotalPendiente DECIMAL(18,2), FechaGen DATE);

    DECLARE curs CURSOR FOR
        SELECT IdProveedor, Nombre FROM Proveedor;

    OPEN curs;
    FETCH NEXT FROM curs INTO @IdProv, @Nombre;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SELECT @TotalFacturas = ISNULL(SUM(Saldo),0) FROM FacturaProveedor WHERE IdProveedor=@IdProv;
        INSERT INTO @Report VALUES(@IdProv,@Nombre,@TotalFacturas,@FechaCorte);
        FETCH NEXT FROM curs INTO @IdProv, @Nombre;
    END

    CLOSE curs;
    DEALLOCATE curs;

    SELECT * FROM @Report;
END
GO

-- b) Generar ordenes de compra automáticas para productos bajo stock
CREATE PROCEDURE sp_GenerarOrdenesCompra_PorStock
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @IdProducto INT, @Existencia INT, @Minimo INT, @cantidadSolicitar INT, @IdProveedor INT, @IdOC INT;

    DECLARE curProd CURSOR FOR
        SELECT IdProducto, Existencia, Minimo FROM Producto WHERE Existencia <= Minimo;

    OPEN curProd;
    FETCH NEXT FROM curProd INTO @IdProducto, @Existencia, @Minimo;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @cantidadSolicitar = (@Minimo * 2) - @Existencia;
        IF @cantidadSolicitar > 0
        BEGIN
            SELECT TOP 1 @IdProveedor = IdProveedor FROM Proveedor ORDER BY IdProveedor;
            IF @IdProveedor IS NOT NULL
            BEGIN
                -- Crear orden compra y obtener id
                INSERT INTO OrdenCompra(IdProveedor,Fecha,Estado) VALUES(@IdProveedor,GETDATE(),'Pendiente');
                SET @IdOC = SCOPE_IDENTITY();

                INSERT INTO OrdenCompraDetalle(IdOrdenCompra,IdProducto,CantidadSolicitada,PrecioUnitario)
                VALUES(@IdOC, @IdProducto, @cantidadSolicitar, (SELECT PrecioCosto FROM Producto WHERE IdProducto=@IdProducto));
            END
        END

        FETCH NEXT FROM curProd INTO @IdProducto, @Existencia, @Minimo;
    END

    CLOSE curProd;
    DEALLOCATE curProd;
END
GO

-- c) Aplicar un pago global de proveedor a sus facturas (antiguas primero)
CREATE PROCEDURE sp_AplicarPagoProveedor_ProRata
    @IdProveedor INT,
    @MontoTotal DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @IdFactura INT, @SaldoFactura DECIMAL(18,2);
    DECLARE @MontoRestante DECIMAL(18,2) = @MontoTotal;
    DECLARE @IdPago INT;

    -- Crear registro de pago general
    INSERT INTO PagoProveedor(Fecha,MontoTotal,TipoPago) VALUES(GETDATE(),@MontoTotal,'AplicacionProRata');
    SET @IdPago = SCOPE_IDENTITY();

    DECLARE curFact CURSOR FOR
        SELECT IdFactura, Saldo FROM FacturaProveedor WHERE IdProveedor=@IdProveedor AND Saldo>0 ORDER BY Fecha;

    OPEN curFact;
    FETCH NEXT FROM curFact INTO @IdFactura, @SaldoFactura;
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

        FETCH NEXT FROM curFact INTO @IdFactura, @SaldoFactura;
    END

    CLOSE curFact;
    DEALLOCATE curFact;

    -- Actualizar saldoActual del proveedor
    UPDATE Proveedor SET SaldoActual = SaldoActual - @MontoTotal WHERE IdProveedor=@IdProveedor;
END
GO
