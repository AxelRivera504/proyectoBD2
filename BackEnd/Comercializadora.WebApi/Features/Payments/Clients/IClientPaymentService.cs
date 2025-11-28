using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Payments.Clients.Dto;

namespace Comercializadora.WebApi.Features.Payments.Clients
{
    public interface IClientPaymentService
    {
        Task<Response<string>> PagarFacturaIndividual(PagoClienteIndividualDto dto);
        Task<Response<string>> PagarFacturasMultiples(PagoClienteMultipleDto dto);
    }
}
