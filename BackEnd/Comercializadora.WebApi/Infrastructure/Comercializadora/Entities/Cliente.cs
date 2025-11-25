using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class Cliente
{
    public int IdCliente { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Direccion { get; set; }

    public string? Telefono { get; set; }

    public string? Tipo { get; set; }

    public decimal? Saldo { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public virtual ICollection<PagoCliente> PagoClientes { get; set; } = new List<PagoCliente>();

    public virtual ICollection<VentaMayoristum> VentaMayorista { get; set; } = new List<VentaMayoristum>();
}
