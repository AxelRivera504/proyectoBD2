using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Reports.Dto;

namespace Comercializadora.WebApi.Features.Reports
{
    public interface IDashboardService
    {
        Response<DashboardSummaryDto> GetSummary();
        Response<List<ProductoBajoStockDto>> GetProductosBajoStock();
        Response<List<FacturaAbiertaProveedorDto>> GetFacturasAbiertasPorProveedor(int idProveedor);
        Response<List<VentaPendienteClienteDto>> GetVentasPendientesPorCliente(int idCliente);
        Response<List<PagoProveedorPeriodoDto>> GetPagosProveedorPorPeriodo(DateTime fechaInicio, DateTime fechaFin);
        Response<List<KardexProductoDto>> GetKardexPorProducto(int idProducto);
    }
}
