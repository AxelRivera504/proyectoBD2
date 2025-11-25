using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class PagoCliente
{
    public int IdPagoCliente { get; set; }

    public int IdCliente { get; set; }

    public DateTime? Fecha { get; set; }

    public decimal Monto { get; set; }

    public virtual Cliente IdClienteNavigation { get; set; } = null!;
}
