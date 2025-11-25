using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Products.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Comercializadora.WebApi.Features.Products
{
    public class ProductService : IProductService
    {
        private readonly ProyectoBd2Context _proyectoBd2Context;
        public ProductService(ProyectoBd2Context proyectoBd2Context)
        {
            _proyectoBd2Context = proyectoBd2Context;
        }

        public async Task<Response<string>> UpdateProduct(ProductPayload dto)
        {
            try
            {
                var result = await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.UpdateProduct,
                    new SqlParameter("@IdProducto", dto.IdProducto),
                    new SqlParameter("@Nombre", dto.Nombre),
                    new SqlParameter("@Descripcion", dto.Descripcion),
                    new SqlParameter("@PrecioCosto", dto.PrecioCosto),
                    new SqlParameter("@PrecioVenta", dto.PrecioVenta),
                    new SqlParameter("@Existencia", dto.Existencia),
                    new SqlParameter("@Minimo", dto.Minimo),
                    new SqlParameter("@FechaVencimiento", dto.FechaVencimiento),
                    new SqlParameter("@Tipo", dto.Tipo)
                );

                return Response<string>.Success(
                    "Producto actualizado exitosamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al actualizar producto: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE
                );
            }
        }


        public async Task<Response<string>> AddProduct(ProductPayload dto)
        {
            try
            {
                var result = await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.InsertProduct,
                    new SqlParameter("@Nombre", dto.Nombre),
                    new SqlParameter("@Descripcion", dto.Descripcion),
                    new SqlParameter("@PrecioCosto", dto.PrecioCosto),
                    new SqlParameter("@PrecioVenta", dto.PrecioVenta),
                    new SqlParameter("@Existencia", dto.Existencia),
                    new SqlParameter("@Minimo", dto.Minimo),
                    new SqlParameter("@FechaVencimiento", dto.FechaVencimiento),
                    new SqlParameter("@Tipo", dto.Tipo)
                );

                return Response<string>.Success(
                    "Producto agregado exitosamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al insertar producto: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE
                );
            }
        }


        public async Task<Response<string>> DeleteProduct(ProductPayload dto)
        {
            try
            {
                var result = await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.Deleteroduct,
                    new SqlParameter("@IdProducto", dto.IdProducto)
                );

                return Response<string>.Success(
                    "Producto eliminado/desactivado exitosamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al eliminar producto: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE
                );
            }
        }


        public Response<List<ProductDto>> GetAll()
        {
            try
            {
                List<ProductDto> products = _proyectoBd2Context.Productos
                               .FromSqlRaw(StoredProcedures.GetAllProducts)
                               .AsEnumerable()
                               .Select(productolista => new ProductDto
                               {
                                   Existencia = productolista.Existencia,
                                   Descripcion = productolista.Descripcion,
                                   FechaVencimiento = productolista.FechaVencimiento,
                                   IdProducto = productolista.IdProducto,
                                   Minimo = productolista.Minimo,
                                   Nombre = productolista.Nombre,
                                   PrecioCosto = productolista.PrecioCosto,
                                   PrecioVenta = productolista.PrecioVenta,
                                   Tipo = productolista.Tipo
                               }).ToList();

                if (products.Count <= 0)
                    return Response<List<ProductDto>>.Fault(Messages.PRODUCTOS_NO_OBTENIDOS_EXITOSAMENTE, CodesHttp.SERVER_ERROR_CODE, new List<ProductDto>());

                return Response<List<ProductDto>>.Success(products, Messages.PRODUCTOS_OBTENIDOS_EXITOSAMENTE, CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<ProductDto>>.Fault(string.Format(Messages.PROCESO_ERROR, ex.Message), CodesHttp.SERVER_ERROR_CODE, new List<ProductDto>());
            }
        }
    }
}
