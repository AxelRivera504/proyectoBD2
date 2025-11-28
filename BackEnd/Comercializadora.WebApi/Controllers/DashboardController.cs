using Comercializadora.WebApi.Features.Reports;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public DashboardController(IDashboardService service)
        {
            _service = service;
        }

        [HttpGet("summary")]
        public ActionResult GetSummary()
        {
            var result = _service.GetSummary();
            return Ok(result);
        }

        [HttpGet("low-stock")]
        public ActionResult GetLowStock()
        {
            var result = _service.GetProductosBajoStock();
            return Ok(result);
        }

        [HttpGet("facturas-abiertas/{idProveedor:int}")]
        public ActionResult GetFacturasAbiertas(int idProveedor)
        {
            var result = _service.GetFacturasAbiertasPorProveedor(idProveedor);
            return Ok(result);
        }

        [HttpGet("ventas-pendientes/{idCliente:int}")]
        public ActionResult GetVentasPendientes(int idCliente)
        {
            var result = _service.GetVentasPendientesPorCliente(idCliente);
            return Ok(result);
        }

        [HttpGet("pagos-proveedor")]
        public ActionResult GetPagosProveedor([FromQuery] DateTime fechaInicio, [FromQuery] DateTime fechaFin)
        {
            var result = _service.GetPagosProveedorPorPeriodo(fechaInicio, fechaFin);
            return Ok(result);
        }

        [HttpGet("kardex/{idProducto:int}")]
        public ActionResult GetKardex(int idProducto)
        {
            var result = _service.GetKardexPorProducto(idProducto);
            return Ok(result);
        }
    }
}
