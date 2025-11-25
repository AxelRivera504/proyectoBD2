using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class Producto
{
    public int IdProducto { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal PrecioCosto { get; set; }

    public decimal PrecioVenta { get; set; }

    public int Existencia { get; set; }

    public int Minimo { get; set; }

    public DateOnly? FechaVencimiento { get; set; }

    public string? Tipo { get; set; }

    public virtual ICollection<DevolucionProveedor> DevolucionProveedors { get; set; } = new List<DevolucionProveedor>();

    public virtual ICollection<ElaboracionDetalle> ElaboracionDetalles { get; set; } = new List<ElaboracionDetalle>();

    public virtual ICollection<ElaboracionProducto> ElaboracionProductos { get; set; } = new List<ElaboracionProducto>();

    public virtual ICollection<InventarioKardex> InventarioKardices { get; set; } = new List<InventarioKardex>();

    public virtual ICollection<OrdenCompraDetalle> OrdenCompraDetalles { get; set; } = new List<OrdenCompraDetalle>();

    public virtual ICollection<VentaDetallealContado> VentaDetallealContados { get; set; } = new List<VentaDetallealContado>();

    public virtual ICollection<VentaMayoristaDetalle> VentaMayoristaDetalles { get; set; } = new List<VentaMayoristaDetalle>();
}
