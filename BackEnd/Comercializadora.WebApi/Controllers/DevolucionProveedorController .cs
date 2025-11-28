using Comercializadora.WebApi.Features.SupplierDevolution;
using Comercializadora.WebApi.Features.SupplierDevolution.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevolucionProveedorController : ControllerBase
    {
        private readonly IDevolucionProveedorService _service;

        public DevolucionProveedorController(IDevolucionProveedorService service)
        {
            _service = service;
        }

        [HttpGet("proveedores")]
        public async Task<IActionResult> GetProveedores() =>
            Ok(await _service.GetProveedoresConPendientes());

        [HttpGet("facturas/{idProveedor}")]
        public async Task<IActionResult> GetFacturas(int idProveedor) =>
            Ok(await _service.GetFacturasPendientesPorProveedor(idProveedor));

        [HttpGet("productos/{idFactura}")]
        public async Task<IActionResult> GetProductos(int idFactura) =>
            Ok(await _service.GetProductosPorFactura(idFactura));

        [HttpPost("devolver")]
        public async Task<IActionResult> Devolver([FromBody] DevolucionProveedorDto dto) =>
            Ok(await _service.DevolverProductoAsync(dto));
    }

}
