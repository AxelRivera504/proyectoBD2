using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwRptVentasMayoristasDetalle
{
    public int IdVenta { get; set; }

    public int IdProducto { get; set; }

    public string Producto { get; set; } = null!;

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal? Subtotal { get; set; }
}
