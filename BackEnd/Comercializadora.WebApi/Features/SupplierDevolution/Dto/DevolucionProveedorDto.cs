namespace Comercializadora.WebApi.Features.SupplierDevolution.Dto
{
    public class DevolucionProveedorDto
    {
        public int IdFacturaProveedor { get; set; }
        public int IdProducto { get; set; }
        public int Cantidad { get; set; }
        public string Motivo { get; set; } = string.Empty;
    }

}
