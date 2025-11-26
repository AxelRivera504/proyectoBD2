namespace Comercializadora.WebApi.Features.Client.Dto
{
    public class ClientDto
    {
        public int IdCliente { get; set; }

        public string Nombre { get; set; } = null!;

        public string? Direccion { get; set; }

        public string? Telefono { get; set; }

        public string? Tipo { get; set; }

        public decimal? Saldo { get; set; }

        public DateTime? FechaRegistro { get; set; }
    }
}
