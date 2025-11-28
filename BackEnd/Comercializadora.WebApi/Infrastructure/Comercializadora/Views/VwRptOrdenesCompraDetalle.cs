using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwRptOrdenesCompraDetalle
{
    public int IdOrdenCompra { get; set; }

    public int IdProducto { get; set; }

    public string Producto { get; set; } = null!;

    public int CantidadSolicitada { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal? Subtotal { get; set; }
}
