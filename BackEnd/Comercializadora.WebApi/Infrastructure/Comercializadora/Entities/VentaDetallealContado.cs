using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class VentaDetallealContado
{
    public int IdVentaDetalle { get; set; }

    public DateTime? Fecha { get; set; }

    public int IdProducto { get; set; }

    public int Cantidad { get; set; }

    public decimal Precio { get; set; }

    public int? IdVentaContado { get; set; }

    public virtual Producto IdProductoNavigation { get; set; } = null!;

    public virtual VentaContado? IdVentaContadoNavigation { get; set; }
}
