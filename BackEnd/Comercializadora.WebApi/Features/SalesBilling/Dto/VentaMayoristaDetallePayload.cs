namespace Comercializadora.WebApi.Features.SalesBilling.Dto
{
    public class VentaMayoristaDetallePayload
    {
        public int idProducto { get; set; }
        public int cantidad { get; set; }
        public decimal precioUnitario { get; set; }
    }
}
