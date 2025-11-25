-- MÓDULO 6: TRIGGERS
GO

-- 1) Al insertar FacturaProveedor -> actualizar SaldoActual del proveedor
CREATE TRIGGER trg_FacturaProveedor_Insert_UpdateProveedorSaldo
ON FacturaProveedor
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET p.SaldoActual = p.SaldoActual + i.Total
    FROM Proveedor p
    JOIN inserted i ON i.IdProveedor = p.IdProveedor;
END
GO

-- 2) Al insertar PagoProveedorDetalle -> reducir saldo de factura y proveedor
CREATE TRIGGER trg_PagoProveedorDetalle_AplicaPago
ON PagoProveedorDetalle
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Reducir saldo en FacturaProveedor
    UPDATE f
    SET f.Saldo = f.Saldo - i.MontoPagado,
        f.Estado = CASE 
                    WHEN f.Saldo - i.MontoPagado <= 0 THEN 'Pagada'
                    WHEN f.Saldo - i.MontoPagado < f.Total THEN 'Parcial'
                    ELSE f.Estado
                   END
    FROM FacturaProveedor f
    JOIN inserted i ON i.IdFactura = f.IdFactura;

    -- Reducir SaldoActual del proveedor
    UPDATE prov
    SET prov.SaldoActual = prov.SaldoActual - i.MontoPagado
    FROM Proveedor prov
    JOIN FacturaProveedor f ON f.IdProveedor = prov.IdProveedor
    JOIN inserted i ON i.IdFactura = f.IdFactura;
END
GO

-- 3) VentaMayoristaDetalle -> ajustar existencia y kardex
CREATE TRIGGER trg_VentaMayoristaDetalle_AjustaInventario
ON VentaMayoristaDetalle
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE p
    SET p.Existencia = p.Existencia - i.Cantidad
    FROM Producto p
    JOIN inserted i ON p.IdProducto = i.IdProducto;

    INSERT INTO InventarioKardex(IdProducto,Movimiento,Cantidad,Saldo,Observaciones,Fecha)
    SELECT i.IdProducto, 'Salida VentaMayorista', i.Cantidad,
           (SELECT Existencia FROM Producto WHERE IdProducto=i.IdProducto),
           'Venta mayorista', GETDATE()
    FROM inserted i;
END
GO

-- 4) VentaDetallealContado -> ajustar existencia y kardex
CREATE TRIGGER trg_VentaDetalleAlContado_AjustaInventario
ON VentaDetallealContado
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET p.Existencia = p.Existencia - i.Cantidad
    FROM Producto p
    JOIN inserted i ON p.IdProducto = i.IdProducto;

    INSERT INTO InventarioKardex(IdProducto,Movimiento,Cantidad,Saldo,Observaciones,Fecha)
    SELECT i.IdProducto,'Salida VentaDetalle', i.Cantidad,(SELECT Existencia FROM Producto WHERE IdProducto=i.IdProducto),'Venta al contado',GETDATE()
    FROM inserted i;
END
GO

-- 5) DevolucionProveedor -> aumentar existencia y kardex
CREATE TRIGGER trg_DevolucionProveedor_AjustaInventario
ON DevolucionProveedor
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET p.Existencia = p.Existencia + d.Cantidad
    FROM Producto p
    JOIN inserted d ON p.IdProducto = d.IdProducto;

    INSERT INTO InventarioKardex(IdProducto,Movimiento,Cantidad,Saldo,Observaciones,Fecha)
    SELECT d.IdProducto,'Entrada Devolucion',d.Cantidad,(SELECT Existencia FROM Producto WHERE IdProducto=d.IdProducto),'Devolución a proveedor',GETDATE()
    FROM inserted d;
END
GO

-- 6) ElaboracionDetalle -> restar insumos y kardex
CREATE TRIGGER trg_ElaboracionDetalle_RestaInsumos
ON ElaboracionDetalle
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET p.Existencia = p.Existencia - d.CantidadUsada
    FROM Producto p
    JOIN inserted d ON p.IdProducto = d.IdProductoInsumo;

    INSERT INTO InventarioKardex(IdProducto,Movimiento,Cantidad,Saldo,Observaciones,Fecha)
    SELECT d.IdProductoInsumo,'Salida Elaboracion',d.CantidadUsada,(SELECT Existencia FROM Producto WHERE IdProducto=d.IdProductoInsumo),'Uso en elaboración',GETDATE()
    FROM inserted d;
END
GO

-- 7) ElaboracionProducto -> aumentar producto final y kardex
CREATE TRIGGER trg_ElaboracionProducto_AumentaFinal
ON ElaboracionProducto
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET p.Existencia = p.Existencia + e.CantidadElaborada
    FROM Producto p
    JOIN inserted e ON p.IdProducto = e.IdProductoFinal;

    INSERT INTO InventarioKardex(IdProducto,Movimiento,Cantidad,Saldo,Observaciones,Fecha)
    SELECT e.IdProductoFinal,'Entrada Elaboracion',e.CantidadElaborada,(SELECT Existencia FROM Producto WHERE IdProducto=e.IdProductoFinal),'Producto elaborado',GETDATE()
    FROM inserted e;
END
GO

-- 8) OrdenCompraDetalle UPDATE (recepción) -> registrar entrada y ajustar existencia
CREATE TRIGGER trg_OrdenCompraDetalle_Recepcion
ON OrdenCompraDetalle
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(CantidadRecibida)
    BEGIN
        INSERT INTO InventarioKardex(IdProducto,Movimiento,Cantidad,Saldo,Observaciones,Fecha)
        SELECT d.IdProducto,'Entrada OrdenCompra',d.CantidadRecibida,
               (SELECT Existencia + d.CantidadRecibida FROM Producto WHERE IdProducto=d.IdProducto),
               CONCAT('Recepción OC ',d.IdOrdenCompra),GETDATE()
        FROM inserted d
        WHERE d.CantidadRecibida IS NOT NULL AND d.CantidadRecibida>0;

        UPDATE p
        SET p.Existencia = p.Existencia + i.CantidadRecibida
        FROM Producto p
        JOIN inserted i ON p.IdProducto = i.IdProducto;
    END
END
GO

-- 9) PagoCliente -> reducir saldo cliente
CREATE TRIGGER trg_PagoCliente_AplicaPago
ON PagoCliente
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE c
    SET c.Saldo = c.Saldo - i.Monto
    FROM Cliente c
    JOIN inserted i ON c.IdCliente = i.IdCliente;
END
GO

-- 10) Evitar existencia negativa al actualizar producto
CREATE TRIGGER trg_Producto_CheckExistenciaNonNegative
ON Producto
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted i WHERE i.Existencia < 0)
    BEGIN
        RAISERROR('La existencia no puede ser negativa.',16,1);
        ROLLBACK TRANSACTION;
    END
END
GO

CREATE TRIGGER trg_VentaMayorista_SumaSaldoCliente
ON VentaMayorista
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE c
    SET c.Saldo = c.Saldo + i.Total
    FROM Cliente c
    JOIN inserted i ON c.IdCliente = i.IdCliente;
END
GO

