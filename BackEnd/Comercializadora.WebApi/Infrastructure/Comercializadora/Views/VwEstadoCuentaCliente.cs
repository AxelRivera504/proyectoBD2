using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwEstadoCuentaCliente
{
    public int IdFactura { get; set; }

    public int IdCliente { get; set; }

    public string Cliente { get; set; } = null!;

    public DateTime? Fecha { get; set; }

    public decimal Total { get; set; }

    public decimal TotalPagado { get; set; }

    public decimal? SaldoFactura { get; set; }

    public string Estado { get; set; } = null!;
}
