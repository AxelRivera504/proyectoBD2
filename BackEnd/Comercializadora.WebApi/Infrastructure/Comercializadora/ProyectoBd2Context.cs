using Comercializadora.WebApi.Features.CreationProduct.Dto;
using Comercializadora.WebApi.Features.SupplierDevolution.Dto;
using Comercializadora.WebApi.Infrastructure.Comercializadora.Entities;
using Comercializadora.WebApi.Infrastructure.Comercializadora.Functions;
using Comercializadora.WebApi.Infrastructure.Comercializadora.Views;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Comercializadora.WebApi.Infrastructure.Comercializadora;

public partial class ProyectoBd2Context : DbContext
{
    public ProyectoBd2Context()
    {
    }

    public ProyectoBd2Context(DbContextOptions<ProyectoBd2Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Deposito> Depositos { get; set; }

    public virtual DbSet<DevolucionProveedor> DevolucionProveedors { get; set; }

    public virtual DbSet<ElaboracionDetalle> ElaboracionDetalles { get; set; }

    public virtual DbSet<ElaboracionProducto> ElaboracionProductos { get; set; }

    public virtual DbSet<FacturaProveedor> FacturaProveedors { get; set; }

    public virtual DbSet<FacturaProveedorDetalle> FacturaProveedorDetalles { get; set; }

    public virtual DbSet<ProductoFacturaProveedorSpDto> ProductosFacturaProveedor { get; set; }

    public virtual DbSet<ProveedorConFacturaPendienteDto> ProveedorConFacturaPendientes { get; set; }

    public virtual DbSet<FacturaPendienteDto> FacturaPendientes { get; set; }

    public virtual DbSet<InventarioKardex> InventarioKardices { get; set; }

    public virtual DbSet<InsumoDto> InsumosDto { get; set; }

    public virtual DbSet<ProductoFinalDto> ProductosFinalesDto { get; set; }

    public virtual DbSet<OrdenCompra> OrdenCompras { get; set; }

    public virtual DbSet<OrdenCompraDetalle> OrdenCompraDetalles { get; set; }

    public virtual DbSet<PagoCliente> PagoClientes { get; set; }

    public virtual DbSet<PagoProveedor> PagoProveedors { get; set; }

    public virtual DbSet<PagoProveedorDetalle> PagoProveedorDetalles { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<Proveedor> Proveedors { get; set; }

    public virtual DbSet<VentaContado> VentaContados { get; set; }

    public virtual DbSet<VentaDetallealContado> VentaDetallealContados { get; set; }

    public virtual DbSet<VentaMayoristaDetalle> VentaMayoristaDetalles { get; set; }

    public virtual DbSet<VentaMayoristum> VentaMayorista { get; set; }

    #region Functions
    public virtual DbSet<TvfProductosBajoStock> TvfProductosBajoStocks { get; set; }
    public virtual DbSet<TvfFacturasAbiertasPorProveedor> TvfFacturasAbiertasPorProveedors { get; set; }
    public virtual DbSet<TvfVentasPendientesPorCliente> TvfVentasPendientesPorClientes { get; set; }
    public virtual DbSet<TvfPagosProveedorPorPeriodo> TvfPagosProveedorPorPeriodos { get; set; }
    public virtual DbSet<TvfKardexPorProducto> TvfKardexPorProductos { get; set; }
    #endregion

    #region Views
    public virtual DbSet<VwRptDevolucionesProveedor> VwRptDevolucionesProveedors { get; set; }

    public virtual DbSet<VwRptOrdenesCompraDetalle> VwRptOrdenesCompraDetalles { get; set; }

    public virtual DbSet<VwRptOrdenesCompraEncabezado> VwRptOrdenesCompraEncabezados { get; set; }

    public virtual DbSet<VwRptProductosMasVendido> VwRptProductosMasVendidos { get; set; }

    public virtual DbSet<VwRptTopClientesVenta> VwRptTopClientesVentas { get; set; }

    public virtual DbSet<VwRptVentasContado> VwRptVentasContados { get; set; }

    public virtual DbSet<VwRptVentasMayoristasDetalle> VwRptVentasMayoristasDetalles { get; set; }

    public virtual DbSet<VwRptVentasMayoristasEncabezado> VwRptVentasMayoristasEncabezados { get; set; }
    #endregion
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VwRptDevolucionesProveedor>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RPT_DevolucionesProveedor");

            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Motivo).HasMaxLength(300);
            entity.Property(e => e.Nombre).HasMaxLength(150);
            entity.Property(e => e.Producto).HasMaxLength(150);
        });

        modelBuilder.Entity<VwRptOrdenesCompraDetalle>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RPT_OrdenesCompra_Detalle");

            entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Producto).HasMaxLength(150);
            entity.Property(e => e.Subtotal).HasColumnType("decimal(29, 2)");
        });

        modelBuilder.Entity<VwRptOrdenesCompraEncabezado>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RPT_OrdenesCompra_Encabezado");

            entity.Property(e => e.Estado).HasMaxLength(20);
            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Nombre).HasMaxLength(150);
        });

        modelBuilder.Entity<VwRptProductosMasVendido>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RPT_ProductosMasVendidos");

            entity.Property(e => e.MontoGenerado).HasColumnType("decimal(38, 2)");
            entity.Property(e => e.Nombre).HasMaxLength(150);
        });

        modelBuilder.Entity<VwRptTopClientesVenta>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RPT_TopClientesVentas");

            entity.Property(e => e.Cliente).HasMaxLength(150);
            entity.Property(e => e.TotalVendido).HasColumnType("decimal(38, 2)");
        });

        modelBuilder.Entity<VwRptVentasContado>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RPT_VentasContado");

            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.PrecioVenta).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Producto).HasMaxLength(150);
            entity.Property(e => e.Subtotal).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Total).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<VwRptVentasMayoristasDetalle>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RPT_VentasMayoristas_Detalle");

            entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Producto).HasMaxLength(150);
            entity.Property(e => e.Subtotal).HasColumnType("decimal(29, 2)");
        });

        modelBuilder.Entity<VwRptVentasMayoristasEncabezado>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RPT_VentasMayoristas_Encabezado");

            entity.Property(e => e.Cliente).HasMaxLength(150);
            entity.Property(e => e.Estado).HasMaxLength(20);
            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Saldo).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Total).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<ProductoFacturaProveedorSpDto>().HasNoKey();
        modelBuilder.Entity<ProveedorConFacturaPendienteDto>().HasNoKey();
        modelBuilder.Entity<FacturaPendienteDto>().HasNoKey();
        modelBuilder.Entity<InsumoDto>().HasNoKey();
        modelBuilder.Entity<ProductoFinalDto>().HasNoKey();
        modelBuilder.Entity<TvfProductosBajoStock>(entity =>
        {
            entity.HasNoKey();
            entity.ToView(null); // TVF, no tabla
            entity.Property(e => e.IdProducto).HasColumnName("IdProducto");
            entity.Property(e => e.Nombre).HasColumnName("Nombre").HasMaxLength(150);
            entity.Property(e => e.Existencia).HasColumnName("Existencia");
            entity.Property(e => e.Minimo).HasColumnName("Minimo");
        });

        modelBuilder.Entity<TvfFacturasAbiertasPorProveedor>(entity =>
        {
            entity.HasNoKey();
            entity.ToView(null);
            entity.Property(e => e.IdFactura).HasColumnName("IdFactura");
            entity.Property(e => e.Fecha).HasColumnName("Fecha");
            entity.Property(e => e.Total).HasColumnName("Total");
            entity.Property(e => e.Saldo).HasColumnName("Saldo");
        });

        modelBuilder.Entity<TvfVentasPendientesPorCliente>(entity =>
        {
            entity.HasNoKey();
            entity.ToView(null);
            entity.Property(e => e.IdVenta).HasColumnName("IdVenta");
            entity.Property(e => e.Fecha).HasColumnName("Fecha");
            entity.Property(e => e.Total).HasColumnName("Total");
        });

        modelBuilder.Entity<TvfPagosProveedorPorPeriodo>(entity =>
        {
            entity.HasNoKey();
            entity.ToView(null);
            entity.Property(e => e.IdPago).HasColumnName("IdPago");
            entity.Property(e => e.Fecha).HasColumnName("Fecha");
            entity.Property(e => e.MontoTotal).HasColumnName("MontoTotal");
            entity.Property(e => e.TipoPago).HasColumnName("TipoPago").HasMaxLength(20);
            entity.Property(e => e.IdFactura).HasColumnName("IdFactura");
            entity.Property(e => e.MontoPagado).HasColumnName("MontoPagado");
        });

        modelBuilder.Entity<TvfKardexPorProducto>(entity =>
        {
            entity.HasNoKey();
            entity.ToView(null);
            entity.Property(e => e.IdKardex).HasColumnName("IdKardex");
            entity.Property(e => e.IdProducto).HasColumnName("IdProducto");
            entity.Property(e => e.Movimiento).HasColumnName("Movimiento").HasMaxLength(100);
            entity.Property(e => e.Cantidad).HasColumnName("Cantidad");
            entity.Property(e => e.Saldo).HasColumnName("Saldo");
            entity.Property(e => e.Observaciones).HasColumnName("Observaciones").HasMaxLength(300);
            entity.Property(e => e.Fecha).HasColumnName("Fecha");
        });

        modelBuilder.Entity<FacturaProveedorDetalle>(entity =>
        {
            entity.HasKey(e => e.IdDetalle).HasName("PK__FacturaP__E43646A54A154A5A");

            entity.ToTable("FacturaProveedorDetalle");

            entity.Property(e => e.PrecioCompra).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.IdCliente).HasName("PK__Cliente__D59466427AF3C74B");

            entity.ToTable("Cliente");

            entity.Property(e => e.Direccion).HasMaxLength(300);
            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Nombre).HasMaxLength(150);
            entity.Property(e => e.Saldo)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Telefono).HasMaxLength(20);
            entity.Property(e => e.Tipo)
                .HasMaxLength(20)
                .HasDefaultValue("Detalle");
        });

        modelBuilder.Entity<Deposito>(entity =>
        {
            entity.HasKey(e => e.IdDeposito).HasName("PK__Deposito__011A5BF2665A242E");

            entity.ToTable("Deposito");

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TotalDepositado).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<DevolucionProveedor>(entity =>
        {
            entity.HasKey(e => e.IdDevolucion).HasName("PK__Devoluci__7B3585A299BAA183");

            entity.ToTable("DevolucionProveedor", tb => tb.HasTrigger("trg_DevolucionProveedor_AjustaInventario"));

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Motivo).HasMaxLength(300);

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DevolucionProveedors)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Devolucio__IdPro__6FE99F9F");

            entity.HasOne(d => d.IdProveedorNavigation).WithMany(p => p.DevolucionProveedors)
                .HasForeignKey(d => d.IdProveedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Devolucio__IdPro__6EF57B66");
        });

        modelBuilder.Entity<ElaboracionDetalle>(entity =>
        {
            entity.HasKey(e => e.IdDetalleElab).HasName("PK__Elaborac__A2065A9DF5D50B7D");

            entity.ToTable("ElaboracionDetalle", tb => tb.HasTrigger("trg_ElaboracionDetalle_RestaInsumos"));

            entity.HasOne(d => d.IdElaboracionNavigation).WithMany(p => p.ElaboracionDetalles)
                .HasForeignKey(d => d.IdElaboracion)
                .HasConstraintName("FK__Elaboraci__IdEla__778AC167");

            entity.HasOne(d => d.IdProductoInsumoNavigation).WithMany(p => p.ElaboracionDetalles)
                .HasForeignKey(d => d.IdProductoInsumo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Elaboraci__IdPro__787EE5A0");
        });

        modelBuilder.Entity<ElaboracionProducto>(entity =>
        {
            entity.HasKey(e => e.IdElaboracion).HasName("PK__Elaborac__1AB760800CAD7B59");

            entity.ToTable("ElaboracionProducto", tb => tb.HasTrigger("trg_ElaboracionProducto_AumentaFinal"));

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdProductoFinalNavigation).WithMany(p => p.ElaboracionProductos)
                .HasForeignKey(d => d.IdProductoFinal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Elaboraci__IdPro__73BA3083");
        });

        modelBuilder.Entity<FacturaProveedor>(entity =>
        {
            entity.HasKey(e => e.IdFactura).HasName("PK__FacturaP__50E7BAF1C9EE5C95");

            entity.ToTable("FacturaProveedor", tb => tb.HasTrigger("trg_FacturaProveedor_Insert_UpdateProveedorSaldo"));

            entity.HasIndex(e => e.IdProveedor, "IX_FacturaProveedor_Proveedor");

            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .HasDefaultValue("Abierta");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Saldo).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Total).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.IdProveedorNavigation).WithMany(p => p.FacturaProveedors)
                .HasForeignKey(d => d.IdProveedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__FacturaPr__IdPro__5070F446");
        });

        modelBuilder.Entity<InventarioKardex>(entity =>
        {
            entity.HasKey(e => e.IdKardex).HasName("PK__Inventar__BC1BA400C8E517B6");

            entity.ToTable("InventarioKardex");

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Movimiento).HasMaxLength(50);
            entity.Property(e => e.Observaciones).HasMaxLength(300);

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.InventarioKardices)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Inventari__IdPro__7B5B524B");
        });

        modelBuilder.Entity<OrdenCompra>(entity =>
        {
            entity.HasKey(e => e.IdOrdenCompra).HasName("PK__OrdenCom__685E464B8AC57218");

            entity.ToTable("OrdenCompra");

            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .HasDefaultValue("Pendiente");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdProveedorNavigation).WithMany(p => p.OrdenCompras)
                .HasForeignKey(d => d.IdProveedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrdenComp__IdPro__47DBAE45");
        });

        modelBuilder.Entity<OrdenCompraDetalle>(entity =>
        {
            entity.HasKey(e => e.IdDetalle).HasName("PK__OrdenCom__E43646A50F4C3277");

            entity.ToTable("OrdenCompraDetalle", tb => tb.HasTrigger("trg_OrdenCompraDetalle_Recepcion"));

            entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.IdOrdenCompraNavigation).WithMany(p => p.OrdenCompraDetalles)
                .HasForeignKey(d => d.IdOrdenCompra)
                .HasConstraintName("FK__OrdenComp__IdOrd__4CA06362");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.OrdenCompraDetalles)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrdenComp__IdPro__4D94879B");
        });

        modelBuilder.Entity<PagoCliente>(entity =>
        {
            entity.HasKey(e => e.IdPagoCliente).HasName("PK__PagoClie__FBCBB2D0C09EC969");

            entity.ToTable("PagoCliente", tb => tb.HasTrigger("trg_PagoCliente_AplicaPago"));

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Monto).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.PagoClientes)
                .HasForeignKey(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PagoClien__IdCli__68487DD7");
        });

        modelBuilder.Entity<PagoProveedor>(entity =>
        {
            entity.HasKey(e => e.IdPago).HasName("PK__PagoProv__FC851A3A3BECE384");

            entity.ToTable("PagoProveedor");

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.MontoTotal).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TipoPago).HasMaxLength(20);
        });

        modelBuilder.Entity<PagoProveedorDetalle>(entity =>
        {
            entity.HasKey(e => e.IdPagoDetalle).HasName("PK__PagoProv__08F2D0D7DB5F5EE7");

            entity.ToTable("PagoProveedorDetalle", tb => tb.HasTrigger("trg_PagoProveedorDetalle_AplicaPago"));

            entity.Property(e => e.MontoPagado).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.IdFacturaNavigation).WithMany(p => p.PagoProveedorDetalles)
                .HasForeignKey(d => d.IdFactura)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PagoProve__IdFac__59063A47");

            entity.HasOne(d => d.IdPagoNavigation).WithMany(p => p.PagoProveedorDetalles)
                .HasForeignKey(d => d.IdPago)
                .HasConstraintName("FK__PagoProve__IdPag__5812160E");
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.IdProducto).HasName("PK__Producto__0988921014A6DF6A");

            entity.ToTable("Producto", tb => tb.HasTrigger("trg_Producto_CheckExistenciaNonNegative"));

            entity.HasIndex(e => e.Nombre, "IX_Producto_Nombre");

            entity.Property(e => e.Descripcion).HasMaxLength(300);
            entity.Property(e => e.Nombre).HasMaxLength(150);
            entity.Property(e => e.PrecioCosto).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PrecioVenta).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Tipo)
                .HasMaxLength(50)
                .HasDefaultValue("Producto");
        });

        modelBuilder.Entity<Proveedor>(entity =>
        {
            entity.HasKey(e => e.IdProveedor).HasName("PK__Proveedo__E8B631AF98885BAC");

            entity.ToTable("Proveedor");

            entity.Property(e => e.Direccion).HasMaxLength(300);
            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.LimiteCredito)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Nombre).HasMaxLength(150);
            entity.Property(e => e.Rtn)
                .HasMaxLength(20)
                .HasColumnName("RTN");
            entity.Property(e => e.SaldoActual)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Telefono).HasMaxLength(20);
        });

        //modelBuilder.Entity<VentaDetallealContado>(entity =>
        //{
        //    entity.HasKey(e => e.IdVentaDetalle).HasName("PK__VentaDet__2787211DF6CF02D6");

        //    entity.ToTable("VentaDetallealContado", tb => tb.HasTrigger("trg_VentaDetalleAlContado_AjustaInventario"));

        //    entity.Property(e => e.Fecha)
        //        .HasDefaultValueSql("(getdate())")
        //        .HasColumnType("datetime");
        //    entity.Property(e => e.Precio).HasColumnType("decimal(18, 2)");

        //    entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.VentaDetallealContados)
        //        .HasForeignKey(d => d.IdProducto)
        //        .OnDelete(DeleteBehavior.ClientSetNull)
        //        .HasConstraintName("FK__VentaDeta__IdPro__656C112C");
        //});
        modelBuilder.Entity<VentaContado>(entity =>
        {
            entity.HasKey(e => e.IdVentaContado).HasName("PK__VentaCon__FF667E6AFC5E5126");

            entity.ToTable("VentaContado");

            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Total).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<VentaDetallealContado>(entity =>
        {
            entity.HasKey(e => e.IdVentaDetalle).HasName("PK__VentaDet__2787211DF6CF02D6");

            entity.ToTable("VentaDetallealContado", tb => tb.HasTrigger("trg_VentaDetalleAlContado_AjustaInventario"));

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Precio).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.VentaDetallealContados)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VentaDeta__IdPro__656C112C");

            entity.HasOne(d => d.IdVentaContadoNavigation).WithMany(p => p.VentaDetallealContados)
                .HasForeignKey(d => d.IdVentaContado)
                .HasConstraintName("FK_VentaDetalleAlContado_VentaContado");
        });

        modelBuilder.Entity<VentaMayoristaDetalle>(entity =>
        {
            entity.HasKey(e => e.IdDetalleVm).HasName("PK__VentaMay__4D73A3398863F6B3");

            entity.ToTable("VentaMayoristaDetalle", tb => tb.HasTrigger("trg_VentaMayoristaDetalle_AjustaInventario"));

            entity.Property(e => e.IdDetalleVm).HasColumnName("IdDetalleVM");
            entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.VentaMayoristaDetalles)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VentaMayo__IdPro__619B8048");

            entity.HasOne(d => d.IdVentaNavigation).WithMany(p => p.VentaMayoristaDetalles)
                .HasForeignKey(d => d.IdVenta)
                .HasConstraintName("FK__VentaMayo__IdVen__60A75C0F");
        });

        modelBuilder.Entity<VentaMayoristum>(entity =>
        {
            entity.HasKey(e => e.IdVenta).HasName("PK__VentaMay__BC1240BDC9DC8232");

            entity.ToTable(tb => tb.HasTrigger("trg_VentaMayorista_SumaSaldoCliente"));

            entity.HasIndex(e => e.IdCliente, "IX_VentaMayorista_Cliente");

            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .HasDefaultValue("Pendiente");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Total).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.VentaMayorista)
                .HasForeignKey(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VentaMayo__IdCli__5BE2A6F2");
        });

        OnModelCreatingPartial(modelBuilder);
    }
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
