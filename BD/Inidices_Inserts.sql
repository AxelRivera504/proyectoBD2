---- MÓDULO 9: Índices sugeridos y algunos INSERTs de prueba
--GO

--CREATE INDEX IX_Producto_Nombre ON Producto(Nombre);
--CREATE INDEX IX_FacturaProveedor_Proveedor ON FacturaProveedor(IdProveedor);
--CREATE INDEX IX_VentaMayorista_Cliente ON VentaMayorista(IdCliente);
--GO

---- Datos de prueba mínimos (ejecuta si quieres probar)
--INSERT INTO Proveedor(Nombre,RTN,Telefono,Direccion,LimiteCredito) VALUES
--('Farmacia Central','0801199800017','2222-2222','Tegucigalpa',50000),
--('Distribuidora Salud','0801199800025','2233-3344','San Pedro',30000);
--GO

--INSERT INTO Producto(Nombre,Descripcion,PrecioCosto,PrecioVenta,Existencia,Minimo,Tipo) VALUES
--('Paracetamol 500mg','Tabletas 20','5.00','10.00',100,20,'Producto'),
--('Ibuprofeno 400mg','Tabletas 30','7.00','14.00',50,15,'Producto'),
--('Sulfato de Sodio (MP)','Materia prima','2.00','0.00',200,50,'MateriaPrima');
--GO

--INSERT INTO Cliente(Nombre,Direccion,Telefono,Tipo,Saldo) VALUES
--('Clínica La Esperanza','Col. Centro','3333-3333','Mayorista',0),
--('Cliente Final','Col. Norte','4444-4444','Detalle',0);
--GO

---- Crear una orden de compra de prueba
--INSERT INTO OrdenCompra(IdProveedor,Estado) VALUES(1,'Pendiente');
--DECLARE @oc INT = SCOPE_IDENTITY();
--INSERT INTO OrdenCompraDetalle(IdOrdenCompra,IdProducto,CantidadSolicitada,PrecioUnitario) VALUES(@oc,1,50,5.00);
--GO






























EXEC sp_Proveedor_Insert 
    @Nombre='Farmacia Central', 
    @RTN='0801199800017',
    @Telefono='2222-2222',
    @Direccion='Tegucigalpa',
    @LimiteCredito=50000;

EXEC sp_Proveedor_Insert 
    @Nombre='Distribuidora Salud', 
    @RTN='0801199700011',
    @Telefono='3333-4444',
    @Direccion='San Pedro Sula',
    @LimiteCredito=30000;



EXEC sp_Producto_Insert 
    @Nombre='Paracetamol 500mg',
    @Descripcion='Tabletas 20',
    @PrecioCosto=5,
    @PrecioVenta=10,
    @Existencia=100,
    @Minimo=20,
    @Tipo='Producto';

EXEC sp_Producto_Insert 
    @Nombre='Ibuprofeno 400mg',
    @Descripcion='Tabletas 30',
    @PrecioCosto=7,
    @PrecioVenta=14,
    @Existencia=50,
    @Minimo=15,
    @Tipo='Producto';

EXEC sp_Producto_Insert 
    @Nombre='Sulfato de Sodio (MP)',
    @Descripcion='Materia prima',
    @PrecioCosto=2,
    @PrecioVenta=0,
    @Existencia=200,
    @Minimo=50,
    @Tipo='MateriaPrima';



EXEC sp_Cliente_Insert 
    @Nombre='Clínica La Esperanza',
    @Direccion='Col. Centro',
    @Telefono='3333-3333',
    @Tipo='Mayorista';

EXEC sp_Cliente_Insert 
    @Nombre='Farmacia San José',
    @Direccion='Barrio Abajo',
    @Telefono='9999-8888',
    @Tipo='Mayorista';

EXEC sp_Cliente_Insert 
    @Nombre='Cliente Final',
    @Direccion='Col. Kennedy',
    @Telefono='8888-7777',
    @Tipo='Detalle';


    go

DECLARE @IdOC INT;

EXEC sp_OrdenCompra_Insert 
    @IdProveedor = 1,
    @IdOrdenCompra = @IdOC OUTPUT;

PRINT 'La orden generada es: ' + CAST(@IdOC AS VARCHAR);


