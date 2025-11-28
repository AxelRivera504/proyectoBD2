namespace Comercializadora.WebApi.Features.SupplierDevolution.Dto
{
    public class ProductoFacturaProveedorDto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int CantidadFacturada { get; set; }
        public decimal PrecioCompra { get; set; }
        public decimal Monto { get; set; }
        public int Existencia { get; set; }
    }

}
