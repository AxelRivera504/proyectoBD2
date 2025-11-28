using Comercializadora.WebApi.Features.CreationProduct;
using Comercializadora.WebApi.Features.CreationProduct.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ElaboracionController : ControllerBase
    {
        private readonly IElaboracionService _service;

        public ElaboracionController(IElaboracionService service)
        {
            _service = service;
        }

        [HttpGet("ProductosFinales")]
        public IActionResult GetProductosFinales()
            => Ok(_service.GetProductosFinales());

        [HttpGet("Insumos")]
        public IActionResult GetInsumos()
            => Ok(_service.GetInsumos());

        [HttpPost("Elaborar")]
        public async Task<IActionResult> ElaborarProducto([FromBody] ElaboracionPayload payload)
            => Ok(await _service.ElaborarProducto(payload));
    }

}
