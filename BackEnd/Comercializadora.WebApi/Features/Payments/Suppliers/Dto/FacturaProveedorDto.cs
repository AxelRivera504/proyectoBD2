namespace Comercializadora.WebApi.Features.Payments.Suppliers.Dto
{
    public class FacturaProveedorDto
    {
        public int IdFactura { get; set; }
        public int IdProveedor { get; set; }
        public string NombreProveedor { get; set; }  = string.Empty;
        public DateTime? Fecha {get; set;}
        public decimal Total {get; set;}
        public decimal Saldo { get; set; }
        public string Estado { get; set; } = string.Empty;
    }
}
