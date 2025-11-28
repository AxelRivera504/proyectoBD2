using Comercializadora.WebApi.Features.Payments.Clients;
using Comercializadora.WebApi.Features.Payments.Clients.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientPaymentController : ControllerBase
    {
        private readonly IClientPaymentService _service;

        public ClientPaymentController(IClientPaymentService service)
        {
            _service = service;
        }

        [HttpPost("PagarFactura")]
        public async Task<IActionResult> PagarFactura([FromBody] PagoClienteIndividualDto dto)
        {
            var result = await _service.PagarFacturaIndividual(dto);
            return Ok(result);
        }

        [HttpPost("PagarMultiple")]
        public async Task<IActionResult> PagarMultiple([FromBody] PagoClienteMultipleDto dto)
        {
            var result = await _service.PagarFacturasMultiples(dto);
            return Ok(result);
        }
    }
}
