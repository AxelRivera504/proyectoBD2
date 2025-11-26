namespace Comercializadora.WebApi.Features.SalesBilling.Dto
{
    public class VentaMayoristaDetalleDto
    {
        public int IdProducto { get; set; }
        public string NombreProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }
}
