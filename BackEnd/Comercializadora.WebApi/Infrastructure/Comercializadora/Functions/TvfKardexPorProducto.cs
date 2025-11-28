namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Functions
{
    public class TvfKardexPorProducto
    {
        public int IdKardex { get; set; }
        public int IdProducto { get; set; }
        public string Movimiento { get; set; } = string.Empty;
        public decimal Cantidad { get; set; }
        public decimal Saldo { get; set; }
        public string Observaciones { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
    }
}
