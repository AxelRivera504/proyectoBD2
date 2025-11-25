namespace Comercializadora.WebApi.Features.Products.Dto
{
    public class ProductDto
    {
        public int IdProducto { get; set; }

        public string Nombre { get; set; } = null!;

        public string? Descripcion { get; set; }

        public decimal PrecioCosto { get; set; }

        public decimal PrecioVenta { get; set; }

        public int Existencia { get; set; }

        public int Minimo { get; set; }

        public DateOnly? FechaVencimiento { get; set; }

        public string? Tipo { get; set; }
    }
}
