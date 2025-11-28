import React, { useEffect, useState } from "react";
import DataGrid, {
  Column,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
import {
  getDashboardSummary,
  getLowStockProducts,
  getPagosProveedorPeriodo,
} from "../../services/dashboard/dashboard_service";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    productosEnStock: 0,
    ventasDelMes: 0,
    ordenesPendientes: 0,
    productosPorAgotarse: 0,
  });

  const [lowStock, setLowStock] = useState([]);
  const [pagosPeriodo, setPagosPeriodo] = useState([]);

  const loadSummary = async () => {
    try {
      const res = await getDashboardSummary();
      if (res.data.ok) {
        setSummary(res.data.data);
      }
    } catch {
      Swal.fire("Error", "No se pudo cargar el resumen del dashboard", "error");
    }
  };

  const loadLowStock = async () => {
    try {
      const res = await getLowStockProducts();
      if (res.data.ok) {
        setLowStock(res.data.data);
      }
    } catch {}
  };

  const loadPagosPeriodo = async () => {
    try {
      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const fechaInicio = inicioMes.toISOString();
      const fechaFin = hoy.toISOString();

      const res = await getPagosProveedorPeriodo(fechaInicio, fechaFin);
      if (res.data.ok) {
        setPagosPeriodo(res.data.data);
      }
    } catch {}
  };

  useEffect(() => {
    loadSummary();
    loadLowStock();
    loadPagosPeriodo();
  }, []);

  const stats = [
    {
      icon: "📦",
      title: "Productos en Stock",
      value: summary.productosEnStock.toLocaleString(),
    },
    {
      icon: "💰",
      title: "Ventas del Mes",
      value: (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
          <span style={{ fontSize: "14px", color: "#555" }}>Lempiras</span>
          <span style={{ fontSize: "28px", fontWeight: "bold", color: "#0078ff" }}>
            {summary.ventasDelMes.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      ),
    },
    {
      icon: "📋",
      title: "Órdenes de Compra Pendientes",
      value: summary.ordenesPendientes.toString(),
    },
    {
      icon: "⚠️",
      title: "Productos por Agotarse",
      value: summary.productosPorAgotarse.toString(),
    },
  ];

  return (
    <div className="dashboard-wrapper">

      <h2 className="mb-4">Inicio</h2>

      {/* --- TARJETAS --- */}
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-title">{s.title}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="row g-4">

        {/* === PRODUCTOS POR AGOTARSE === */}
        <div className="col-md-7">
          <div className="table-box">
            <h4 className="section-title">Productos por Agotarse</h4>

            <DataGrid
              dataSource={lowStock}
              showBorders={true}
              columnAutoWidth={true}
              rowAlternationEnabled={true}
              height={320}
              noDataText="No hay productos por debajo del mínimo."
            >
              <SearchPanel visible={true} />
              <Paging defaultPageSize={10} />

              <Column dataField="idProducto" caption="ID" width={80} />
              <Column dataField="nombre" caption="Producto" />
              <Column dataField="existencia" caption="Existencia" width={110} />
              <Column dataField="minimo" caption="Mínimo" width={110} />
            </DataGrid>
          </div>
        </div>

       <div className="col-md-5">
          <h4 className="mb-3">Pagos a Proveedores (Mes Actual)</h4>

          <div className="card shadow-sm p-3 radius">
            <DataGrid
              dataSource={pagosPeriodo}
              showBorders={false}
              rowAlternationEnabled={true}
              columnAutoWidth={false}
              noDataText="No hay pagos en el período."
              height={320}
            >
              <Column
                dataField="fecha"
                caption="Fecha"
                width={120}
                alignment="center"
                customizeText={(e) => (e.value ? e.value.split("T")[0] : "")}
              />
              <Column
                dataField="tipoPago"
                caption="Tipo de Pago"
                width={180}
                alignment="left"
              />
              <Column
                dataField="montoTotal"
                caption="Monto Total"
                alignment="right"
                customizeText={(e) =>
                  `L. ${Number(e.value || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />
              <Paging defaultPageSize={8} />
            </DataGrid>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Dashboard;
