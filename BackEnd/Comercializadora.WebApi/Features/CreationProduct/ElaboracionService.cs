using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.CreationProduct.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Comercializadora.WebApi.Features.CreationProduct
{
    public class ElaboracionService : IElaboracionService
    {
        private readonly ProyectoBd2Context _context;

        public ElaboracionService(ProyectoBd2Context context)
        {
            _context = context;
        }


        public Response<List<ProductoFinalDto>> GetProductosFinales()
        {
            try
            {
                var productos = _context.ProductosFinalesDto   // DbSet con HasNoKey()
                    .FromSqlRaw("EXEC sp_ProductosFinales_Listar")
                    .ToList();

                if (!productos.Any())
                    return Response<List<ProductoFinalDto>>.Fault(
                        "No hay productos finales registrados",
                        CodesHttp.SERVER_ERROR_CODE,
                        new List<ProductoFinalDto>()
                    );

                return Response<List<ProductoFinalDto>>.Success(
                    productos,
                    "Productos obtenidos correctamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<List<ProductoFinalDto>>.Fault(
                    $"Error: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE,
                    new List<ProductoFinalDto>()
                );
            }
        }

        public Response<List<InsumoDto>> GetInsumos()
        {
            try
            {
                var insumos = _context.InsumosDto   // DbSet con HasNoKey()
                    .FromSqlRaw("EXEC sp_Insumos_Listar")
                    .ToList();

                return Response<List<InsumoDto>>.Success(
                    insumos,
                    "Insumos obtenidos correctamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<List<InsumoDto>>.Fault(
                    $"Error: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE,
                    new List<InsumoDto>()
                );
            }
        }

        public async Task<Response<string>> ElaborarProducto(ElaboracionPayload payload)
        {
            try
            {
                // Armar cadena: "5|3;7|1;8|2"
                string cadena = string.Join(";", payload.Insumos
                        .Select(i => $"{i.IdProductoInsumo}|{i.CantidadUsada}"));

                var parameters = new[]
                {
                    new SqlParameter("@IdProductoFinal", payload.IdProductoFinal),
                    new SqlParameter("@CantidadElaborada", payload.CantidadElaborada),
                    new SqlParameter("@InsumosCadena", cadena)
                };

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_ElaborarProducto_Transaccional @IdProductoFinal, @CantidadElaborada, @InsumosCadena",
                    parameters
                );

                return Response<string>.Success(
                    "Elaboración registrada exitosamente",
                    CodesHttp.SUCCESS_CODE,
                    ""
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE,
                    ""
                );
            }
        }
    }

}
