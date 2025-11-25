using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class DevolucionProveedor
{
    public int IdDevolucion { get; set; }

    public int IdProveedor { get; set; }

    public int IdProducto { get; set; }

    public DateTime? Fecha { get; set; }

    public int Cantidad { get; set; }

    public string? Motivo { get; set; }

    public virtual Producto IdProductoNavigation { get; set; } = null!;

    public virtual Proveedor IdProveedorNavigation { get; set; } = null!;
}
