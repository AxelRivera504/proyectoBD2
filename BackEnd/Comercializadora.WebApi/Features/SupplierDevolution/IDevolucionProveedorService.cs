using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.SupplierDevolution.Dto;

namespace Comercializadora.WebApi.Features.SupplierDevolution
{
    public interface IDevolucionProveedorService
    {
        Task<Response<List<ProveedorConFacturaPendienteDto>>> GetProveedoresConPendientes();
        Task<Response<List<FacturaPendienteDto>>> GetFacturasPendientesPorProveedor(int idProveedor);
        Task<Response<List<ProductoFacturaProveedorDto>>> GetProductosPorFactura(int idFactura);
        Task<Response<string>> DevolverProductoAsync(DevolucionProveedorDto payload);
    }
}
