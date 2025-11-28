using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwRptVentasContado
{
    public int IdVentaContado { get; set; }

    public DateTime? Fecha { get; set; }

    public decimal? Total { get; set; }

    public int IdProducto { get; set; }

    public string Producto { get; set; } = null!;

    public int Cantidad { get; set; }

    public decimal PrecioVenta { get; set; }

    public decimal? Subtotal { get; set; }
}
