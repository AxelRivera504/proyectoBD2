using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwKardexUltimosMovimiento
{
    public int IdKardex { get; set; }

    public int IdProducto { get; set; }

    public string Nombre { get; set; } = null!;

    public DateTime? Fecha { get; set; }

    public string? Movimiento { get; set; }

    public int? Cantidad { get; set; }

    public int? Saldo { get; set; }

    public string? Observaciones { get; set; }
}
