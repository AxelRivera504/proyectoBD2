namespace Comercializadora.WebApi.Common
{
    public class StoredProcedures
    {
        public static string GetAllProducts = "EXECUTE dbo.sp_Producto_GetAll";
        public static string InsertProduct = "EXECUTE dbo.sp_Producto_Insert @Nombre, @Descripcion, @PrecioCosto, @PrecioVenta, @Existencia, @Minimo, @FechaVencimiento, @Tipo";
        public static string UpdateProduct = "EXECUTE dbo.sp_Producto_Update @IdProducto, @Nombre, @Descripcion, @PrecioCosto, @PrecioVenta, @Existencia, @Minimo, @FechaVencimiento, @Tipo";
        public static string Deleteroduct = "EXECUTE dbo.sp_Producto_Delete @IdProducto";
    }
}
