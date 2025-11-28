namespace Comercializadora.WebApi.Features.Payments.Suppliers.Dto
{
    public class PaymentSingleDto
    {
        public int IdFactura { get; set; }
        public decimal MontoPagado { get; set; }
        public string TipoPago { get; set; } = "Efectivo";
    }
}
