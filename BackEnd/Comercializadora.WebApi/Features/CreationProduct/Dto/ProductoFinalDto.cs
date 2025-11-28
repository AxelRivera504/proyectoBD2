namespace Comercializadora.WebApi.Features.CreationProduct.Dto
{
    public class ProductoFinalDto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public string? Descripcion { get; set; }
        public int Existencia { get; set; }
        public decimal PrecioVenta { get; set; }
    }
}
