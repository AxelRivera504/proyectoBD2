namespace Comercializadora.WebApi.Features.PurchaseOrder.Dto
{
    public class PurchaseOrderDetailPayload
    {
        public int IdProducto { get; set; }
        public int CantidadSolicitada { get; set; }
        public decimal PrecioUnitario { get; set; }
    }

}
