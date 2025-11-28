using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.SupplierDevolution.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Comercializadora.WebApi.Features.SupplierDevolution
{
    public class DevolucionProveedorService : IDevolucionProveedorService
    {
        private readonly ProyectoBd2Context _context;

        public DevolucionProveedorService(ProyectoBd2Context context)
        {
            _context = context;
        }

        public async Task<Response<List<ProveedorConFacturaPendienteDto>>> GetProveedoresConPendientes()
        {
            try
            {
                var proveedores = _context.ProveedorConFacturaPendientes
                    .FromSqlRaw("EXEC sp_ProveedoresConFacturasPendientes")
                    .AsEnumerable()
                    .Select(p => new ProveedorConFacturaPendienteDto
                    {
                        IdProveedor = p.IdProveedor,
                        NombreProveedor = p.NombreProveedor
                    })
                    .ToList();

                if (!proveedores.Any())
                    return Response<List<ProveedorConFacturaPendienteDto>>
                        .Fault("No hay proveedores con facturas pendientes",
                               CodesHttp.SERVER_ERROR_CODE,
                               new List<ProveedorConFacturaPendienteDto>());

                return Response<List<ProveedorConFacturaPendienteDto>>
                    .Success(proveedores,
                             "Proveedores obtenidos correctamente",
                             CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<ProveedorConFacturaPendienteDto>>
                    .Fault($"Error: {ex.Message}",
                           CodesHttp.SERVER_ERROR_CODE,
                           new List<ProveedorConFacturaPendienteDto>());
            }
        }
        public async Task<Response<List<FacturaPendienteDto>>> GetFacturasPendientesPorProveedor(int idProveedor)
        {
            try
            {
                var facturas = _context.FacturaPendientes
                    .FromSqlRaw("EXEC sp_FacturasPendientesPorProveedor @IdProveedor",
                        new SqlParameter("@IdProveedor", idProveedor))
                    .AsEnumerable()
                    .Select(f => new FacturaPendienteDto
                    {
                        IdFactura = f.IdFactura,
                        Fecha = f.Fecha,
                        Total = f.Total,
                        Saldo = f.Saldo,
                        Estado = f.Estado
                    })
                    .ToList();

                if (!facturas.Any())
                    return Response<List<FacturaPendienteDto>>
                        .Fault("El proveedor no tiene facturas pendientes",
                               CodesHttp.SERVER_ERROR_CODE,
                               new List<FacturaPendienteDto>());

                return Response<List<FacturaPendienteDto>>
                    .Success(facturas,
                             "Facturas obtenidas correctamente",
                             CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<FacturaPendienteDto>>
                    .Fault($"Error: {ex.Message}",
                           CodesHttp.SERVER_ERROR_CODE,
                           new List<FacturaPendienteDto>());
            }
        }

        public async Task<Response<string>> DevolverProductoAsync(DevolucionProveedorDto payload)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_DevolucionProveedor_Transaccional @IdFacturaProveedor, @IdProducto, @Cantidad, @Motivo",
                    new SqlParameter("@IdFacturaProveedor", payload.IdFacturaProveedor),
                    new SqlParameter("@IdProducto", payload.IdProducto),
                    new SqlParameter("@Cantidad", payload.Cantidad),
                    new SqlParameter("@Motivo", payload.Motivo)
                );

                return Response<string>.Success("Devolución registrada correctamente", "200", "");
            }
            catch (Exception ex)
            {
                return Response<string>.Fault("Error: " + ex.Message, "500", "");
            }
        }

        public async Task<Response<List<ProductoFacturaProveedorDto>>> GetProductosPorFactura(int idFactura)
        {
            try
            {
                var productos = _context.ProductosFacturaProveedor
                    .FromSqlRaw("EXEC sp_ProductosPorFacturaProveedor @IdFacturaProveedor",
                        new SqlParameter("@IdFacturaProveedor", idFactura))
                    .AsEnumerable()
                    .Select(p => new ProductoFacturaProveedorDto
                    {
                        IdProducto = p.IdProducto,
                        Nombre = p.Nombre,
                        CantidadFacturada = p.CantidadFacturada,
                        PrecioCompra = p.PrecioCompra,
                        Monto = p.Monto,
                        Existencia = p.Existencia
                    })
                    .ToList();

                if (!productos.Any())
                {
                    return Response<List<ProductoFacturaProveedorDto>>.Fault(
                        "La factura no tiene productos",
                        CodesHttp.SERVER_ERROR_CODE,
                        new List<ProductoFacturaProveedorDto>()
                    );
                }

                return Response<List<ProductoFacturaProveedorDto>>.Success(
                    productos,
                    "Productos obtenidos correctamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<List<ProductoFacturaProveedorDto>>.Fault(
                    $"Error: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE,
                    new List<ProductoFacturaProveedorDto>()
                );
            }
        }

    }
}
