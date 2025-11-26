using Comercializadora.WebApi.Features.Supplier;
using Comercializadora.WebApi.Features.Supplier.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;
        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet("GetAll")]
        public IActionResult ObtenerSupplieros()
        {
            var result = _supplierService.GetAll();
            return Ok(result);
        }

        [HttpPost("AddSupplier")]
        public async Task<IActionResult> AddSupplier(SupplierPayload SupplieroDtoPeticion)
        {
            var result = await _supplierService.AddSupplier(SupplieroDtoPeticion);
            return Ok(result);
        }

        [HttpPut("UpdateSupplier")]
        public async Task<IActionResult> UpdateSupplier(SupplierPayload SupplieroDtoPeticion)
        {
            var result = await _supplierService.UpdateSupplier(SupplieroDtoPeticion);
            return Ok(result);
        }

        [HttpPut("DeleteSupplier")]
        public async Task<IActionResult> DeleteSupplier(SupplierPayload SupplieroDtoPeticion)
        {
            var result = await _supplierService.DeleteSupplier(SupplieroDtoPeticion);
            return Ok(result);
        }
    }
}
