namespace Comercializadora.WebApi.Features.SupplierDevolution.Dto
{
    public class ProductoFacturaProveedorSpDto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public int CantidadFacturada { get; set; }
        public decimal PrecioCompra { get; set; }
        public decimal Monto { get; set; }
        public int Existencia { get; set; }
    }
}
