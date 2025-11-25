using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwSaldoProveedore
{
    public int IdProveedor { get; set; }

    public string Nombre { get; set; } = null!;

    public decimal? LimiteCredito { get; set; }

    public decimal? SaldoActual { get; set; }

    public decimal TotalFacturasPendientes { get; set; }
}
