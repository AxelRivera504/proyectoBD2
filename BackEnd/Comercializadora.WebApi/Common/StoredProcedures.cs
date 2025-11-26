namespace Comercializadora.WebApi.Common
{
    public class StoredProcedures
    {
        #region Products
        public static string GetAllProducts = "EXECUTE dbo.sp_Producto_GetAll";
        public static string InsertProduct = "EXECUTE dbo.sp_Producto_Insert @Nombre, @Descripcion, @PrecioCosto, @PrecioVenta, @Existencia, @Minimo, @FechaVencimiento, @Tipo";
        public static string UpdateProduct = "EXECUTE dbo.sp_Producto_Update @IdProducto, @Nombre, @Descripcion, @PrecioCosto, @PrecioVenta, @Existencia, @Minimo, @FechaVencimiento, @Tipo";
        public static string Deleteroduct = "EXECUTE dbo.sp_Producto_Delete @IdProducto";
        #endregion

        #region Clients
        public static string GetAllClients = "EXECUTE dbo.sp_Cliente_GetAll";
        public static string InsertClient = "EXECUTE dbo.sp_Cliente_Insert @Nombre, @Direccion, @Telefono, @Tipo";
        public static string UpdateClient = "EXECUTE dbo.sp_Cliente_Update @IdCliente, @Nombre, @Direccion, @Telefono, @Tipo";
        public static string DeleteClient = "EXECUTE dbo.sp_Cliente_Delete @IdCliente";
        #endregion

        #region Suppliers
        public static string GetAllSuppliers = "EXECUTE dbo.sp_Proveedor_GetAll";
        public static string InsertSupplier = "EXECUTE dbo.sp_Proveedor_Insert @Nombre, @RTN, @Direccion, @Telefono, @LimiteCredito";
        public static string UpdateSupplier = "EXECUTE dbo.sp_Proveedor_Update @IdProveedor, @Nombre, @RTN, @Direccion, @Telefono, @LimiteCredito";
        public static string DeleteSupplier = "EXECUTE dbo.sp_Proveedor_Delete @IdProveedor";
        #endregion

        #region CashInvoice
        public static string InsertVentaContado = "EXECUTE dbo.sp_VentaContado_Insert @Total, @IdVentaContado OUTPUT";
        public static string InsertVentaDetalleContado = "EXECUTE dbo.sp_VentaDetallealContado_Insert @IdVentaContado, @IdProducto, @Cantidad, @Precio";
        #endregion
    }
}
