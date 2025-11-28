import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import DataGrid, {
  Column,
  Paging,
  SearchPanel,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
  MasterDetail,
} from "devextreme-react/data-grid";

import Popup from "devextreme-react/popup";
import SelectBox from "devextreme-react/select-box";

import {
  getAllMayorista,
  createMayorista,
} from "../services/sales_billing/sales_billing";

import { getClients } from "../services/clients/client_service";
import { getAllProducts } from "../services/products/product_service";

// 👉 IMPORT NUEVO SERVICIO DE PAGOS
import {
  pagarFacturaCliente
} from "../services/payments/clients/client_payment_service";

export default function VentasMayorista() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [idCliente, setIdCliente] = useState("");
  const [detalles, setDetalles] = useState([]);

  // Inputs de detalle
  const [productoId, setProductoId] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");

  // =====================================================================
  // PAGOS - NUEVO
  // =====================================================================

  const [showPago, setShowPago] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [tipoPago, setTipoPago] = useState("");

  // =====================================================================
  // CARGA DE DATOS
  // =====================================================================

  const loadVentas = async () => {
    try {
      const res = await getAllMayorista();
      setVentas(res.data || []);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las ventas mayoristas", "error");
    }
  };

  const loadClientes = async () => {
    try {
      const res = await getClients();
      if (res.data.ok) setClientes(res.data.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    }
  };

  const loadProductos = async () => {
    try {
      const res = await getAllProducts();
      setProductos(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    loadVentas();
    loadClientes();
    loadProductos();
  }, []);

  // =====================================================================
  // CARRITO DE DETALLES (LO TUYO)
  // =====================================================================

  const handleSelectProducto = (id) => {
    setProductoId(id);
    const prod = productos.find((p) => p.idProducto === id);
    if (prod) setPrecioUnitario(prod.precioVenta);
  };

  const agregarDetalle = () => {
    if (!productoId || !cantidad || !precioUnitario) {
      return Swal.fire("Error", "Complete todos los campos de detalle", "warning");
    }

    const producto = productos.find((p) => p.idProducto === productoId);
    if (!producto) return;

    if (cantidad > producto.existencia) {
      return Swal.fire(
        "Stock insuficiente",
        `Solo hay ${producto.existencia} unidades disponibles`,
        "error"
      );
    }

    const existente = detalles.find((d) => d.idProducto === productoId);

    if (existente) {
      existente.cantidad += Number(cantidad);
      existente.precioUnitario = Number(precioUnitario);
      setDetalles([...detalles]);
    } else {
      setDetalles([
        ...detalles,
        {
          idProducto: productoId,
          nombre: producto.nombre,
          cantidad: Number(cantidad),
          precioUnitario: Number(precioUnitario),
        },
      ]);
    }

    setProductoId(null);
    setCantidad("");
    setPrecioUnitario("");
  };

  const eliminarDetalle = (id) => {
    setDetalles(detalles.filter((d) => d.idProducto !== id));
  };

  const totalVenta = detalles.reduce(
    (acc, d) => acc + d.cantidad * d.precioUnitario,
    0
  );

  // =====================================================================
  // GUARDAR VENTA MAYORISTA (LO TUYO)
  // =====================================================================

  const handleGuardar = async () => {
    if (!idCliente) {
      return Swal.fire("Error", "Debe seleccionar un cliente", "warning");
    }
    if (detalles.length === 0) {
      return Swal.fire("Error", "Debe agregar al menos un producto", "warning");
    }

    const payload = {
      idCliente: Number(idCliente),
      total: totalVenta,
      detalles: detalles.map((d) => ({
        idProducto: d.idProducto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
      })),
    };

    try {
      await createMayorista(payload);
      Swal.fire("Éxito", "Venta mayorista registrada con éxito", "success");

      setShowModal(false);
      setIdCliente("");
      setDetalles([]);
      loadVentas();
    } catch {
      Swal.fire("Error", "No se pudo registrar la venta", "error");
    }
  };

  // =====================================================================
  // MASTER DETAIL (LO TUYO)
  // =====================================================================

  const detalleTemplate = (detailInfo) => {
    const venta = detailInfo.data;
    const rows = venta.detalles || [];

    if (!rows.length) {
      return (
        <div className="p-3">
          <strong>Venta #{venta.idVenta}</strong>
          <div className="text-muted mt-2">Esta venta no tiene detalles.</div>
        </div>
      );
    }

    return (
      <div className="p-3">
        <strong>Detalle de la venta #{venta.idVenta}</strong>
        <DataGrid
          dataSource={rows}
          keyExpr="idProducto"
          showBorders={true}
          columnAutoWidth={true}
          rowAlternationEnabled={true}
          height={260}
        >
          <Column dataField="idProducto" caption="ID" width={80} />
          <Column dataField="nombreProducto" caption="Producto" />
          <Column dataField="cantidad" caption="Cantidad" width={100} />
          <Column dataField="precioUnitario" caption="Precio Unit." width={130} />
          <Column
            caption="Subtotal"
            width={130}
            calculateCellValue={(row) =>
              (row.cantidad || 0) * (row.precioUnitario || 0)
            }
          />
        </DataGrid>
      </div>
    );
  };

  // =====================================================================
  // === ★★ COLUMNA NUEVA: PAGAR ★★
  // =====================================================================

  const renderBotonPago = (e) => {
    if (e.data.estado === "Pagada")
      return <span className="badge bg-success">Pagada</span>;

    return (
      <button
        className="btn btn-success btn-sm"
        onClick={() => {
          setVentaSeleccionada(e.data);
          setMontoPago("");
          setTipoPago("");
          setShowPago(true);
        }}
      >
        Pagar
      </button>
    );
  };

  // =====================================================================
  // === ★★ POPUP PARA PAGAR VENTA ★★
  // =====================================================================

  const handlePagar = async () => {
    if (!montoPago || montoPago <= 0)
      return Swal.fire("Error", "Monto inválido", "warning");

    if (montoPago > ventaSeleccionada.saldo)
      return Swal.fire("Error", "No puede pagar más del saldo", "warning");

    if (!tipoPago)
      return Swal.fire("Error", "Seleccione tipo de pago", "warning");

    const payload = {
      idCliente: ventaSeleccionada.idCliente,
      idVenta: ventaSeleccionada.idVenta,
      montoPagado: Number(montoPago),
      tipoPago,
    };

    try {
      const res = await pagarFacturaCliente(payload);

      if (res.data.ok) {
        Swal.fire("Éxito", res.data.mensaje, "success");
        loadVentas();
        setShowPago(false);
      }
    } catch {
      Swal.fire("Error", "No se pudo registrar el pago", "error");
    }
  };

  // =====================================================================
  // RENDER
  // =====================================================================

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Ventas al Mayorista</h2>

      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        + Nueva Venta Mayorista
      </button>

      <DataGrid
        dataSource={ventas}
        keyExpr="idVenta"
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        height={600}
      >
        <SearchPanel visible={true} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <ColumnChooser enabled={true} />
        <Paging defaultPageSize={10} />

        <Column dataField="idVenta" caption="ID" width={80} />
        <Column dataField="nombreCliente" caption="Cliente" />

        <Column
          dataField="fecha"
          caption="Fecha"
          customizeText={(e) => e.value?.split("T")[0] || "-"}
          width={120}
        />

        <Column dataField="total" caption="Total L." width={130} />
        <Column dataField="estado" caption="Estado" width={120} />

        {/* ★★ COLUMNA PAGAR ★★ */}
        <Column
          caption="Pagar"
          width={120}
          cellRender={renderBotonPago}
        />

        <MasterDetail enabled={true} render={detalleTemplate} />
      </DataGrid>

      {/* ================================================================= */}
      {/* POPUP DE PAGO INDIVIDUAL */}
      {/* ================================================================= */}
      <Popup
        visible={showPago}
        onHiding={() => setShowPago(false)}
        width={430}
        height={400}
        title="Pago de Venta"
      >
        <div className="p-3">
          <h5>Factura #{ventaSeleccionada?.idVenta}</h5>
          <p><strong>Cliente:</strong> {ventaSeleccionada?.nombreCliente}</p>
          <p><strong>Saldo:</strong> L. {ventaSeleccionada?.saldo}</p>

          <label>Monto a pagar</label>
          <input
            type="number"
            className="form-control mb-2"
            value={montoPago}
            onChange={(e) => setMontoPago(e.target.value)}
          />

          <label>Tipo de pago</label>
          <select
            className="form-control"
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
          >
            <option value="">Seleccione</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Cheque">Cheque</option>
          </select>

          <button
            className="btn btn-success w-100 mt-3"
            onClick={handlePagar}
          >
            Registrar Pago
          </button>
        </div>
      </Popup>

      {/* ================================================================= */}
      {/* POPUP DE NUEVA VENTA (LO TUYO IGUALITO) */}
      {/* ================================================================= */}

      <Popup
        visible={showModal}
        onHiding={() => setShowModal(false)}
        closeOnOutsideClick={true}
        width={850}
        title="Registrar Venta Mayorista"
      >
        <div className="p-3">
          {/* cliente */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label>Cliente</label>
              <SelectBox
                items={clientes}
                displayExpr="nombre"
                valueExpr="idCliente"
                value={idCliente}
                onValueChange={setIdCliente}
                searchEnabled={true}
                placeholder="Seleccione cliente"
              />
            </div>

            <div className="col-md-6">
              <label>Total</label>
              <input className="form-control" value={totalVenta} disabled />
            </div>
          </div>

          <hr />

          {/* productos */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label>Producto</label>
              <SelectBox
                items={productos}
                displayExpr="nombre"
                valueExpr="idProducto"
                value={productoId}
                onValueChange={handleSelectProducto}
                searchEnabled={true}
                placeholder="Seleccione producto"
              />
            </div>

            <div className="col-md-3">
              <label>Cantidad</label>
              <input
                type="number"
                className="form-control"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
            </div>

            <div className="col-md-3">
              <label>Precio Unitario</label>
              <input
                type="number"
                className="form-control"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(Number(e.target.value))}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-secondary w-100" onClick={agregarDetalle}>
                + Agregar
              </button>
            </div>
          </div>

          {/* tabla */}
          <table className="table table-bordered text-center mt-3">
            <thead className="table-dark">
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th>Quitar</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length === 0 ? (
                <tr>
                  <td colSpan="5">Sin productos</td>
                </tr>
              ) : (
                detalles.map((d) => (
                  <tr key={d.idProducto}>
                    <td>{d.nombre}</td>
                    <td>{d.cantidad}</td>
                    <td>{d.precioUnitario}</td>
                    <td>{d.cantidad * d.precioUnitario}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarDetalle(d.idProducto)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* botones */}
          <div className="text-end mt-3">
            <button className="btn btn-success me-2" onClick={handleGuardar}>
              Guardar Venta
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
