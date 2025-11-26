using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class VentaContado
{
    public int IdVentaContado { get; set; }

    public DateTime? Fecha { get; set; }

    public decimal? Total { get; set; }

    public virtual ICollection<VentaDetallealContado> VentaDetallealContados { get; set; } = new List<VentaDetallealContado>();
}
