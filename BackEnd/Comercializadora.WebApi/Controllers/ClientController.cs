using Comercializadora.WebApi.Features.Client;
using Comercializadora.WebApi.Features.Client.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Comercializadora.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _ClientService;
        public ClientController(IClientService ClientService)
        {
            _ClientService = ClientService;
        }

        [HttpGet("GetAll")]
        public IActionResult ObtenerClientos()
        {
            var result = _ClientService.GetAll();
            return Ok(result);
        }

        [HttpPost("AddClient")]
        public async Task<IActionResult> AddClient(ClientPayload ClientoDtoPeticion)
        {
            var result = await _ClientService.AddClient(ClientoDtoPeticion);
            return Ok(result);
        }

        [HttpPut("UpdateClient")]
        public async Task<IActionResult> UpdateClient(ClientPayload ClientoDtoPeticion)
        {
            var result = await _ClientService.UpdateClient(ClientoDtoPeticion);
            return Ok(result);
        }

        [HttpPut("DeleteClient")]
        public async Task<IActionResult> DeleteClient(ClientPayload ClientoDtoPeticion)
        {
            var result = await _ClientService.DeleteClient(ClientoDtoPeticion);
            return Ok(result);
        }
    }
}
