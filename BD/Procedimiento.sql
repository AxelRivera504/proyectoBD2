-- M�DULO 2: CRUD (proveedor, producto, cliente) y ejemplos de pattern
-- Ejecutar todo el bloque
GO

-- Proveedor CRUD
CREATE PROCEDURE sp_Proveedor_Insert
    @Nombre NVARCHAR(150),
    @RTN NVARCHAR(20)=NULL,
    @Telefono NVARCHAR(20)=NULL,
    @Direccion NVARCHAR(300)=NULL,
    @LimiteCredito DECIMAL(18,2)=0
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Proveedor(Nombre,RTN,Telefono,Direccion,LimiteCredito)
    VALUES(@Nombre,@RTN,@Telefono,@Direccion,@LimiteCredito);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO

CREATE PROCEDURE sp_Proveedor_Update
    @IdProveedor INT,
    @Nombre NVARCHAR(150),
    @RTN NVARCHAR(20)=NULL,
    @Telefono NVARCHAR(20)=NULL,
    @Direccion NVARCHAR(300)=NULL,
    @LimiteCredito DECIMAL(18,2)=0
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Proveedor
    SET Nombre=@Nombre, RTN=@RTN, Telefono=@Telefono, Direccion=@Direccion, LimiteCredito=@LimiteCredito
    WHERE IdProveedor=@IdProveedor;
END
GO

CREATE PROCEDURE sp_Proveedor_Delete
    @IdProveedor INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Proveedor WHERE IdProveedor=@IdProveedor;
END
GO

CREATE PROCEDURE sp_Proveedor_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Proveedor;
END
GO

-- Producto CRUD
CREATE PROCEDURE sp_Producto_Insert
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(300)=NULL,
    @PrecioCosto DECIMAL(18,2)=0,
    @PrecioVenta DECIMAL(18,2)=0,
    @Existencia INT=0,
    @Minimo INT=0,
    @FechaVencimiento DATE=NULL,
    @Tipo NVARCHAR(50)='Producto'
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Producto(Nombre,Descripcion,PrecioCosto,PrecioVenta,Existencia,Minimo,FechaVencimiento,Tipo)
    VALUES(@Nombre,@Descripcion,@PrecioCosto,@PrecioVenta,@Existencia,@Minimo,@FechaVencimiento,@Tipo);

    DECLARE @NewId INT = SCOPE_IDENTITY();

    INSERT INTO InventarioKardex(IdProducto,Movimiento,Cantidad,Saldo,Observaciones,Fecha)
    VALUES(@NewId,'Ajuste Inicial',@Existencia,@Existencia,'Creaci�n de producto',GETDATE());

    SELECT @NewId AS NewId;
END
GO

CREATE PROCEDURE sp_Producto_Update
    @IdProducto INT,
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(300)=NULL,
    @PrecioCosto DECIMAL(18,2)=0,
    @PrecioVenta DECIMAL(18,2)=0,
    @Existencia INT=0,
    @Minimo INT=0,
    @FechaVencimiento DATE=NULL,
    @Tipo NVARCHAR(50)='Producto'
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Producto
    SET Nombre=@Nombre,Descripcion=@Descripcion,PrecioCosto=@PrecioCosto,PrecioVenta=@PrecioVenta,
        Existencia=@Existencia,Minimo=@Minimo,FechaVencimiento=@FechaVencimiento,Tipo=@Tipo
    WHERE IdProducto=@IdProducto;

    INSERT INTO InventarioKardex(IdProducto,Movimiento,Cantidad,Saldo,Observaciones,Fecha)
    VALUES(@IdProducto,'Ajuste',@Existencia,(SELECT Existencia FROM Producto WHERE IdProducto=@IdProducto),'Actualizaci�n por SP',GETDATE());
END
GO

CREATE PROCEDURE sp_Producto_Delete
    @IdProducto INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Producto WHERE IdProducto=@IdProducto;
END
GO

CREATE PROCEDURE sp_Producto_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Producto;
END
GO

-- Cliente CRUD
CREATE PROCEDURE sp_Cliente_Insert
    @Nombre NVARCHAR(150),
    @Direccion NVARCHAR(300)=NULL,
    @Telefono NVARCHAR(20)=NULL,
    @Tipo NVARCHAR(20)='Detalle'
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Cliente(Nombre,Direccion,Telefono,Tipo)
    VALUES(@Nombre,@Direccion,@Telefono,@Tipo);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO

CREATE PROCEDURE sp_Cliente_Update
    @IdCliente INT,
    @Nombre NVARCHAR(150),
    @Direccion NVARCHAR(300)=NULL,
    @Telefono NVARCHAR(20)=NULL,
    @Tipo NVARCHAR(20)='Detalle'
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Cliente SET Nombre=@Nombre, Direccion=@Direccion, Telefono=@Telefono, Tipo=@Tipo
    WHERE IdCliente=@IdCliente;
END
GO

CREATE PROCEDURE sp_Cliente_Delete
    @IdCliente INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Cliente WHERE IdCliente=@IdCliente;
END
GO

CREATE PROCEDURE sp_Cliente_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Cliente;
END
GO

