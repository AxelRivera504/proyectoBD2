using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class VentaMayoristum
{
    public int IdVenta { get; set; }

    public int IdCliente { get; set; }

    public DateTime? Fecha { get; set; }

    public decimal Total { get; set; }

    public string? Estado { get; set; }

    public virtual Cliente IdClienteNavigation { get; set; } = null!;

    public virtual ICollection<VentaMayoristaDetalle> VentaMayoristaDetalles { get; set; } = new List<VentaMayoristaDetalle>();
}
