using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwRptVentasMayoristasEncabezado
{
    public int IdVenta { get; set; }

    public DateTime? Fecha { get; set; }

    public decimal Total { get; set; }

    public decimal Saldo { get; set; }

    public string? Estado { get; set; }

    public int IdCliente { get; set; }

    public string Cliente { get; set; } = null!;
}
