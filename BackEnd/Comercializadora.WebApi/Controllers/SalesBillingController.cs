using Comercializadora.WebApi.Features.SalesBilling;
using Comercializadora.WebApi.Features.SalesBilling.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesBillingController : ControllerBase
    {
        private readonly ISalesBilling _salesBilling;

        public SalesBillingController(ISalesBilling salesBilling)
        {
            _salesBilling = salesBilling;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CrearVentaContado([FromBody] VentaContadoCreateRequest request)
        {
            var result = await _salesBilling.CrearVentaContadoAsync(request.total, request.detalles);
            return Ok(result);
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            return Ok(_salesBilling.ObtenerVentasContado());
        }

        [HttpGet("GetById/{id}")]
        public IActionResult GetById(int id)
        {
            return Ok(_salesBilling.ObtenerVentaContadoPorId(id));
        }

        [HttpGet("GetAllMayorista")]
        public IActionResult GetAllMayorista()
        {
            var result = _salesBilling.ObtenerVentasMayorista();
            return Ok(result);
        }

        [HttpPost("CreateVentaMayorista")]
        public async Task<IActionResult> CreateVentaMayorista(VentaMayoristaPayload payload)
        {
            var result = await _salesBilling.CrearVentaMayorista(payload);
            return Ok(result);
        }
    } 
}
