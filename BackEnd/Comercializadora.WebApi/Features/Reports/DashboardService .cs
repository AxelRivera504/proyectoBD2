using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Reports.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.EntityFrameworkCore;

namespace Comercializadora.WebApi.Features.Reports
{
    public class DashboardService : IDashboardService
    {
        private readonly ProyectoBd2Context _context;

        public DashboardService(ProyectoBd2Context context)
        {
            _context = context;
        }

        public Response<DashboardSummaryDto> GetSummary()
        {
            try
            {
                var now = DateTime.Now;
                var firstDay = new DateTime(now.Year, now.Month, 1);
                var nextMonth = firstDay.AddMonths(1);

                var productosEnStock = _context.Productos.Sum(p => p.Existencia);

                var ventasMes = _context.VentaMayorista
                    .Where(v => v.Fecha >= firstDay && v.Fecha < nextMonth)
                    .Sum(v => (decimal?)v.Total) ?? 0m;

                var ordenesPendientes = _context.OrdenCompras
                    .Count(o => o.Estado == "Pendiente");

                var productosPorAgotarse = _context.TvfProductosBajoStocks
                    .FromSqlRaw("SELECT * FROM dbo.tvf_ProductosBajoStock()")
                    .Count();

                var dto = new DashboardSummaryDto
                {
                    ProductosEnStock = productosEnStock,
                    VentasDelMes = ventasMes,
                    OrdenesPendientes = ordenesPendientes,
                    ProductosPorAgotarse = productosPorAgotarse
                };

                return Response<DashboardSummaryDto>.Success(
                    dto, "Resumen de dashboard obtenido", CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<DashboardSummaryDto>.Fault(
                    $"Error: {ex.Message}", CodesHttp.SERVER_ERROR_CODE, new DashboardSummaryDto());
            }
        }

        public Response<List<ProductoBajoStockDto>> GetProductosBajoStock()
        {
            try
            {
                var productos = _context.TvfProductosBajoStocks
                    .FromSqlRaw("SELECT * FROM dbo.tvf_ProductosBajoStock()")
                    .AsEnumerable()
                    .Select(p => new ProductoBajoStockDto
                    {
                        IdProducto = p.IdProducto,
                        Nombre = p.Nombre,
                        Existencia = p.Existencia,
                        Minimo = p.Minimo
                    }).ToList();

                if (!productos.Any())
                    return Response<List<ProductoBajoStockDto>>.Fault(
                        "No hay productos por agotarse",
                        CodesHttp.SERVER_ERROR_CODE,
                        new List<ProductoBajoStockDto>());

                return Response<List<ProductoBajoStockDto>>.Success(
                    productos, "Productos obtenidos correctamente", CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<ProductoBajoStockDto>>.Fault(
                    $"Error: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE,
                    new List<ProductoBajoStockDto>());
            }
        }

        public Response<List<FacturaAbiertaProveedorDto>> GetFacturasAbiertasPorProveedor(int idProveedor)
        {
            try
            {
                var facturas = _context.TvfFacturasAbiertasPorProveedors
                    .FromSqlRaw("SELECT * FROM dbo.tvf_FacturasAbiertasPorProveedor({0})", idProveedor)
                    .AsEnumerable()
                    .Select(f => new FacturaAbiertaProveedorDto
                    {
                        IdFactura = f.IdFactura,
                        Fecha = f.Fecha,
                        Total = f.Total,
                        Saldo = f.Saldo
                    }).ToList();

                if (!facturas.Any())
                    return Response<List<FacturaAbiertaProveedorDto>>.Fault(
                        "El proveedor no tiene facturas abiertas",
                        CodesHttp.SERVER_ERROR_CODE,
                        new List<FacturaAbiertaProveedorDto>());

                return Response<List<FacturaAbiertaProveedorDto>>.Success(
                    facturas, "Facturas obtenidas correctamente", CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<FacturaAbiertaProveedorDto>>.Fault(
                    $"Error: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE,
                    new List<FacturaAbiertaProveedorDto>());
            }
        }

        public Response<List<VentaPendienteClienteDto>> GetVentasPendientesPorCliente(int idCliente)
        {
            try
            {
                var ventas = _context.TvfVentasPendientesPorClientes
                    .FromSqlRaw("SELECT * FROM dbo.tvf_VentasPendientesPorCliente({0})", idCliente)
                    .AsEnumerable()
                    .Select(v => new VentaPendienteClienteDto
                    {
                        IdVenta = v.IdVenta,
                        Fecha = v.Fecha,
                        Total = v.Total
                    }).ToList();

                if (!ventas.Any())
                    return Response<List<VentaPendienteClienteDto>>.Fault(
                        "El cliente no tiene ventas pendientes",
                        CodesHttp.SERVER_ERROR_CODE,
                        new List<VentaPendienteClienteDto>());

                return Response<List<VentaPendienteClienteDto>>.Success(
                    ventas, "Ventas pendientes obtenidas correctamente", CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<VentaPendienteClienteDto>>.Fault(
                    $"Error: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE,
                    new List<VentaPendienteClienteDto>());
            }
        }

        public Response<List<PagoProveedorPeriodoDto>> GetPagosProveedorPorPeriodo(DateTime fechaInicio, DateTime fechaFin)
        {
            try
            {
                var pagos = _context.TvfPagosProveedorPorPeriodos
                    .FromSqlRaw("SELECT * FROM dbo.tvf_PagosProveedorPorPeriodo({0}, {1})", fechaInicio, fechaFin)
                    .AsEnumerable()
                    .Select(p => new PagoProveedorPeriodoDto
                    {
                        IdPago = p.IdPago,
                        Fecha = p.Fecha,
                        MontoTotal = p.MontoTotal,
                        TipoPago = p.TipoPago,
                        IdFactura = p.IdFactura,
                        MontoPagado = p.MontoPagado
                    }).ToList();

                if (!pagos.Any())
                    return Response<List<PagoProveedorPeriodoDto>>.Fault(
                        "No hay pagos registrados en el período",
                        CodesHttp.SERVER_ERROR_CODE,
                        new List<PagoProveedorPeriodoDto>());

                return Response<List<PagoProveedorPeriodoDto>>.Success(
                    pagos, "Pagos obtenidos correctamente", CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<PagoProveedorPeriodoDto>>.Fault(
                    $"Error: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE,
                    new List<PagoProveedorPeriodoDto>());
            }
        }

        public Response<List<KardexProductoDto>> GetKardexPorProducto(int idProducto)
        {
            try
            {
                var movimientos = _context.TvfKardexPorProductos
                    .FromSqlRaw("SELECT * FROM dbo.tvf_KardexPorProducto({0})", idProducto)
                    .AsEnumerable()
                    .Select(k => new KardexProductoDto
                    {
                        IdKardex = k.IdKardex,
                        IdProducto = k.IdProducto,
                        Movimiento = k.Movimiento,
                        Cantidad = k.Cantidad,
                        Saldo = k.Saldo,
                        Observaciones = k.Observaciones,
                        Fecha = k.Fecha
                    }).ToList();

                if (!movimientos.Any())
                    return Response<List<KardexProductoDto>>.Fault(
                        "El producto no tiene movimientos de kardex",
                        CodesHttp.SERVER_ERROR_CODE,
                        new List<KardexProductoDto>());

                return Response<List<KardexProductoDto>>.Success(
                    movimientos, "Kardex obtenido correctamente", CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<KardexProductoDto>>.Fault(
                    $"Error: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE,
                    new List<KardexProductoDto>());
            }
        }
    }
}
