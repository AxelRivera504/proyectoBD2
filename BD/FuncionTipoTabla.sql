-- MÓDULO 5: FUNCIONES TIPO TABLA
GO

CREATE FUNCTION tvf_FacturasAbiertasPorProveedor(@IdProveedor INT)
RETURNS TABLE
AS
RETURN (
    SELECT IdFactura, Fecha, Total, Saldo FROM FacturaProveedor
    WHERE IdProveedor=@IdProveedor AND Saldo>0
);
GO

CREATE FUNCTION tvf_ProductosBajoStock()
RETURNS TABLE
AS
RETURN (
    SELECT IdProducto, Nombre, Existencia, Minimo FROM Producto WHERE Existencia <= Minimo
);
GO

CREATE FUNCTION tvf_KardexPorProducto(@IdProducto INT)
RETURNS TABLE
AS
RETURN (
    SELECT * FROM InventarioKardex WHERE IdProducto=@IdProducto
);
GO

CREATE FUNCTION tvf_VentasPendientesPorCliente(@IdCliente INT)
RETURNS TABLE
AS
RETURN (
    SELECT IdVenta, Fecha, Total FROM VentaMayorista WHERE IdCliente=@IdCliente AND Estado='Pendiente'
);
GO

CREATE FUNCTION tvf_PagosProveedorPorPeriodo(@FechaInicio DATETIME, @FechaFin DATETIME)
RETURNS TABLE
AS
RETURN (
    SELECT p.IdPago, p.Fecha, p.MontoTotal, p.TipoPago, pd.IdFactura, pd.MontoPagado
    FROM PagoProveedor p
    LEFT JOIN PagoProveedorDetalle pd ON pd.IdPago = p.IdPago
    WHERE p.Fecha BETWEEN @FechaInicio AND @FechaFin
);
GO
