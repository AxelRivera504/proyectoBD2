import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import SelectBox from "devextreme-react/select-box";
import DataGrid, { Column } from "devextreme-react/data-grid";
import Popup from "devextreme-react/popup";

import {
  getProveedoresConPendiente,
  getFacturasPendientes,
  getProductosPorFactura,
  devolverProducto
} from "../services/supllierDevolution/devolutions_service";

export default function DevolucionProveedor() {
  const [proveedores, setProveedores] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [productos, setProductos] = useState([]);

  const [idProveedor, setIdProveedor] = useState("");
  const [idFactura, setIdFactura] = useState("");

  // Datos de devolución
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  // CARGA INICIAL
  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const res = await getProveedoresConPendiente();
      if (res.data.ok) setProveedores(res.data.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar proveedores", "error");
    }
  };

  const loadFacturas = async (id) => {
    try {
      const res = await getFacturasPendientes(id);
      if (res.data.ok) setFacturas(res.data.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar facturas", "error");
    }
  };

  const loadProductos = async (id) => {
    try {
      const res = await getProductosPorFactura(id);
      if (res.data.ok) setProductos(res.data.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar productos", "error");
    }
  };

  // Manejar selección proveedor
  const handleProveedor = (id) => {
    setIdProveedor(id);
    setFacturas([]);
    setProductos([]);
    setIdFactura("");
    loadFacturas(id);
  };

  const handleFactura = (id) => {
    setIdFactura(id);
    setProductos([]);
    loadProductos(id);
  };

  const abrirPopup = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad("");
    setMotivo("");
    setShowPopup(true);
  };

  const confirmarDevolucion = async () => {
    if (!cantidad || cantidad <= 0)
      return Swal.fire("Cantidad inválida", "", "warning");

    if (cantidad > productoSeleccionado.cantidadFacturada)
      return Swal.fire("No puede devolver más de lo facturado", "", "warning");

    const payload = {
      idFacturaProveedor: idFactura,
      idProducto: productoSeleccionado.idProducto,
      cantidad: Number(cantidad),
      motivo
    };

    try {
      const res = await devolverProducto(payload);

      if (res.data.ok) {
        Swal.fire("Éxito", res.data.data, "success");
        setShowPopup(false);
        loadProductos(idFactura);
      } else {
        Swal.fire("Error", res.data.data, "error");
      }

    } catch {
      Swal.fire("Error", "No se pudo procesar la devolución", "error");
    }
  };

  return (
    <div className="container mt-4">

      <h3>Devoluciones a Proveedores</h3>

      {/* PROVEEDOR */}
      <label className="fw-bold mt-3">Proveedor</label>
      <SelectBox
        items={proveedores}
        displayExpr="nombreProveedor"
        valueExpr="idProveedor"
        value={idProveedor}
        onValueChange={handleProveedor}
        searchEnabled
        placeholder="Seleccione proveedor"
      />

      {/* FACTURAS */}
      {idProveedor && (
        <>
          <label className="fw-bold mt-4">Facturas pendientes</label>
          <SelectBox
            items={facturas}
            displayExpr="idFactura"
            valueExpr="idFactura"
            value={idFactura}
            onValueChange={handleFactura}
            placeholder="Seleccione factura"
            searchEnabled
          />
        </>
      )}

      {/* PRODUCTOS */}
      {idFactura && productos.length > 0 && (
        <div className="mt-4">
          <h5>Productos en factura #{idFactura}</h5>

          <DataGrid dataSource={productos} showBorders height={400}>

            <Column dataField="idProducto" caption="ID" width={80} />
            <Column dataField="nombre" caption="Producto" />
            <Column dataField="cantidadFacturada" caption="Facturado" width={100} />
            <Column dataField="existencia" caption="Existencia" width={100} />
            <Column dataField="precioCompra" caption="Precio" width={100} />

            <Column
              caption="Devolver"
              width={140}
              cellRender={(e) => (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => abrirPopup(e.data)}
                >
                  Devolver
                </button>
              )}
            />

          </DataGrid>
        </div>
      )}

      {/* POPUP DE DEVOLUCIÓN */}
      <Popup
        visible={showPopup}
        width={420}
        height={430}
        title="Registrar Devolución"
        onHiding={() => setShowPopup(false)}
      >
        <div className="p-3">

          <p><strong>Producto:</strong> {productoSeleccionado?.nombre}</p>
          <p><strong>Facturado:</strong> {productoSeleccionado?.cantidadFacturada}</p>
          <p><strong>Existencia:</strong> {productoSeleccionado?.existencia}</p>

          <label className="fw-bold mt-2">Cantidad a devolver</label>
          <input
            className="form-control"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />

          <label className="fw-bold mt-3">Motivo</label>
          <textarea
            className="form-control"
            rows="3"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={confirmarDevolucion}
          >
            Registrar devolución
          </button>

        </div>
      </Popup>

    </div>
  );
}
