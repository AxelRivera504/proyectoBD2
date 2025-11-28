using Comercializadora.WebApi.Features.Payments.Suppliers.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierPaymentController : ControllerBase
    {
        private readonly IAccountsPayableService _service;

        public SupplierPaymentController(IAccountsPayableService service)
        {
            _service = service;
        }

        [HttpPost("PagarFactura")]
        public async Task<IActionResult> PagarFactura(PaymentSingleDto dto)
        {
            var result = await _service.PagarFacturaIndividual(dto);
            return Ok(result);
        }

        [HttpPost("PagarMultiples")]
        public async Task<IActionResult> PagarMultiples(PaymentMultipleDto dto)
        {
            var result = await _service.PagarFacturasMultiples(dto);
            return Ok(result);
        }

        [HttpGet("FacturasPendientes")]
        public IActionResult FacturasPendientes()
        {
            var result = _service.ListarFacturasPendientes();
            return Ok(result);
        }
    }
}
