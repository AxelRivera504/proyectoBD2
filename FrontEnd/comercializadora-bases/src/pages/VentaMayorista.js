// src/pages/VentasMayorista.js
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getAllMayorista,
  createMayorista,
} from "../services/sales_billing/sales_billing";

import { getClients } from "../services/clients/client_service";
import { getAllProducts } from "../services/products/product_service";

export default function VentasMayorista() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    idCliente: "",
    detalles: [],
  });

  const resetForm = () => {
    setFormData({
      idCliente: "",
      detalles: [],
    });
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  // -------------------------------
  // Cargar datos
  // -------------------------------

  const loadVentas = async () => {
    try {
      const res = await getAllMayorista();
      setVentas(res.data || []);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las ventas", "error");
    }
  };

 const loadClientes = async () => {
  try {
    const res = await getClients();

    if (res.data.ok) {
      setClientes(res.data.data);   // 👈 AQUÍ ESTÁ EL ARREGLO REAL
    } else {
      Swal.fire("Error", res.data.mensaje, "error");
    }
  } catch {
    Swal.fire("Error", "No se pudieron cargar los clientes", "error");
  }
};

  const loadProductos = async () => {
    try {
      const res = await getAllProducts();
      setProductos(res.data || []);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    loadVentas();
    loadClientes();
    loadProductos();
  }, []);

  // -------------------------------
  // Manejo de detalles
  // -------------------------------

  const agregarDetalle = () => {
    setFormData({
      ...formData,
      detalles: [
        ...formData.detalles,
        { idProducto: "", cantidad: "", precioUnitario: "" },
      ],
    });
  };

  const actualizarDetalle = (index, field, value) => {
    const copia = [...formData.detalles];
    copia[index][field] = value;
    setFormData({ ...formData, detalles: copia });
  };

  const eliminarDetalle = (index) => {
    const copia = [...formData.detalles];
    copia.splice(index, 1);
    setFormData({ ...formData, detalles: copia });
  };

  const calcularTotal = () => {
    return formData.detalles.reduce((acc, d) => {
      const cant = Number(d.cantidad) || 0;
      const precio = Number(d.precioUnitario) || 0;
      return acc + cant * precio;
    }, 0);
  };

  // -------------------------------
  // Guardar venta
  // -------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
debugger;

    if (!formData.idCliente) {
      Swal.fire("Validación", "Debe seleccionar un cliente", "warning");
      return;
    }

    if (formData.detalles.length === 0) {
      Swal.fire("Validación", "Agregue al menos un producto", "warning");
      return;
    }

    const payload = {
      idCliente: Number(formData.idCliente),
      total: calcularTotal(),
      detalles: formData.detalles.map((d) => ({
        idProducto: Number(d.idProducto),
        cantidad: Number(d.cantidad),
        precioUnitario: Number(d.precioUnitario),
      })),
    };

    try {
      await createMayorista(payload);

      Swal.fire({
        icon: "success",
        title: "Venta mayorista registrada",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });

      setShowModal(false);
      loadVentas();
    } catch {
      Swal.fire("Error", "No se pudo registrar la venta", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Ventas al Mayorista</h2>

      <button className="btn btn-primary mb-3" onClick={openNewModal}>
        + Nueva Venta Mayorista
      </button>

      {/* Tabla */}
      <table className="table table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 ? (
            <tr>
              <td colSpan="6">No hay ventas registradas</td>
            </tr>
          ) : (
            ventas.map((v) => (
              <tr key={v.idVenta}>
                <td>{v.idVenta}</td>
                <td>{v.nombreCliente}</td>
                <td>{v.fecha}</td>
                <td>{v.total}</td>
                <td>{v.estado}</td>
                <td className="text-start">
                  {v.detalles?.map((d, i) => (
                    <div key={i}>
                      {d.nombreProducto} — Cant: {d.cantidad} — L. {d.precioUnitario}
                    </div>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content p-3">
              <h4 className="mb-3">Nueva Venta Mayorista</h4>

              <form onSubmit={handleSubmit}>
                {/* Cliente */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Cliente</label>
                    <select
                      className="form-control"
                      value={formData.idCliente}
                      onChange={(e) =>
                        setFormData({ ...formData, idCliente: e.target.value })
                      }
                      required
                    >
                      <option value="">Seleccione un cliente</option>
                      {clientes.map((c) => (
                        <option key={c.idCliente} value={c.idCliente}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Total</label>
                    <input
                      className="form-control"
                      value={calcularTotal()}
                      disabled
                    />
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <h5>Detalles</h5>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={agregarDetalle}
                  >
                    + Agregar producto
                  </button>
                </div>

                {formData.detalles.map((d, index) => (
                  <div className="row mb-2" key={index}>
                    <div className="col-md-4">
                      <label>Producto</label>
                      <select
                        className="form-control"
                        value={d.idProducto}
                        onChange={(e) =>
                          actualizarDetalle(index, "idProducto", e.target.value)
                        }
                        required
                      >
                        <option value="">Seleccione</option>
                        {productos.map((p) => (
                          <option key={p.idProducto} value={p.idProducto}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        className="form-control"
                        value={d.cantidad}
                        onChange={(e) =>
                          actualizarDetalle(index, "cantidad", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label>Precio Unitario</label>
                      <input
                        type="number"
                        className="form-control"
                        value={d.precioUnitario}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "precioUnitario",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-danger w-100"
                        onClick={() => eliminarDetalle(index)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}

                {/* Botones */}
                <div className="mt-3 d-flex justify-content-end">
                  <button className="btn btn-success me-2" type="submit">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
