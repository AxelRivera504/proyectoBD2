using Comercializadora.WebApi.Features.PurchaseOrder.Dto;
using Comercializadora.WebApi.Features.PurchaseOrders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly IPurchaseOrderService _service;

        public PurchaseOrderController(IPurchaseOrderService service)
        {
            _service = service;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var result = _service.ObtenerOrdenesCompra();
            return Ok(result);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(PurchaseOrderPayload payload)
        {
            var result = await _service.CrearOrdenCompraAsync(payload);
            return Ok(result);
        }
    }
}
