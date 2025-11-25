-- MÓDULO 1: CREACIÓN DE TABLAS
-- Ejecutar todo este bloque primero
SET NOCOUNT ON;
GO

CREATE TABLE Proveedor(
    IdProveedor INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    RTN NVARCHAR(20),
    Telefono NVARCHAR(20),
    Direccion NVARCHAR(300),
    LimiteCredito DECIMAL(18,2) DEFAULT 0,
    SaldoActual DECIMAL(18,2) DEFAULT 0,
    FechaRegistro DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE Producto(
    IdProducto INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(300),
    PrecioCosto DECIMAL(18,2) NOT NULL DEFAULT 0,
    PrecioVenta DECIMAL(18,2) NOT NULL DEFAULT 0,
    Existencia INT NOT NULL DEFAULT 0,
    Minimo INT NOT NULL DEFAULT 0,
    FechaVencimiento DATE NULL,
    Tipo NVARCHAR(50) DEFAULT 'Producto'
);
GO

CREATE TABLE Cliente(
    IdCliente INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Direccion NVARCHAR(300),
    Telefono NVARCHAR(20),
    Tipo NVARCHAR(20) DEFAULT 'Detalle',
    Saldo DECIMAL(18,2) DEFAULT 0,
    FechaRegistro DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE OrdenCompra(
    IdOrdenCompra INT IDENTITY(1,1) PRIMARY KEY,
    IdProveedor INT NOT NULL FOREIGN KEY REFERENCES Proveedor(IdProveedor),
    Fecha DATETIME DEFAULT GETDATE(),
    Estado NVARCHAR(20) DEFAULT 'Pendiente'
);
GO

CREATE TABLE OrdenCompraDetalle(
    IdDetalle INT IDENTITY(1,1) PRIMARY KEY,
    IdOrdenCompra INT NOT NULL FOREIGN KEY REFERENCES OrdenCompra(IdOrdenCompra) ON DELETE CASCADE,
    IdProducto INT NOT NULL FOREIGN KEY REFERENCES Producto(IdProducto),
    CantidadSolicitada INT NOT NULL,
    CantidadRecibida INT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL
);
GO

CREATE TABLE FacturaProveedor(
    IdFactura INT IDENTITY(1,1) PRIMARY KEY,
    IdProveedor INT NOT NULL FOREIGN KEY REFERENCES Proveedor(IdProveedor),
    Fecha DATETIME DEFAULT GETDATE(),
    Total DECIMAL(18,2) NOT NULL,
    Saldo DECIMAL(18,2) NOT NULL,
    Estado NVARCHAR(20) DEFAULT 'Abierta'
);
GO

CREATE TABLE PagoProveedor(
    IdPago INT IDENTITY(1,1) PRIMARY KEY,
    Fecha DATETIME DEFAULT GETDATE(),
    MontoTotal DECIMAL(18,2) NOT NULL,
    TipoPago NVARCHAR(20)
);
GO

CREATE TABLE PagoProveedorDetalle(
    IdPagoDetalle INT IDENTITY(1,1) PRIMARY KEY,
    IdPago INT NOT NULL FOREIGN KEY REFERENCES PagoProveedor(IdPago) ON DELETE CASCADE,
    IdFactura INT NOT NULL FOREIGN KEY REFERENCES FacturaProveedor(IdFactura),
    MontoPagado DECIMAL(18,2) NOT NULL
);
GO

CREATE TABLE VentaMayorista(
    IdVenta INT IDENTITY(1,1) PRIMARY KEY,
    IdCliente INT NOT NULL FOREIGN KEY REFERENCES Cliente(IdCliente),
    Fecha DATETIME DEFAULT GETDATE(),
    Total DECIMAL(18,2) NOT NULL,
    Estado NVARCHAR(20) DEFAULT 'Pendiente'
);
GO

CREATE TABLE VentaMayoristaDetalle(
    IdDetalleVM INT IDENTITY(1,1) PRIMARY KEY,
    IdVenta INT NOT NULL FOREIGN KEY REFERENCES VentaMayorista(IdVenta) ON DELETE CASCADE,
    IdProducto INT NOT NULL FOREIGN KEY REFERENCES Producto(IdProducto),
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL
);
GO

CREATE TABLE VentaDetallealContado(
    IdVentaDetalle INT IDENTITY(1,1) PRIMARY KEY,
    Fecha DATETIME DEFAULT GETDATE(),
    IdProducto INT NOT NULL FOREIGN KEY REFERENCES Producto(IdProducto),
    Cantidad INT NOT NULL,
    Precio DECIMAL(18,2) NOT NULL
);
GO

CREATE TABLE PagoCliente(
    IdPagoCliente INT IDENTITY(1,1) PRIMARY KEY,
    IdCliente INT NOT NULL FOREIGN KEY REFERENCES Cliente(IdCliente),
    Fecha DATETIME DEFAULT GETDATE(),
    Monto DECIMAL(18,2) NOT NULL
);
GO

CREATE TABLE Deposito(
    IdDeposito INT IDENTITY(1,1) PRIMARY KEY,
    Fecha DATETIME DEFAULT GETDATE(),
    TotalDepositado DECIMAL(18,2) NOT NULL
);
GO

CREATE TABLE DevolucionProveedor(
    IdDevolucion INT IDENTITY(1,1) PRIMARY KEY,
    IdProveedor INT NOT NULL FOREIGN KEY REFERENCES Proveedor(IdProveedor),
    IdProducto INT NOT NULL FOREIGN KEY REFERENCES Producto(IdProducto),
    Fecha DATETIME DEFAULT GETDATE(),
    Cantidad INT NOT NULL,
    Motivo NVARCHAR(300)
);
GO

CREATE TABLE ElaboracionProducto(
    IdElaboracion INT IDENTITY(1,1) PRIMARY KEY,
    IdProductoFinal INT NOT NULL FOREIGN KEY REFERENCES Producto(IdProducto),
    Fecha DATETIME DEFAULT GETDATE(),
    CantidadElaborada INT NOT NULL
);
GO

CREATE TABLE ElaboracionDetalle(
    IdDetalleElab INT IDENTITY(1,1) PRIMARY KEY,
    IdElaboracion INT NOT NULL FOREIGN KEY REFERENCES ElaboracionProducto(IdElaboracion) ON DELETE CASCADE,
    IdProductoInsumo INT NOT NULL FOREIGN KEY REFERENCES Producto(IdProducto),
    CantidadUsada INT NOT NULL
);
GO

CREATE TABLE InventarioKardex(
    IdKardex INT IDENTITY(1,1) PRIMARY KEY,
    IdProducto INT NOT NULL FOREIGN KEY REFERENCES Producto(IdProducto),
    Fecha DATETIME DEFAULT GETDATE(),
    Movimiento NVARCHAR(50),
    Cantidad INT,
    Saldo INT,
    Observaciones NVARCHAR(300)
);
GO
