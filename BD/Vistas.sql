-- MÓDULO 3: VISTAS
GO

CREATE VIEW vw_SaldoProveedores AS
SELECT p.IdProveedor, p.Nombre, p.LimiteCredito, p.SaldoActual,
    ISNULL(SUM(f.Saldo),0) AS TotalFacturasPendientes
FROM Proveedor p
LEFT JOIN FacturaProveedor f ON f.IdProveedor = p.IdProveedor AND f.Saldo>0
GROUP BY p.IdProveedor, p.Nombre, p.LimiteCredito, p.SaldoActual;
GO

CREATE VIEW vw_ProductosExistencia AS
SELECT IdProducto, Nombre, Existencia, Minimo, PrecioVenta, FechaVencimiento, Tipo
FROM Producto;
GO

CREATE VIEW vw_VentasMayoristasPendientes AS
SELECT v.IdVenta, c.IdCliente, c.Nombre AS Cliente, v.Fecha, v.Total
FROM VentaMayorista v
JOIN Cliente c ON v.IdCliente = c.IdCliente
WHERE v.Estado='Pendiente';
GO

CREATE VIEW vw_KardexUltimosMovimientos AS
SELECT k.IdKardex, k.IdProducto, p.Nombre, k.Fecha, k.Movimiento, k.Cantidad, k.Saldo, k.Observaciones
FROM InventarioKardex k
JOIN Producto p ON p.IdProducto = k.IdProducto;
GO

CREATE VIEW vw_EstadoCuentaClientes AS
SELECT c.IdCliente, c.Nombre, c.Saldo, ISNULL((SELECT SUM(Monto) FROM PagoCliente pc WHERE pc.IdCliente = c.IdCliente),0) AS PagosTotales
FROM Cliente c;
GO
