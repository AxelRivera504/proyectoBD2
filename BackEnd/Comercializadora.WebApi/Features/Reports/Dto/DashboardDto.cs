namespace Comercializadora.WebApi.Features.Reports.Dto
{
    public class DashboardSummaryDto
    {
        public int ProductosEnStock { get; set; }
        public decimal VentasDelMes { get; set; }
        public int OrdenesPendientes { get; set; }
        public int ProductosPorAgotarse { get; set; }
    }

    public class ProductoBajoStockDto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int Existencia { get; set; }
        public int Minimo { get; set; }
    }

    public class FacturaAbiertaProveedorDto
    {
        public int IdFactura { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
        public decimal Saldo { get; set; }
    }

    public class VentaPendienteClienteDto
    {
        public int IdVenta { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
    }

    public class PagoProveedorPeriodoDto
    {
        public int IdPago { get; set; }
        public DateTime Fecha { get; set; }
        public decimal MontoTotal { get; set; }
        public string TipoPago { get; set; } = string.Empty;
        public int? IdFactura { get; set; }
        public decimal? MontoPagado { get; set; }
    }

    public class KardexProductoDto
    {
        public int IdKardex { get; set; }
        public int IdProducto { get; set; }
        public string Movimiento { get; set; } = string.Empty;
        public decimal Cantidad { get; set; }
        public decimal Saldo { get; set; }
        public string Observaciones { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
    }
}
