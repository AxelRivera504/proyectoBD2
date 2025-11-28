namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Functions
{
    public class TvfPagosProveedorPorPeriodo
    {
        public int IdPago { get; set; }
        public DateTime Fecha { get; set; }
        public decimal MontoTotal { get; set; }
        public string TipoPago { get; set; } = string.Empty;
        public int? IdFactura { get; set; }
        public decimal? MontoPagado { get; set; }
    }
}
