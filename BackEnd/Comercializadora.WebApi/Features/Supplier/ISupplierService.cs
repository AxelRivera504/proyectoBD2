using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Supplier.Dto;

namespace Comercializadora.WebApi.Features.Supplier
{
    public interface ISupplierService
    {
        Response<List<SupplierDto>> GetAll();
        Task<Response<string>> AddSupplier(SupplierPayload supplierDtoPeticion);
        Task<Response<string>> UpdateSupplier(SupplierPayload supplierDtoPeticion);
        Task<Response<string>> DeleteSupplier(SupplierPayload supplierDtoPeticion);
    }
}
