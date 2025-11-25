using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class PagoProveedor
{
    public int IdPago { get; set; }

    public DateTime? Fecha { get; set; }

    public decimal MontoTotal { get; set; }

    public string? TipoPago { get; set; }

    public virtual ICollection<PagoProveedorDetalle> PagoProveedorDetalles { get; set; } = new List<PagoProveedorDetalle>();
}
