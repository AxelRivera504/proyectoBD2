namespace Comercializadora.WebApi.Common
{
    public class Messages
    {
        public const string PROCESO_ERROR = "El proceso falló por la razón {0}";

        #region Productos
        public const string PRODUCTOS_OBTENIDOS_EXITOSAMENTE = "Producto obtenidos con exito";
        public const string PRODUCTOS_NO_OBTENIDOS_EXITOSAMENTE = "No hay productos con cantidad disponible";
        public const string CLIENTES_OBTENIDOS_EXITOSAMENTE = "Clientes obtenidos con exito";
        public const string CLIENTES_NO_OBTENIDOS_EXITOSAMENTE = "No hay Clientes disponibles";
        public const string PRODUCTO_AGREGADO_EXITOSAMENTE = "Producto agregado exitosamente";
        public const string PRODUCTO_ACTUALIZAR_NO_ENCONTRADO = "Producto que se desea actualizar no existe";
        public const string PRODUCTO_ACTUALIZADO_EXITOSAMENTE = "Producto actualizado exitosamente";
        public const string PRODUCTO_DESCATIVAR_NO_ENCONTRADO = "Producto que se desea desactivar no existe";
        public const string PRODUCTO_DESCATIVAR_EXITOSAMENTE = "Producto desactivado exitosamente";
        public const string FACTURA_CREADA_EXITOSAMENTE = "Factura agregada exitosamente";
        public const string PROVEEDORES_OBTENIDOS_EXITOSAMENTE = "Proveedores obtenidos con exito";
        public const string PROVEEDORES_NO_OBTENIDOS_EXITOSAMENTE = "No hay Proveedores disponibles";
        #endregion
    }
    public static class CodesHttp
    {
        public const string SUCCESS_CODE = "200";
        public const string CLIENT_ERROR_CODE = "400";
        public const string SERVER_ERROR_CODE = "500";
        public const string NOTFOUND = "404";
    }
}
