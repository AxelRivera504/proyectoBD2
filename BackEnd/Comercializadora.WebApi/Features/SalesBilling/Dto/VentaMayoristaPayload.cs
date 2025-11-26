namespace Comercializadora.WebApi.Features.SalesBilling.Dto
{
    public class VentaMayoristaPayload
    {
        public int idCliente { get; set; }
        public decimal total { get; set; }
        public List<VentaMayoristaDetallePayload> detalles { get; set; }
    }

}
