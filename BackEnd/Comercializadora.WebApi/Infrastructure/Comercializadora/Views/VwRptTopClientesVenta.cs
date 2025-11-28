using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwRptTopClientesVenta
{
    public int IdCliente { get; set; }

    public string Cliente { get; set; } = null!;

    public int? CantidadVentas { get; set; }

    public decimal? TotalVendido { get; set; }
}
