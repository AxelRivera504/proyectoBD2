using Comercializadora.WebApi.Common;
using Comercializadora.WebApi.Features.Payments.Clients.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Comercializadora.WebApi.Features.Payments.Clients
{
    public class ClientPaymentService : IClientPaymentService
    {
        private readonly ProyectoBd2Context _context;

        public ClientPaymentService(ProyectoBd2Context context)
        {
            _context = context;
        }

        public async Task<Response<string>> PagarFacturaIndividual(PagoClienteIndividualDto dto)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_PagoCliente_FacturaEspecifica @IdCliente, @IdVenta, @MontoPagado, @TipoPago",
                    new SqlParameter("@IdCliente", dto.IdCliente),
                    new SqlParameter("@IdVenta", dto.IdVenta),
                    new SqlParameter("@MontoPagado", dto.MontoPagado),
                    new SqlParameter("@TipoPago", dto.TipoPago)
                );

                return Response<string>.Success("Pago registrado exitosamente.", "200", "");
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(ex.Message, "500", "");
            }
        }

        public async Task<Response<string>> PagarFacturasMultiples(PagoClienteMultipleDto dto)
        {
            try
            {
                decimal montoTotal = dto.Facturas.Sum(x => x.MontoPagado);

                string cadena = string.Join(";",
                    dto.Facturas.Select(x => $"{x.IdVenta}|{x.MontoPagado}")
                );

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_PagoCliente_MultiplesFacturas @IdCliente, @FacturasCadena, @TipoPago, @MontoTotal",
                    new SqlParameter("@IdCliente", dto.IdCliente),
                    new SqlParameter("@FacturasCadena", cadena),
                    new SqlParameter("@TipoPago", dto.TipoPago),
                    new SqlParameter("@MontoTotal", montoTotal)
                );

                return Response<string>.Success(
                    "Pago múltiple registrado correctamente.",
                    "200",
                    ""
                );
            }
            catch (Exception ex)
            {
                return Response<string>.Fault(ex.Message, "500", "");
            }
        }
    }
}
