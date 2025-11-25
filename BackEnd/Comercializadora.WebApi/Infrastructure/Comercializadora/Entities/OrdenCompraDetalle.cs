using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class OrdenCompraDetalle
{
    public int IdDetalle { get; set; }

    public int IdOrdenCompra { get; set; }

    public int IdProducto { get; set; }

    public int CantidadSolicitada { get; set; }

    public int? CantidadRecibida { get; set; }

    public decimal PrecioUnitario { get; set; }

    public virtual OrdenCompra IdOrdenCompraNavigation { get; set; } = null!;

    public virtual Producto IdProductoNavigation { get; set; } = null!;
}
