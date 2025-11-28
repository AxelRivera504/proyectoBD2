using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class FacturaProveedorDetalle
{
    public int IdDetalle { get; set; }

    public int IdFactura { get; set; }

    public int IdProducto { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioCompra { get; set; }
}
