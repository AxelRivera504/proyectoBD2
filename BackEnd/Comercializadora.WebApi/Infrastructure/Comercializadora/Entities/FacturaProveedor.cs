using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class FacturaProveedor
{
    public int IdFactura { get; set; }

    public int IdProveedor { get; set; }

    public DateTime? Fecha { get; set; }

    public decimal Total { get; set; }

    public decimal Saldo { get; set; }

    public string? Estado { get; set; }

    public virtual Proveedor IdProveedorNavigation { get; set; } = null!;

    public virtual ICollection<PagoProveedorDetalle> PagoProveedorDetalles { get; set; } = new List<PagoProveedorDetalle>();
}
