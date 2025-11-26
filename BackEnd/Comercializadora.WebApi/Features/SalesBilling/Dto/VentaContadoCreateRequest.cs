namespace Comercializadora.WebApi.Features.SalesBilling.Dto
{
    public class VentaContadoCreateRequest
    {
        public decimal total { get; set; }
        public List<VentaDetallePayload> detalles { get; set; }
    }

}
