using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class ElaboracionProducto
{
    public int IdElaboracion { get; set; }

    public int IdProductoFinal { get; set; }

    public DateTime? Fecha { get; set; }

    public int CantidadElaborada { get; set; }

    public virtual ICollection<ElaboracionDetalle> ElaboracionDetalles { get; set; } = new List<ElaboracionDetalle>();

    public virtual Producto IdProductoFinalNavigation { get; set; } = null!;
}
