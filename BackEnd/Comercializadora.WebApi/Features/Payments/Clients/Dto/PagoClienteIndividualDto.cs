namespace Comercializadora.WebApi.Features.Payments.Clients.Dto
{
    public class PagoClienteIndividualDto
    {
        public int IdCliente { get; set; }
        public int IdVenta { get; set; }
        public decimal MontoPagado { get; set; }
        public string TipoPago { get; set; } = "";
    }
}
