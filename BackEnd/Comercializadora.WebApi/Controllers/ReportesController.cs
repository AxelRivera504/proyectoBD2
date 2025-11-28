using Comercializadora.WebApi.Features.Reports;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportesController(IReportService service)
        {
            _service = service;
        }

        [HttpGet("ventas-contado")]
        public IActionResult VentasContado(DateTime? desde, DateTime? hasta)
            => Ok(_service.GetVentasContado(desde, hasta));

        [HttpGet("ventas-mayoristas")]
        public IActionResult VentasMayoristas(DateTime? desde, DateTime? hasta, int? idCliente)
            => Ok(_service.GetVentasMayoristas(desde, hasta, idCliente));

        [HttpGet("ordenes-compra")]
        public IActionResult OrdenesCompra(DateTime? desde, DateTime? hasta, int? idProveedor)
            => Ok(_service.GetOrdenesCompra(desde, hasta, idProveedor));

        [HttpGet("productos-mas-vendidos")]
        public IActionResult ProductosMasVendidos()
            => Ok(_service.GetProductosMasVendidos());

        [HttpGet("top-clientes")]
        public IActionResult TopClientes()
            => Ok(_service.GetTopClientes());

        [HttpGet("devoluciones")]
        public IActionResult Devoluciones(int? idProveedor, DateTime? desde, DateTime? hasta)
            => Ok(_service.GetDevoluciones(idProveedor, desde, hasta));
    }

}
