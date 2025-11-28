import React, { useEffect, useState } from "react";
import {
  getVentasContado,
  getVentasMayoristas,
  getOrdenesCompra,
  getProductosMasVendidos,
  getTopClientes,
  getDevolucionesProveedor,
} from "../services/reportes/reportes_service";

import DataGrid, {
  Column,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";

import SelectBox from "devextreme-react/select-box";
import Swal from "sweetalert2";

export default function Reportes() {
  const [tab, setTab] = useState("contado");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  const [ventasContado, setVentasContado] = useState([]);
  const [ventasMayoristas, setVentasMayoristas] = useState([]);
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [devoluciones, setDevoluciones] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7132/api/Client/GetAll")
      .then((r) => r.json())
      .then((res) => setClientes(res.data || []));

    fetch("https://localhost:7132/api/Supplier/GetAll")
      .then((r) => r.json())
      .then((res) => setProveedores(res.data || []));
  }, []);

  const ejecutarReporte = async () => {
    try {
      const inicio = fechaInicio ? new Date(fechaInicio).toISOString() : null;
      const fin = fechaFin ? new Date(fechaFin).toISOString() : null;

      if (
        ["contado", "mayoristas", "ordenes", "devoluciones"].includes(tab) &&
        (!inicio || !fin)
      ) {
        return Swal.fire("Error", "Seleccione un rango de fechas", "warning");
      }

      switch (tab) {
        case "contado":
          setVentasContado((await getVentasContado(inicio, fin)).data.data);
          break;

        case "mayoristas":
          setVentasMayoristas(
            (await getVentasMayoristas(inicio, fin, selectedCliente)).data.data
          );
          break;

        case "ordenes":
          setOrdenesCompra(
            (await getOrdenesCompra(inicio, fin, selectedProveedor)).data.data
          );
          break;

        case "masvendidos":
          setProductosMasVendidos(
            (await getProductosMasVendidos()).data.data
          );
          break;

        case "topclientes":
          setTopClientes((await getTopClientes()).data.data);
          break;

        case "devoluciones":
          setDevoluciones(
            (
              await getDevolucionesProveedor(
                selectedProveedor,
                inicio,
                fin
              )
            ).data.data
          );
          break;
      }
    } catch {
      Swal.fire("Error", "No se pudo cargar el reporte", "error");
    }
  };

  const Filtros = ({ showCliente, showProveedor, hideFechas }) => (
    <div className="card p-4 shadow-sm mb-4">
      <div className="row g-3">
        {!hideFechas && (
          <>
            <div className="col-md-3">
              <label className="fw-semibold">Fecha Inicio</label>
              <input
                type="date"
                className="form-control"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="fw-semibold">Fecha Fin</label>
              <input
                type="date"
                className="form-control"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </>
        )}

        {showCliente && (
          <div className="col-md-4">
            <label className="fw-semibold">Cliente</label>
            <SelectBox
              items={clientes}
              displayExpr="nombre"
              valueExpr="idCliente"
              value={selectedCliente}
              onValueChange={setSelectedCliente}
              searchEnabled
              placeholder="Todos"
            />
          </div>
        )}

        {showProveedor && (
          <div className="col-md-4">
            <label className="fw-semibold">Proveedor</label>
            <SelectBox
              items={proveedores}
              displayExpr="nombre"
              valueExpr="idProveedor"
              value={selectedProveedor}
              onValueChange={setSelectedProveedor}
              searchEnabled
              placeholder="Todos"
            />
          </div>
        )}
      </div>

      <div className="text-end mt-3">
        <button className="btn btn-primary px-4" onClick={ejecutarReporte}>
          Buscar
        </button>
      </div>
    </div>
  );

  const renderTabla = () => {
    switch (tab) {
      case "contado":
        return (
          <>
            <Filtros />
            <DataGrid
              dataSource={ventasContado}
              showBorders
              height={500}
            >
              <SearchPanel visible />
              <Paging defaultPageSize={10} />
              <Column dataField="idVenta" caption="ID" width={80} />
              <Column
                dataField="fecha"
                caption="Fecha"
                customizeText={(e) => e.value?.split("T")[0]}
              />
              <Column dataField="total" caption="Total L." />
            </DataGrid>
          </>
        );

      case "mayoristas":
        return (
          <>
            <Filtros showCliente />
            <DataGrid dataSource={ventasMayoristas} showBorders height={500}>
              <SearchPanel visible />
              <Paging defaultPageSize={10} />
              <Column dataField="idVenta" caption="ID" width={80} />
              <Column dataField="cliente" caption="Cliente" />
              <Column
                dataField="fecha"
                caption="Fecha"
                customizeText={(e) => e.value?.split("T")[0]}
              />
              <Column dataField="total" caption="Total L." />
            </DataGrid>
          </>
        );

      case "ordenes":
        return (
          <>
            <Filtros showProveedor />
            <DataGrid dataSource={ordenesCompra} showBorders height={500}>
              <SearchPanel visible />
              <Paging defaultPageSize={10} />
              <Column dataField="idOrdenCompra" caption="ID" width={80} />
              <Column dataField="nombreProveedor" caption="Proveedor" />
              <Column
                dataField="fecha"
                caption="Fecha"
                customizeText={(e) => e.value?.split("T")[0]}
              />
              <Column dataField="total" caption="Total L." />
            </DataGrid>
          </>
        );

      case "masvendidos":
        return (
          <>
            <Filtros hideFechas />
            <DataGrid dataSource={productosMasVendidos} showBorders height={500}>
              <SearchPanel visible />
              <Paging defaultPageSize={10} />
              <Column dataField="nombreProducto" caption="Producto" />
              <Column dataField="cantidadVendida" caption="Cantidad" />
              <Column dataField="totalGenerado" caption="Total L." />
            </DataGrid>
          </>
        );

      case "topclientes":
        return (
          <>
            <Filtros hideFechas />
            <DataGrid dataSource={topClientes} showBorders height={500}>
              <SearchPanel visible />
              <Paging defaultPageSize={10} />
              <Column dataField="cliente" caption="Cliente" />
              <Column dataField="cantidadVentas" caption="Cantidad ventas" />
              <Column dataField="totalVendido" caption="Total L." />
            </DataGrid>
          </>
        );

      case "devoluciones":
        return (
          <>
            <Filtros showProveedor />
            <DataGrid dataSource={devoluciones} showBorders height={500}>
              <SearchPanel visible />
              <Paging defaultPageSize={10} />
              <Column dataField="idDevolucion" caption="ID" width={80} />
              <Column dataField="nombre" caption="Proveedor" />
              <Column dataField="producto" caption="Producto" />
              <Column dataField="cantidad" caption="Cantidad" />
              <Column
                dataField="fecha"
                caption="Fecha"
                customizeText={(e) => e.value?.split("T")[0]}
              />
              <Column dataField="motivo" caption="Motivo" />
            </DataGrid>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "1400px" }}>
      <h2 className="mb-4 text-center">Reportes del Sistema</h2>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card p-3 shadow-sm">
            <button
              className={`btn w-100 mb-2 ${
                tab === "contado" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setTab("contado")}
            >
              Ventas Contado
            </button>

            <button
              className={`btn w-100 mb-2 ${
                tab === "mayoristas" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setTab("mayoristas")}
            >
              Ventas Mayoristas
            </button>

            <button
              className={`btn w-100 mb-2 ${
                tab === "ordenes" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setTab("ordenes")}
            >
              Órdenes de Compra
            </button>

            <button
              className={`btn w-100 mb-2 ${
                tab === "masvendidos" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setTab("masvendidos")}
            >
              Productos Más Vendidos
            </button>

            <button
              className={`btn w-100 mb-2 ${
                tab === "topclientes" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setTab("topclientes")}
            >
              Top Clientes
            </button>

            <button
              className={`btn w-100 mb-2 ${
                tab === "devoluciones" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setTab("devoluciones")}
            >
              Devoluciones Proveedor
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="col-md-9">{renderTabla()}</div>
      </div>
    </div>
  );
}
