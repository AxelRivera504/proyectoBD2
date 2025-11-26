using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Client.Dto;
namespace Comercializadora.WebApi.Features.Client
{
    public interface IClientService
    {
        Response<List<ClientDto>> GetAll();
        Task<Response<string>> AddClient(ClientPayload clientDtoPeticion);
        Task<Response<string>> UpdateClient(ClientPayload clientDtoPeticion);
        Task<Response<string>> DeleteClient(ClientPayload clientDtoPeticion);
    }
}
