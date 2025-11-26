using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.SalesBilling.Dto;

namespace Comercializadora.WebApi.Features.SalesBilling
{
    public interface ISalesBilling
    {
        Task<Response<int>> CrearVentaContadoAsync(decimal total, List<VentaDetallePayload> detalles);

        Response<List<VentasContadoDto>> ObtenerVentasContado();

        Response<VentasContadoDto> ObtenerVentaContadoPorId(int id);
        Task<Response<string>> CrearVentaMayorista(VentaMayoristaPayload payload);
        Response<List<VentaMayoristaDto>> ObtenerVentasMayorista();
    }
}
