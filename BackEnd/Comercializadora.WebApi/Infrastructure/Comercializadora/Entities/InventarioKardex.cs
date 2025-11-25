using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class InventarioKardex
{
    public int IdKardex { get; set; }

    public int IdProducto { get; set; }

    public DateTime? Fecha { get; set; }

    public string? Movimiento { get; set; }

    public int? Cantidad { get; set; }

    public int? Saldo { get; set; }

    public string? Observaciones { get; set; }

    public virtual Producto IdProductoNavigation { get; set; } = null!;
}
