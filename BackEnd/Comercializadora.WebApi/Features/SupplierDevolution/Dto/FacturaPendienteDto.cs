namespace Comercializadora.WebApi.Features.SupplierDevolution.Dto
{
    public class FacturaPendienteDto
    {
        public int IdFactura { get; set; }
        public DateTime? Fecha { get; set; }
        public decimal Total { get; set; }
        public decimal Saldo { get; set; }
        public string Estado { get; set; } = string.Empty;
    }

}
