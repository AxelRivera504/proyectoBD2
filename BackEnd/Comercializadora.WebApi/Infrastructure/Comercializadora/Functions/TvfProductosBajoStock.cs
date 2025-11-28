namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Functions
{
    public class TvfProductosBajoStock
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int Existencia { get; set; }
        public int Minimo { get; set; }
    }
}
