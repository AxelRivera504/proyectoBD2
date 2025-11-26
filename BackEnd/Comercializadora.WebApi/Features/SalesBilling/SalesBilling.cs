using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.SalesBilling.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Comercializadora.WebApi.Features.SalesBilling
{
    public class SalesBilling : ISalesBilling
    {
        private readonly ProyectoBd2Context _proyectoBd2Context;

        public SalesBilling(ProyectoBd2Context proyectoBd2Context)
        {
            _proyectoBd2Context = proyectoBd2Context;
        }

        public async Task<Response<int>> CrearVentaContadoAsync(decimal total, List<VentaDetallePayload> detalles)
        {
            using var transaction = await _proyectoBd2Context.Database.BeginTransactionAsync();

            try
            {
                var idVentaContadoParam = new SqlParameter
                {
                    ParameterName = "@IdVentaContado",
                    SqlDbType = SqlDbType.Int,
                    Direction = ParameterDirection.Output
                };

                var totalParam = new SqlParameter("@Total", total);

                await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.InsertVentaContado,
                    totalParam,
                    idVentaContadoParam
                );

                int idVentaContado = (int)idVentaContadoParam.Value;

                foreach (var item in detalles)
                {
                    await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                        StoredProcedures.InsertVentaDetalleContado,
                        new SqlParameter("@IdVentaContado", idVentaContado),
                        new SqlParameter("@IdProducto", item.idProducto),
                        new SqlParameter("@Cantidad", item.cantidad),
                        new SqlParameter("@Precio", item.precio)
                    );
                }

                await transaction.CommitAsync();

                return Response<int>.Success(idVentaContado, "Venta al contado registrada correctamente", "200");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Response<int>.Fault($"Error al registrar la venta: {ex.Message}", "500", 0);
            }
        }

        public Response<List<VentasContadoDto>> ObtenerVentasContado()
        {
            try
            {
                var ventas = _proyectoBd2Context.VentaContados
                    .Select(v => new VentasContadoDto
                    {
                        IdVentaContado = v.IdVentaContado,
                        Fecha = v.Fecha,
                        Total = v.Total
                    }).ToList();

                return Response<List<VentasContadoDto>>.Success(ventas, "Ventas obtenidas", "200");
            }
            catch (Exception ex)
            {
                return Response<List<VentasContadoDto>>.Fault("Error: " + ex.Message, "500", new List<VentasContadoDto>());
            }
        }

        public Response<VentasContadoDto> ObtenerVentaContadoPorId(int id)
        {
            try
            {
                var venta = _proyectoBd2Context.VentaContados
                    .Where(v => v.IdVentaContado == id)
                    .Select(v => new VentasContadoDto
                    {
                        IdVentaContado = v.IdVentaContado,
                        Fecha = v.Fecha,
                        Total = v.Total,
                        ventaContadoDetalleDTOs = _proyectoBd2Context.VentaDetallealContados
                            .Where(d => d.IdVentaContado == v.IdVentaContado)
                            .Select(d => new VentaContadoDetalleDTO
                            {
                                IdProducto = d.IdProducto,
                                Cantidad = d.Cantidad,
                                Precio = d.Precio,
                                IdVentaContado = d.IdVentaContado
                            }).ToList()
                    }).FirstOrDefault();

                if (venta == null)
                    return Response<VentasContadoDto>.Fault("No encontrada", "404", null);

                return Response<VentasContadoDto>.Success(venta, "Venta cargada", "200");
            }
            catch (Exception ex)
            {
                return Response<VentasContadoDto>.Fault("Error: " + ex.Message, "500", null);
            }
        }

        public async Task<Response<string>> CrearVentaMayorista(VentaMayoristaPayload payload)
        {
            try
            {
                int idVenta = 0;

                // Ejecutar SP transaccional principal
                var paramId = new SqlParameter("@IdVentaOut", SqlDbType.Int)
                { Direction = ParameterDirection.Output };

                await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    "EXEC dbo.sp_ProcesarVentaMayorista_Transaccional @IdCliente, @Total, @IdVentaOut OUTPUT",
                    new SqlParameter("@IdCliente", payload.idCliente),
                    new SqlParameter("@Total", payload.total),
                    paramId
                );

                idVenta = (int)paramId.Value;

                // Insertar detalles
                foreach (var det in payload.detalles)
                {
                    await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                        "EXEC dbo.sp_VentaMayoristaDetalle_Insert @IdVenta, @IdProducto, @Cantidad, @PrecioUnitario",
                        new SqlParameter("@IdVenta", idVenta),
                        new SqlParameter("@IdProducto", det.idProducto),
                        new SqlParameter("@Cantidad", det.cantidad),
                        new SqlParameter("@PrecioUnitario", det.precioUnitario)
                    );
                }

                return Response<string>.Success("Venta mayorista registrada exitosamente",
                    "200", "");
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"El proceso falló: {ex.Message}", "500", "");
            }
        }

        public Response<List<VentaMayoristaDto>> ObtenerVentasMayorista()
        {
            try
            {
                var ventas = _proyectoBd2Context.VentaMayorista
                    .Include(v => v.IdClienteNavigation)
                    .Include(v => v.VentaMayoristaDetalles)
                        .ThenInclude(d => d.IdProductoNavigation)
                    .Select(v => new VentaMayoristaDto
                    {
                        IdVenta = v.IdVenta,
                        IdCliente = v.IdCliente,
                        NombreCliente = v.IdClienteNavigation.Nombre,
                        Fecha = v.Fecha,
                        Total = v.Total,
                        Estado = v.Estado,

                        Detalles = v.VentaMayoristaDetalles
                            .Select(d => new VentaMayoristaDetalleDto
                            {
                                IdProducto = d.IdProducto,
                                NombreProducto = d.IdProductoNavigation.Nombre,
                                Cantidad = d.Cantidad,
                                PrecioUnitario = d.PrecioUnitario
                            }).ToList()
                    })
                    .ToList();

                return Response<List<VentaMayoristaDto>>
                    .Success(ventas, "Ventas mayoristas obtenidas", "200");
            }
            catch (Exception ex)
            {
                return Response<List<VentaMayoristaDto>>
                    .Fault($"Error: {ex.Message}", "500", new List<VentaMayoristaDto>());
            }
        }
    }
}
