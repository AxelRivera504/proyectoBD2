namespace Comercializadora.WebApi.Features.SalesBilling.Dto
{
    public class VentaDetallePayload
    {
        public int idProducto { get; set; }

        public int cantidad { get; set; }

        public decimal precio { get; set; }

        public int? idVentaContado { get; set; }
    }
}
