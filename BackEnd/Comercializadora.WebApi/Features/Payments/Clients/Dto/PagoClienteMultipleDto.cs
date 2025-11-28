namespace Comercializadora.WebApi.Features.Payments.Clients.Dto
{
    public class PagoClienteMultipleDto
    {
        public int IdCliente { get; set; }
        public List<PagoFacturaClienteItem> Facturas { get; set; }
        public string TipoPago { get; set; } = "";
    }
}
