using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Payments.Suppliers.Dto;

public interface IAccountsPayableService
{
    Task<Response<string>> PagarFacturaIndividual(PaymentSingleDto dto);
    Task<Response<string>> PagarFacturasMultiples(PaymentMultipleDto dto);
    Response<List<FacturaProveedorDto>> ListarFacturasPendientes();
}