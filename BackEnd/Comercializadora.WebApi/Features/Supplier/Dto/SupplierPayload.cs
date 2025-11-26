namespace Comercializadora.WebApi.Features.Supplier.Dto
{
    public class SupplierPayload
    {
        public int IdProveedor { get; set; }

        public string Nombre { get; set; } = null!;

        public string? Rtn { get; set; }

        public string? Telefono { get; set; }

        public string? Direccion { get; set; }

        public decimal? LimiteCredito { get; set; }

        public decimal? SaldoActual { get; set; }

        public DateTime? FechaRegistro { get; set; }
    }
}