-- Agregar detalle
EXEC sp_OrdenCompraDetalle_Insert 
    @IdOrdenCompra=@IdOC,
    @IdProducto=1,
    @CantidadSolicitada=50,
    @PrecioUnitario=5;

EXEC sp_OrdenCompraDetalle_Insert 
    @IdOrdenCompra=@IdOC,
    @IdProducto=2,
    @CantidadSolicitada=30,
    @PrecioUnitario=7;

EXEC sp_FacturaProveedor_Insert 
@IdProveedor = 1,
@Total = 460.00;   -- (50*5 + 30*7 = 460)


DECLARE @IdVenta INT;

EXEC sp_ProcesarVentaMayorista_Transaccional 
    @IdCliente = 4,
    @Total = 600.00,
    @IdVentaOut = @IdVenta OUTPUT;

SELECT @IdVenta AS IdFacturaCliente;


EXEC sp_VentaMayoristaDetalle_Insert
    @IdVenta = @IdVenta,
    @IdProducto = 1,
    @Cantidad = 10,
    @PrecioUnitario = 10;

EXEC sp_VentaMayoristaDetalle_Insert
    @IdVenta = @IdVenta,
    @IdProducto = 2,
    @Cantidad = 5,
    @PrecioUnitario = 14;



DECLARE @i INT = 1;

WHILE @i <= 5
BEGIN
    DECLARE @IdVentaTemp INT;

    EXEC sp_ProcesarVentaMayorista_Transaccional 
        @IdCliente = 2,
        @Total = 300.00,
        @IdVentaOut = @IdVentaTemp OUTPUT;

    EXEC sp_VentaMayoristaDetalle_Insert 
        @IdVentaTemp, 6, 5, 15;

    SET @i += 1;
END


SELECT * FROM [dbo].[vw_EstadoCuentaClientes]





--Pago de facturas clientes
-- Pago parcial
EXEC sp_PagoCliente_Insert 
    @IdCliente = 1,
    @Monto = 300.00;

-- Otro pago
EXEC sp_PagoCliente_Insert 
    @IdCliente = 1,
    @Monto = 400.00;

-- Pago parcial
EXEC sp_PagoCliente_Insert 
    @IdCliente = 2,
    @Monto = 500.00;

-- Otro pago para completar una
EXEC sp_PagoCliente_Insert 
    @IdCliente = 2,
    @Monto = 400.00;

-- Pago parcial
EXEC sp_PagoCliente_Insert 
    @IdCliente = 4,
    @Monto = 200.00;

-- Otro pago pequeño
EXEC sp_PagoCliente_Insert 
    @IdCliente = 4,
    @Monto = 100.00;




SELECT * FROM [dbo].[vw_EstadoCuentaClientes]





DECLARE @IdElab INT;

EXEC sp_ElaboracionProducto_Insert 
    @IdProductoFinal = 1,
    @CantidadElaborada = 30,
    @IdElaboracion = @IdElab OUTPUT;

PRINT 'Elaboración creada con ID: ' + CAST(@IdElab AS VARCHAR);


EXEC sp_ElaboracionDetalle_Insert 
    @IdElaboracion = @IdElab,
    @IdProductoInsumo = 3,   -- Sulfato de Sodio
    @CantidadUsada = 15;


DECLARE @IdFacturaProv INT;

EXEC sp_FacturaProveedor_Insert 
    @IdProveedor = 1,
    @Total = 1200.00,
    @IdFactura = @IdFacturaProv OUTPUT;

PRINT 'Factura creada: ' + CAST(@IdFacturaProv AS VARCHAR);

EXEC sp_Deposito_Insert 
    @TotalDepositado = 2000.00;


DECLARE @IdPagoProv INT;

EXEC sp_PagoProveedor_Insert 
    @MontoTotal = 1200.00,
    @TipoPago = 'Transferencia',
    @IdPago = @IdPagoProv OUTPUT;

PRINT 'Pago creado: ' + CAST(@IdPagoProv AS VARCHAR);

EXEC sp_PagoProveedorDetalle_Insert 
    @IdPago = @IdPagoProv,
    @IdFactura = @IdFacturaProv,
    @MontoPagado = 1200.00;
