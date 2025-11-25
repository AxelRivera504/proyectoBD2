using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwVentasMayoristasPendiente
{
    public int IdVenta { get; set; }

    public int IdCliente { get; set; }

    public string Cliente { get; set; } = null!;

    public DateTime? Fecha { get; set; }

    public decimal Total { get; set; }
}
