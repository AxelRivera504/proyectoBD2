using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;

public partial class Deposito
{
    public int IdDeposito { get; set; }

    public DateTime? Fecha { get; set; }

    public decimal TotalDepositado { get; set; }
}
