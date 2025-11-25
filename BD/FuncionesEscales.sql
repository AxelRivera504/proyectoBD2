-- MÓDULO 4: FUNCIONES ESCALARES
GO

CREATE FUNCTION fn_NombreProducto(@IdProducto INT)
RETURNS NVARCHAR(150)
AS
BEGIN
    DECLARE @Nombre NVARCHAR(150);
    SELECT @Nombre = Nombre FROM Producto WHERE IdProducto = @IdProducto;
    RETURN @Nombre;
END
GO

CREATE FUNCTION fn_ExistenciaProducto(@IdProducto INT)
RETURNS INT
AS
BEGIN
    DECLARE @Existencia INT;
    SELECT @Existencia = Existencia FROM Producto WHERE IdProducto = @IdProducto;
    RETURN ISNULL(@Existencia,0);
END
GO

CREATE FUNCTION fn_DescuentoCliente(@IdCliente INT)
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @Tipo NVARCHAR(20);
    SELECT @Tipo = Tipo FROM Cliente WHERE IdCliente=@IdCliente;
    IF @Tipo = 'Mayorista'
        RETURN 10.00;
    RETURN 0.00;
END
GO

CREATE FUNCTION fn_SaldoProveedor(@IdProveedor INT)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Saldo DECIMAL(18,2);
    SELECT @Saldo = SaldoActual FROM Proveedor WHERE IdProveedor = @IdProveedor;
    RETURN ISNULL(@Saldo,0.00);
END
GO

CREATE FUNCTION fn_EstaPorDebajoMinimo(@IdProducto INT)
RETURNS BIT
AS
BEGIN
    DECLARE @Existencia INT, @Minimo INT;
    SELECT @Existencia = Existencia, @Minimo = Minimo FROM Producto WHERE IdProducto=@IdProducto;
    IF @Existencia <= ISNULL(@Minimo,0) RETURN 1;
    RETURN 0;
END
GO