-- Otros CRUD resumidos (plantilla para replicar)
CREATE PROCEDURE sp_FacturaProveedor_Insert
    @IdProveedor INT, @Total DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO FacturaProveedor(IdProveedor,Total,Saldo)
    VALUES(@IdProveedor,@Total,@Total);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO

CREATE PROCEDURE sp_PagoProveedor_Insert
    @Fecha DATETIME, @MontoTotal DECIMAL(18,2), @TipoPago NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO PagoProveedor(Fecha,MontoTotal,TipoPago)
    VALUES(@Fecha,@MontoTotal,@TipoPago);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO

CREATE PROCEDURE sp_PagoProveedorDetalle_Insert
    @IdPago INT, @IdFactura INT, @MontoPagado DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO PagoProveedorDetalle(IdPago,IdFactura,MontoPagado)
    VALUES(@IdPago,@IdFactura,@MontoPagado);
END
GO

CREATE PROCEDURE sp_OrdenCompra_Insert
    @IdProveedor INT,
    @IdOrdenCompra INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO OrdenCompra(IdProveedor, Fecha, Estado)
    VALUES(@IdProveedor, GETDATE(), 'Pendiente');

    SET @IdOrdenCompra = SCOPE_IDENTITY();
END
GO

CREATE PROCEDURE sp_OrdenCompraDetalle_Insert
    @IdOrdenCompra INT,
    @IdProducto INT,
    @CantidadSolicitada INT,
    @PrecioUnitario DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO OrdenCompraDetalle(IdOrdenCompra,IdProducto,CantidadSolicitada,PrecioUnitario)
    VALUES(@IdOrdenCompra,@IdProducto,@CantidadSolicitada,@PrecioUnitario);
END
GO

CREATE PROCEDURE sp_VentaMayoristaDetalle_Insert
    @IdVenta INT,
    @IdProducto INT,
    @Cantidad INT,
    @PrecioUnitario DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO VentaMayoristaDetalle(IdVenta, IdProducto, Cantidad, PrecioUnitario)
    VALUES(@IdVenta, @IdProducto, @Cantidad, @PrecioUnitario);
END
GO

CREATE PROCEDURE sp_PagoCliente_Insert
    @IdCliente INT,
    @Monto DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO PagoCliente (IdCliente, Monto, Fecha)
    VALUES (@IdCliente, @Monto, GETDATE());
END
GO

CREATE PROCEDURE sp_ElaboracionProducto_Insert
    @IdProductoFinal INT,
    @CantidadElaborada INT,
    @IdElaboracion INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ElaboracionProducto(IdProductoFinal, CantidadElaborada, Fecha)
    VALUES (@IdProductoFinal, @CantidadElaborada, GETDATE());

    SET @IdElaboracion = SCOPE_IDENTITY();
END
GO

CREATE PROCEDURE sp_ElaboracionDetalle_Insert
    @IdElaboracion INT,
    @IdProductoInsumo INT,
    @CantidadUsada INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ElaboracionDetalle(IdElaboracion, IdProductoInsumo, CantidadUsada)
    VALUES (@IdElaboracion, @IdProductoInsumo, @CantidadUsada);
END
GO

CREATE PROCEDURE sp_Deposito_Insert
    @TotalDepositado DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Deposito(TotalDepositado, Fecha)
    VALUES(@TotalDepositado, GETDATE());
END
GO

CREATE OR ALTER PROCEDURE sp_FacturaProveedor_Insert
    @IdProveedor INT,
    @Total DECIMAL(18,2),
    @IdFactura INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO FacturaProveedor(IdProveedor, Total, Saldo, Estado, Fecha)
    VALUES(@IdProveedor, @Total, @Total, 'Pendiente', GETDATE());

    SET @IdFactura = SCOPE_IDENTITY();
END
GO

CREATE OR ALTER PROCEDURE sp_PagoProveedor_Insert
    @MontoTotal DECIMAL(18,2),
    @TipoPago VARCHAR(50),
    @IdPago INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO PagoProveedor(MontoTotal, TipoPago, Fecha)
    VALUES(@MontoTotal, @TipoPago, GETDATE());

    SET @IdPago = SCOPE_IDENTITY();
END
GO

CREATE OR ALTER PROCEDURE sp_PagoProveedorDetalle_Insert
    @IdPago INT,
    @IdFactura INT,
    @MontoPagado DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO PagoProveedorDetalle(IdPago, IdFactura, MontoPagado)
    VALUES(@IdPago, @IdFactura, @MontoPagado);
END
GO

CREATE PROCEDURE sp_VentaContado_Insert
    @Total DECIMAL(18,2),
    @IdVentaContado INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO VentaContado(Fecha, Total)
    VALUES(GETDATE(), @Total);

    SET @IdVentaContado = SCOPE_IDENTITY();
END;
GO

CREATE PROCEDURE sp_VentaDetallealContado_Insert
    @IdVentaContado INT,
    @IdProducto INT,
    @Cantidad INT,
    @Precio DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO VentaDetallealContado(
        IdVentaContado,
        IdProducto,
        Cantidad,
        Precio
    )
    VALUES(
        @IdVentaContado,
        @IdProducto,
        @Cantidad,
        @Precio
    );
END;
GO





