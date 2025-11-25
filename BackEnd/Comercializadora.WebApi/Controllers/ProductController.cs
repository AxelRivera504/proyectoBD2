using Comercializadora.WebApi.Features.Products;
using Comercializadora.WebApi.Features.Products.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet("GetAll")]
        public IActionResult ObtenerProductos()
        {
            var result = _productService.GetAll();
            return Ok(result);
        }

        [HttpPost("AddProduct")]
        public async Task<IActionResult> AddProduct(ProductPayload productoDtoPeticion)
        {
            var result = await _productService.AddProduct(productoDtoPeticion);
            return Ok(result);
        }

        [HttpPut("UpdateProduct")]
        public async Task<IActionResult> UpdateProduct(ProductPayload productoDtoPeticion)
        {
            var result = await _productService.UpdateProduct(productoDtoPeticion);
            return Ok(result);
        }

        [HttpPut("DeleteProduct")]
        public async Task<IActionResult> DeleteProduct(ProductPayload productoDtoPeticion)
        {
            var result = await _productService.DeleteProduct(productoDtoPeticion);
            return Ok(result);
        }
    }
}
