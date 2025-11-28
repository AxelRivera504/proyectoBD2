using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwRptOrdenesCompraEncabezado
{
    public int IdOrdenCompra { get; set; }

    public DateTime? Fecha { get; set; }

    public string? Estado { get; set; }

    public int IdProveedor { get; set; }

    public string Nombre { get; set; } = null!;
}
