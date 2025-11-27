namespace Comercializadora.WebApi.Features.PurchaseOrder.Dto
{
    public class PurchaseOrderPayload
    {
        public int IdProveedor { get; set; }
        public List<PurchaseOrderDetailPayload> Detalles { get; set; } = new();
    }

}
