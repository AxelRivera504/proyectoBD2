namespace Comercializadora.WebApi.Features.SalesBilling.Dto
{
    public class VentasContadoDto
    {
        public int IdVentaContado { get; set; }

        public DateTime? Fecha { get; set; }

        public decimal? Total { get; set; }
        public List<VentaContadoDetalleDTO> ventaContadoDetalleDTOs { get; set; } = new List<VentaContadoDetalleDTO>();
    }

    public class VentaContadoDetalleDTO
    {
        public int IdProducto { get; set; }

        public int Cantidad { get; set; }

        public decimal Precio { get; set; }

        public int? IdVentaContado { get; set; }
    }
}
