using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Supplier.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Comercializadora.WebApi.Features.Supplier
{
    public class SupplierService : ISupplierService
    {
        private readonly ProyectoBd2Context _proyectoBd2Context;
        public SupplierService(ProyectoBd2Context proyectoBd2Context)
        {
            _proyectoBd2Context = proyectoBd2Context;
        }
        public async Task<Response<string>> UpdateSupplier(SupplierPayload dto)
        {
            try
            {
                var result = await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.UpdateSupplier,
                    new SqlParameter("@IdProveedor", dto.IdProveedor),
                    new SqlParameter("@Nombre", dto.Nombre),
                    new SqlParameter("@Direccion", dto.Direccion),
                    new SqlParameter("@Telefono", dto.Telefono),
                    new SqlParameter("@RTN", dto.Rtn),
                    new SqlParameter("@LimiteCredito", dto.LimiteCredito)
                );

                return Response<string>.Success(
                    "Proveedor actualizado exitosamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al actualizar Proveedor: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE
                );
            }
        }


        public async Task<Response<string>> AddSupplier(SupplierPayload dto)
        {
            try
            {
                var result = await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.InsertSupplier,
                    new SqlParameter("@Nombre", dto.Nombre),
                    new SqlParameter("@Direccion", dto.Direccion),
                    new SqlParameter("@Telefono", dto.Telefono),
                    new SqlParameter("@RTN", dto.Rtn),
                    new SqlParameter("@LimiteCredito", dto.LimiteCredito)
                );

                return Response<string>.Success(
                    "Proveedor agregado exitosamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al insertar Proveedor: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE
                );
            }
        }


        public async Task<Response<string>> DeleteSupplier(SupplierPayload dto)
        {
            try
            {
                var result = await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.DeleteSupplier,
                    new SqlParameter("@IdProveedor", dto.IdProveedor)
                );

                return Response<string>.Success(
                    "Proveedor eliminado/desactivado exitosamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al eliminar Proveedor: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE
                );
            }
        }


        public Response<List<SupplierDto>> GetAll()
        {
            try
            {
                List<SupplierDto> Suppliers = _proyectoBd2Context.Proveedors
                               .FromSqlRaw(StoredProcedures.GetAllSuppliers)
                               .AsEnumerable()
                               .Select(Supplierlista => new SupplierDto
                               {
                                   IdProveedor = Supplierlista.IdProveedor,
                                   Nombre = Supplierlista.Nombre,
                                   Direccion = Supplierlista.Direccion,
                                   FechaRegistro = Supplierlista.FechaRegistro,
                                   Telefono = Supplierlista.Telefono,
                                   SaldoActual = Supplierlista.SaldoActual,
                                   LimiteCredito = Supplierlista.LimiteCredito,
                                   Rtn = Supplierlista.Rtn,
                               }).ToList();

                if (Suppliers.Count <= 0)
                    return Response<List<SupplierDto>>.Fault(Messages.PROVEEDORES_NO_OBTENIDOS_EXITOSAMENTE, CodesHttp.SERVER_ERROR_CODE, new List<SupplierDto>());

                return Response<List<SupplierDto>>.Success(Suppliers, Messages.PROVEEDORES_OBTENIDOS_EXITOSAMENTE, CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<SupplierDto>>.Fault(string.Format(Messages.PROCESO_ERROR, ex.Message), CodesHttp.SERVER_ERROR_CODE, new List<SupplierDto>());
            }
        }
    }
}
