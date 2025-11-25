using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Views;

public partial class VwProductosExistencium
{
    public int IdProducto { get; set; }

    public string Nombre { get; set; } = null!;

    public int Existencia { get; set; }

    public int Minimo { get; set; }

    public decimal PrecioVenta { get; set; }

    public DateOnly? FechaVencimiento { get; set; }

    public string? Tipo { get; set; }
}
