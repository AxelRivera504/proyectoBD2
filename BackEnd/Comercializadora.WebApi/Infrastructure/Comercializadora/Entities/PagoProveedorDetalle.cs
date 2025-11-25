using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class PagoProveedorDetalle
{
    public int IdPagoDetalle { get; set; }

    public int IdPago { get; set; }

    public int IdFactura { get; set; }

    public decimal MontoPagado { get; set; }

    public virtual FacturaProveedor IdFacturaNavigation { get; set; } = null!;

    public virtual PagoProveedor IdPagoNavigation { get; set; } = null!;
}
