namespace Comercializadora.WebApi.Features.SalesBilling.Dto
{
    public class VentaMayoristaDto
    {
        public int IdVenta { get; set; }
        public int IdCliente { get; set; }
        public string NombreCliente { get; set; }
        public DateTime? Fecha { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; }

        public List<VentaMayoristaDetalleDto> Detalles { get; set; }
    }
}
