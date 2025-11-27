import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import DataGrid, {
  Column,
  Paging,
  SearchPanel,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
} from "devextreme-react/data-grid";

import Popup from "devextreme-react/popup";
import Form, { Item, Label } from "devextreme-react/form";
import SelectBox from "devextreme-react/select-box";

import {
  crearVentaContado,
  obtenerVentasContado,
} from "../services/sales_billing/sales_billing";

import { getAllProducts } from "../services/products/product_service";

export default function VentasContado() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [detalles, setDetalles] = useState([]);

  const [productoId, setProductoId] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  // Cargar ventas
  const loadVentas = async () => {
    try {
      const res = await obtenerVentasContado();
      setVentas(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las ventas", "error");
    }
  };

  // Cargar productos
  const loadProductos = async () => {
    try {
      const res = await getAllProducts();
      setProductos(res.data); // trae id, nombre, existencia, precioVenta
    } catch {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    loadVentas();
    loadProductos();
  }, []);

  // Cuando seleccionamos un producto, ponemos el precio por defecto
  const handleSelectProducto = (id) => {
    setProductoId(id);
    const prod = productos.find((p) => p.idProducto === id);
    if (prod) {
      setPrecio(prod.precioVenta); // automáticamente carga el precio
    }
  };

  // Agregar al carrito
  const addDetalle = () => {
    if (!productoId || !cantidad || !precio) {
      return Swal.fire("Error", "Completa todos los campos", "warning");
    }

    const prod = productos.find((p) => p.idProducto === productoId);

    // Validar stock
    if (cantidad > prod.existencia) {
      return Swal.fire("Error", "La cantidad supera el stock disponible", "error");
    }

    // Verificar si el producto ya está en el carrito
    const existente = detalles.find((d) => d.idProducto === productoId);

    if (existente) {
      // Sumamos
      existente.cantidad += Number(cantidad);
      existente.precio = Number(precio);

      setDetalles([...detalles]);
    } else {
      setDetalles([
        ...detalles,
        {
          idProducto: productoId,
          nombre: prod.nombre,
          cantidad: Number(cantidad),
          precio: Number(precio),
        },
      ]);
    }

    // reset
    setProductoId(null);
    setCantidad("");
    setPrecio("");
  };

  const handleCrearVenta = async () => {
    if (detalles.length === 0) {
      return Swal.fire("Error", "Añade productos antes de guardar", "warning");
    }

    const total = detalles.reduce((acc, d) => acc + d.cantidad * d.precio, 0);

    try {
      await crearVentaContado({
        total,
        detalles,
      });

      Swal.fire("Éxito", "Venta registrada correctamente", "success");

      setDetalles([]);
      setShowModal(false);
      loadVentas();
    } catch (err) {
      Swal.fire("Error", "Ocurrió un error al registrar la venta", "error");
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Ventas al Contado</h2>

      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        + Nueva Venta
      </button>

      {/* Tabla de ventas */}
      <DataGrid
        dataSource={ventas}
        keyExpr="idVentaContado"
        showBorders={true}
        columnAutoWidth={true}
        height={500}
      >
        <SearchPanel visible={true} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Paging defaultPageSize={10} />

        <Column dataField="idVentaContado" caption="ID" width={80} />
        <Column
          dataField="fecha"
          caption="Fecha"
          customizeText={(e) => (e.value ? e.value.split("T")[0] : "-")}
        />
        <Column dataField="total" caption="Total L." />
      </DataGrid>

      {/* Modal */}
      <Popup
        visible={showModal}
        onHiding={() => setShowModal(false)}
        closeOnOutsideClick={true}
        width={800}
        title="Registrar Venta al Contado"
      >
        <div className="p-3">

          <h5>Agregar Productos</h5>

          <div className="row mt-3">

            <div className="col-md-4 mb-2">
              <label>Producto</label>
              <SelectBox
                items={productos}
                displayExpr="nombre"
                valueExpr="idProducto"
                value={productoId}
                onValueChange={handleSelectProducto}
                placeholder="Seleccione..."
                searchEnabled={true}
              />
            </div>

            <div className="col-md-3 mb-2">
              <label>Cantidad</label>
              <input
                type="number"
                className="form-control"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
            </div>

            <div className="col-md-3 mb-2">
              <label>Precio</label>
              <input
                type="number"
                className="form-control"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
              />
            </div>

            <div className="col-md-2 mt-4 pt-2">
              <button className="btn btn-secondary w-100" onClick={addDetalle}>
                + Añadir
              </button>
            </div>
          </div>

          <hr />

          <h5>Detalle de la Venta</h5>

          <table className="table table-bordered text-center mt-2">
            <thead className="table-dark">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length === 0 ? (
                <tr><td colSpan="4">No hay productos</td></tr>
              ) : (
                detalles.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.nombre}</td>
                    <td>{d.cantidad}</td>
                    <td>{d.precio}</td>
                    <td>{d.cantidad * d.precio}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="text-end mt-3">
            <button className="btn btn-success me-2" onClick={handleCrearVenta}>
              Guardar Venta
            </button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </div>

        </div>
      </Popup>
    </div>
  );
}
