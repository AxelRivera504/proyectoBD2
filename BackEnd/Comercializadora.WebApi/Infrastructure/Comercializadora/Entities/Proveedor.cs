using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class Proveedor
{
    public int IdProveedor { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Rtn { get; set; }

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public decimal? LimiteCredito { get; set; }

    public decimal? SaldoActual { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public virtual ICollection<DevolucionProveedor> DevolucionProveedors { get; set; } = new List<DevolucionProveedor>();

    public virtual ICollection<FacturaProveedor> FacturaProveedors { get; set; } = new List<FacturaProveedor>();

    public virtual ICollection<OrdenCompra> OrdenCompras { get; set; } = new List<OrdenCompra>();
}
