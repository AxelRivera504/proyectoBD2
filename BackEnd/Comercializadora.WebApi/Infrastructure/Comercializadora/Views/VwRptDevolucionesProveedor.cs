using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwRptDevolucionesProveedor
{
    public int IdProveedor { get; set; }

    public string Nombre { get; set; } = null!;

    public int IdProducto { get; set; }

    public string Producto { get; set; } = null!;

    public int Cantidad { get; set; }

    public DateTime? Fecha { get; set; }

    public string? Motivo { get; set; }
}
