namespace Comercializadora.WebApi.Features.Payments.Suppliers.Dto
{
    public class PaymentMultipleDto
    {
        public int IdProveedor { get; set; }
        public List<FacturaPagoItem> Facturas { get; set; } = new();
        public string TipoPago { get; set; } = "Efectivo";
    }
}
