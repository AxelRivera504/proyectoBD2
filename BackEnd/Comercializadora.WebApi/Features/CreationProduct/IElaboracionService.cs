using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.CreationProduct.Dto;

namespace Comercializadora.WebApi.Features.CreationProduct
{
    public interface IElaboracionService
    {
        Response<List<ProductoFinalDto>> GetProductosFinales();
        Response<List<InsumoDto>> GetInsumos();
        Task<Response<string>> ElaborarProducto(ElaboracionPayload payload);
    }
}
