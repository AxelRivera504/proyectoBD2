using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Products.Dto;

namespace Comercializadora.WebApi.Features.Products
{
    public interface IProductService
    {
        Response<List<ProductDto>> GetAll();
        Task<Response<string>> AddProduct(ProductPayload productDtoPeticion);
        Task<Response<string>> UpdateProduct(ProductPayload productDtoPeticion);
        Task<Response<string>> DeleteProduct(ProductPayload productDtoPeticion);
    }
}
