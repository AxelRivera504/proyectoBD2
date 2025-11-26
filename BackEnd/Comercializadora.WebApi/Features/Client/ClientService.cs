using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Client.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Comercializadora.WebApi.Features.Client
{
    public class ClientService : IClientService
    {
        private readonly ProyectoBd2Context _proyectoBd2Context;
        public ClientService(ProyectoBd2Context proyectoBd2Context)
        {
            _proyectoBd2Context = proyectoBd2Context;
        }
        public async Task<Response<string>> UpdateClient(ClientPayload dto)
        {
            try
            {
                var result = await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.UpdateClient,
                    new SqlParameter("@IdCliente", dto.IdCliente),
                    new SqlParameter("@Nombre", dto.Nombre),
                    new SqlParameter("@Direccion", dto.Direccion),
                    new SqlParameter("@Telefono", dto.Telefono),
                    new SqlParameter("@Tipo", dto.Tipo)
                );

                return Response<string>.Success(
                    "Cliente actualizado exitosamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al actualizar Cliente: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE
                );
            }
        }


        public async Task<Response<string>> AddClient(ClientPayload dto)
        {
            try
            {
                var result = await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.InsertClient,
                    new SqlParameter("@Nombre", dto.Nombre),
                    new SqlParameter("@Direccion", dto.Direccion),
                    new SqlParameter("@Telefono", dto.Telefono),
                    new SqlParameter("@Tipo", dto.Tipo)
                );

                return Response<string>.Success(
                    "Cliente agregado exitosamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al insertar Cliente: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE
                );
            }
        }


        public async Task<Response<string>> DeleteClient(ClientPayload dto)
        {
            try
            {
                var result = await _proyectoBd2Context.Database.ExecuteSqlRawAsync(
                    StoredProcedures.DeleteClient,
                    new SqlParameter("@IdCliente", dto.IdCliente)
                );

                return Response<string>.Success(
                    "Cliente eliminado/desactivado exitosamente",
                    CodesHttp.SUCCESS_CODE
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(
                    $"Error al eliminar Cliente: {ex.Message}",
                    CodesHttp.SERVER_ERROR_CODE
                );
            }
        }


        public Response<List<ClientDto>> GetAll()
        {
            try
            {
                List<ClientDto> Clients = _proyectoBd2Context.Clientes
                               .FromSqlRaw(StoredProcedures.GetAllClients)
                               .AsEnumerable()
                               .Select(Clientelista => new ClientDto
                               {
                                   IdCliente = Clientelista.IdCliente,
                                   Nombre = Clientelista.Nombre,
                                   Direccion = Clientelista.Direccion,
                                   FechaRegistro = Clientelista.FechaRegistro,
                                   Telefono = Clientelista.Telefono,
                                   Saldo = Clientelista.Saldo,
                                   Tipo = Clientelista.Tipo
                               }).ToList();

                if (Clients.Count <= 0)
                    return Response<List<ClientDto>>.Fault(Messages.CLIENTES_NO_OBTENIDOS_EXITOSAMENTE, CodesHttp.SERVER_ERROR_CODE, new List<ClientDto>());

                return Response<List<ClientDto>>.Success(Clients, Messages.CLIENTES_OBTENIDOS_EXITOSAMENTE, CodesHttp.SUCCESS_CODE);
            }
            catch (Exception ex)
            {
                return Response<List<ClientDto>>.Fault(string.Format(Messages.PROCESO_ERROR, ex.Message), CodesHttp.SERVER_ERROR_CODE, new List<ClientDto>());
            }
        }
    }
}
