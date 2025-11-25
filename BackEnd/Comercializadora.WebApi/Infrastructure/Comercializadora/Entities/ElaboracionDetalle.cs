using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class ElaboracionDetalle
{
    public int IdDetalleElab { get; set; }

    public int IdElaboracion { get; set; }

    public int IdProductoInsumo { get; set; }

    public int CantidadUsada { get; set; }

    public virtual ElaboracionProducto IdElaboracionNavigation { get; set; } = null!;

    public virtual Producto IdProductoInsumoNavigation { get; set; } = null!;
}
