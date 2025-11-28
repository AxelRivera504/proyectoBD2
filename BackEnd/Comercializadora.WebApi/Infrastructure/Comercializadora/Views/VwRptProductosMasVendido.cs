using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwRptProductosMasVendido
{
    public int IdProducto { get; set; }

    public string Nombre { get; set; } = null!;

    public int? CantidadVendida { get; set; }

    public decimal? MontoGenerado { get; set; }
}
