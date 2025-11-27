using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.PurchaseOrder.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Comercializadora.WebApi.Features.PurchaseOrders
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly ProyectoBd2Context _context;

        public PurchaseOrderService(ProyectoBd2Context context)
        {
            _context = context;
        }

        public async Task<Response<string>> CrearOrdenCompraAsync(PurchaseOrderPayload payload)
        {
            try
            {
                int idOrdenCompra = 0;

                var paramId = new SqlParameter("@IdOrdenCompra", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC dbo.sp_OrdenCompra_Insert @IdProveedor, @IdOrdenCompra OUTPUT",
                    new SqlParameter("@IdProveedor", payload.IdProveedor),
                    paramId
                );

                idOrdenCompra = (int)paramId.Value;

                foreach (var det in payload.Detalles)
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "EXEC dbo.sp_OrdenCompraDetalle_Insert @IdOrdenCompra, @IdProducto, @CantidadSolicitada, @PrecioUnitario",
                        new SqlParameter("@IdOrdenCompra", idOrdenCompra),
                        new SqlParameter("@IdProducto", det.IdProducto),
                        new SqlParameter("@CantidadSolicitada", det.CantidadSolicitada),
                        new SqlParameter("@PrecioUnitario", det.PrecioUnitario)
                    );
                }

                return Response<string>.Success(
                    "Orden de compra registrada exitosamente",
                    "200",
                    ""
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al registrar la orden de compra: {ex.Message}",
                    "500",
                    ""
                );
            }
        }

        public Response<List<PurchaseOrderDto>> ObtenerOrdenesCompra()
        {
            try
            {
                var ordenes = _context.OrdenCompras
                    .Include(o => o.IdProveedorNavigation)
                    .Include(o => o.OrdenCompraDetalles)
                        .ThenInclude(d => d.IdProductoNavigation)
                    .Select(o => new PurchaseOrderDto
                    {
                        IdOrdenCompra = o.IdOrdenCompra,
                        IdProveedor = o.IdProveedor,
                        NombreProveedor = o.IdProveedorNavigation.Nombre,
                        Fecha = o.Fecha,
                        Estado = o.Estado,
                        Total = o.OrdenCompraDetalles.Sum(d => d.CantidadSolicitada * d.PrecioUnitario),

                        Detalles = o.OrdenCompraDetalles.Select(d => new PurchaseOrderDetailDto
                        {
                            IdProducto = d.IdProducto,
                            NombreProducto = d.IdProductoNavigation.Nombre,
                            CantidadSolicitada = d.CantidadSolicitada,
                            PrecioUnitario = d.PrecioUnitario
                        }).ToList()
                    })
                    .ToList();

                return Response<List<PurchaseOrderDto>>
                    .Success(ordenes, "Ordenes de compra obtenidas", "200");
            }
            catch (Exception ex)
            {
                return Response<List<PurchaseOrderDto>>
                    .Fault($"Error: {ex.Message}", "500", new List<PurchaseOrderDto>());
            }
        }
    }
}
