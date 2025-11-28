using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

namespace Comercializadora.WebApi.Features.Reports
{
    public class ReportService : IReportService
    {
        private readonly ProyectoBd2Context _context;

        public ReportService(ProyectoBd2Context context)
        {
            _context = context;
        }

        // ---------------------- VENTAS AL CONTADO ----------------------
        public Response<List<VwRptVentasContado>> GetVentasContado(DateTime? desde, DateTime? hasta)
        {
            try
            {
                var query = _context.VwRptVentasContados.AsQueryable();

                if (desde.HasValue)
                    query = query.Where(x => x.Fecha >= desde.Value);

                if (hasta.HasValue)
                    query = query.Where(x => x.Fecha <= hasta.Value);

                var data = query.ToList();

                return Response<List<VwRptVentasContado>>.Success(data, "OK", "200");
            }
            catch (Exception ex)
            {
                return Response<List<VwRptVentasContado>>.Fault(ex.Message, "500", new List<VwRptVentasContado>());
            }
        }

        // ---------------------- VENTAS MAYORISTAS ----------------------
        public Response<List<VwRptVentasMayoristasEncabezado>> GetVentasMayoristas(DateTime? desde, DateTime? hasta, int? idCliente)
        {
            try
            {
                var query = _context.VwRptVentasMayoristasEncabezados.AsQueryable();

                if (desde.HasValue)
                    query = query.Where(x => x.Fecha >= desde.Value);

                if (hasta.HasValue)
                    query = query.Where(x => x.Fecha <= hasta.Value);

                if (idCliente.HasValue && idCliente > 0)
                    query = query.Where(x => x.IdCliente == idCliente.Value);

                return Response<List<VwRptVentasMayoristasEncabezado>>.Success(query.ToList(), "OK", "200");
            }
            catch (Exception ex)
            {
                return Response<List<VwRptVentasMayoristasEncabezado>>.Fault(ex.Message, "500", new List<VwRptVentasMayoristasEncabezado>());
            }
        }


        // ---------------------- ORDENES DE COMPRA ----------------------
        public Response<List<VwRptOrdenesCompraEncabezado>> GetOrdenesCompra(DateTime? desde, DateTime? hasta, int? idProveedor)
        {
            try
            {
                var query = _context.VwRptOrdenesCompraEncabezados.AsQueryable();

                if (desde.HasValue)
                    query = query.Where(x => x.Fecha >= desde.Value);

                if (hasta.HasValue)
                    query = query.Where(x => x.Fecha <= hasta.Value);

                if (idProveedor.HasValue && idProveedor > 0)
                    query = query.Where(x => x.IdProveedor == idProveedor.Value);

                return Response<List<VwRptOrdenesCompraEncabezado>>.Success(query.ToList(), "OK", "200");
            }
            catch (Exception ex)
            {
                return Response<List<VwRptOrdenesCompraEncabezado>>.Fault(ex.Message, "500", new List<VwRptOrdenesCompraEncabezado>());
            }
        }

        // ---------------------- PRODUCTOS MAS VENDIDOS ----------------------
        public Response<List<VwRptProductosMasVendido>> GetProductosMasVendidos()
        {
            try
            {
                var query = _context.VwRptProductosMasVendidos.AsQueryable();

                return Response<List<VwRptProductosMasVendido>>.Success(query.ToList(), "OK", "200");
            }
            catch (Exception ex)
            {
                return Response<List<VwRptProductosMasVendido>>.Fault(ex.Message, "500", new List<VwRptProductosMasVendido>());
            }
        }

        // ---------------------- TOP CLIENTES ----------------------
        public Response<List<VwRptTopClientesVenta>> GetTopClientes()
        {
            try
            {
                var query = _context.VwRptTopClientesVentas.AsQueryable();

                return Response<List<VwRptTopClientesVenta>>.Success(query.ToList(), "OK", "200");
            }
            catch (Exception ex)
            {
                return Response<List<VwRptTopClientesVenta>>.Fault(ex.Message, "500", new List<VwRptTopClientesVenta>());
            }
        }

        // ---------------------- DEVOLUCIONES PROVEEDOR ----------------------
        public Response<List<VwRptDevolucionesProveedor>> GetDevoluciones(int? idProveedor, DateTime? desde, DateTime? hasta)
        {
            try
            {
                var query = _context.VwRptDevolucionesProveedors.AsQueryable();

                if (idProveedor.HasValue)
                    query = query.Where(x => x.IdProveedor == idProveedor);

                if (desde.HasValue)
                    query = query.Where(x => x.Fecha >= desde.Value);

                if (hasta.HasValue)
                    query = query.Where(x => x.Fecha <= hasta.Value);

                return Response<List<VwRptDevolucionesProveedor>>.Success(query.ToList(), "OK", "200");
            }
            catch (Exception ex)
            {
                return Response<List<VwRptDevolucionesProveedor>>.Fault(ex.Message, "500", new List<VwRptDevolucionesProveedor>());
            }
        }
    }

}
