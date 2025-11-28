using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Payments.Suppliers.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Comercializadora.WebApi.Features.Payments.Suppliers
{
    public class AccountsPayableService : IAccountsPayableService
    {
        private readonly ProyectoBd2Context _context;

        public AccountsPayableService(ProyectoBd2Context context)
        {
            _context = context;
        }

        public async Task<Response<string>> PagarFacturaIndividual(PaymentSingleDto dto)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_PagoProveedor_FacturaEspecifica_Transaccional @IdFactura, @MontoPagado, @TipoPago",
                    new SqlParameter("@IdFactura", dto.IdFactura),
                    new SqlParameter("@MontoPagado", dto.MontoPagado),
                    new SqlParameter("@TipoPago", dto.TipoPago)
                );

                return Response<string>.Success("Factura pagada con éxito", "200", "");
            }
            catch (Exception ex)
            {
                return Response<string>.Fault($"Error: {ex.Message}", "500", "");
            }
        }

        public async Task<Response<string>> PagarFacturasMultiples(PaymentMultipleDto dto)
        {
            try
            {
                // Convertir lista → cadena '20310|5000;20311|3300'
                string cadena = string.Join(";", dto.Facturas.Select(f => $"{f.IdFactura}|{f.Monto}"));

                decimal total = dto.Facturas.Sum(f => f.Monto);

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_PagoProveedor_MultiplesFacturas_Split_Transaccional @IdProveedor, @FacturasCadena, @TipoPago, @MontoTotal",
                    new SqlParameter("@IdProveedor", dto.IdProveedor),
                    new SqlParameter("@FacturasCadena", cadena),
                    new SqlParameter("@TipoPago", dto.TipoPago),
                    new SqlParameter("@MontoTotal", total)
                );

                return Response<string>.Success("Pago múltiple registrado", "200", "");
            }
            catch (Exception ex)
            {
                return Response<string>.Fault($"Error: {ex.Message}", "500", "");
            }
        }

        public Response<List<FacturaProveedorDto>> ListarFacturasPendientes()
        {
            try
            {
                var data = _context.FacturaProveedors
                    .Where(f => f.Estado != "Pagada")
                    .Select(f => new FacturaProveedorDto
                    {
                        IdFactura = f.IdFactura,
                        IdProveedor = f.IdProveedor,
                        NombreProveedor = f.IdProveedorNavigation.Nombre,
                        Fecha = f.Fecha,
                        Total = f.Total,
                        Saldo = f.Saldo,
                        Estado = f.Estado
                    })
                    .ToList();

                return Response<List<FacturaProveedorDto>>.Success(data, "Facturas cargadas", "200");
            }
            catch (Exception ex)
            {
                return Response<List<FacturaProveedorDto>>.Fault("Error: " + ex.Message, "500", new List<FacturaProveedorDto>());
            }
        }
    }
}
