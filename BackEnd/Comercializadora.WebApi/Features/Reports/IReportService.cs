using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

namespace Comercializadora.WebApi.Features.Reports
{
    public interface IReportService
    {
        Response<List<VwRptVentasContado>> GetVentasContado(DateTime? desde, DateTime? hasta);
        Response<List<VwRptVentasMayoristasEncabezado>> GetVentasMayoristas(DateTime? desde, DateTime? hasta, int? idCliente);
        Response<List<VwRptOrdenesCompraEncabezado>> GetOrdenesCompra(DateTime? desde, DateTime? hasta, int? idProveedor);
        Response<List<VwRptProductosMasVendido>> GetProductosMasVendidos();
        Response<List<VwRptTopClientesVenta>> GetTopClientes();
        Response<List<VwRptDevolucionesProveedor>> GetDevoluciones(int? idProveedor, DateTime? desde, DateTime? hasta);
    }
}
