namespace Comercializadora.WebApi.Features.PurchaseOrder.Dto
{
    public class PurchaseOrderDto
    {
        public int IdOrdenCompra { get; set; }
        public int IdProveedor { get; set; }
        public string NombreProveedor { get; set; }
        public DateTime? Fecha { get; set; }
        public string Estado { get; set; }
        public decimal Total { get; set; }

        public List<PurchaseOrderDetailDto> Detalles { get; set; } = new();
    }

}
