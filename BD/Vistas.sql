-- M�DULO 3: VISTAS
GO
CREATE VIEW vw_RPT_VentasMayoristas_Encabezado AS
SELECT
    v.IdVenta,
    v.Fecha,
    v.Total,
    v.Saldo,
    v.Estado,
    c.IdCliente,
    c.Nombre AS Cliente
FROM VentaMayorista v
JOIN Cliente c ON c.IdCliente = v.IdCliente;
GO

CREATE VIEW vw_RPT_VentasMayoristas_Detalle AS
SELECT
    vd.IdVenta,
    vd.IdProducto,
    p.Nombre AS Producto,
    vd.Cantidad,
    vd.PrecioUnitario,
    (vd.Cantidad * vd.PrecioUnitario) AS Subtotal
FROM VentaMayoristaDetalle vd
JOIN Producto p ON p.IdProducto = vd.IdProducto;
GO

CREATE VIEW vw_RPT_VentasContado AS
SELECT
    v.IdVentaContado,
    v.Fecha,
    v.Total,
    vd.IdProducto,
    p.Nombre AS Producto,
    vd.Cantidad,
    p.PrecioVenta,
    (vd.Cantidad * p.PrecioVenta) AS Subtotal
FROM VentaDetalleAlContado vd
JOIN Producto p ON p.IdProducto = vd.IdProducto
JOIN VentaContado v ON v.IdVentaContado = vd.IdVentaContado;
GO

CREATE VIEW vw_RPT_OrdenesCompra_Encabezado AS
SELECT
    oc.IdOrdenCompra,
    oc.Fecha,
    oc.Estado,
    prov.IdProveedor,
    prov.Nombre
FROM OrdenCompra oc
JOIN Proveedor prov ON prov.IdProveedor = oc.IdProveedor;
GO

CREATE VIEW vw_RPT_OrdenesCompra_Detalle AS
SELECT
    ocd.IdOrdenCompra,
    ocd.IdProducto,
    p.Nombre AS Producto,
    ocd.CantidadSolicitada,
    ocd.PrecioUnitario,
    (ocd.CantidadSolicitada * ocd.PrecioUnitario) AS Subtotal
FROM OrdenCompraDetalle ocd
JOIN Producto p ON p.IdProducto = ocd.IdProducto;
GO


CREATE VIEW vw_RPT_TopClientesVentas AS
SELECT TOP 50
    c.IdCliente,
    c.Nombre AS Cliente,
    COUNT(v.IdVenta) AS CantidadVentas,
    SUM(v.Total) AS TotalVendido
FROM VentaMayorista v
JOIN Cliente c ON c.IdCliente = v.IdCliente
GROUP BY c.IdCliente, c.Nombre
ORDER BY TotalVendido DESC;
GO


CREATE VIEW vw_RPT_ProductosMasVendidos AS
SELECT 
    p.IdProducto,
    p.Nombre,
    SUM(vd.Cantidad) AS CantidadVendida,
    SUM(vd.Cantidad * vd.PrecioUnitario) AS MontoGenerado
FROM VentaMayoristaDetalle vd
JOIN VentaMayorista v ON v.IdVenta = vd.IdVenta
JOIN Producto p ON p.IdProducto = vd.IdProducto
GROUP BY p.IdProducto, p.Nombre;
GO

CREATE VIEW vw_RPT_DevolucionesProveedor AS
SELECT
    dp.IdProveedor,
    prov.Nombre,
    dp.IdProducto,
    p.Nombre AS Producto,
    dp.Cantidad,
    dp.Fecha,
    dp.Motivo
FROM DevolucionProveedor dp
JOIN Producto p ON p.IdProducto = dp.IdProducto
JOIN Proveedor prov ON prov.IdProveedor = dp.IdProveedor;
GO
