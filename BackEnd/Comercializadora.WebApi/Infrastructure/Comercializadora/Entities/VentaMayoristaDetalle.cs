using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class VentaMayoristaDetalle
{
    public int IdDetalleVm { get; set; }

    public int IdVenta { get; set; }

    public int IdProducto { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public virtual Producto IdProductoNavigation { get; set; } = null!;

    public virtual VentaMayoristum IdVentaNavigation { get; set; } = null!;
}
