using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.PurchaseOrder.Dto;

namespace Comercializadora.WebApi.Features.PurchaseOrders
{
    public interface IPurchaseOrderService
    {
        Task<Response<string>> CrearOrdenCompraAsync(PurchaseOrderPayload payload);
        Response<List<PurchaseOrderDto>> ObtenerOrdenesCompra();
        Task<Response<string>> RecivePurcharOrder(RecivePurchaseOrder payload);
    }
}
