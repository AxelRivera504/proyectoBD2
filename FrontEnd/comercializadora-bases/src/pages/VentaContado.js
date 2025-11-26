import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  crearVentaContado,
  obtenerVentasContado,
  obtenerVentaContadoPorId,
} from "../services/sales_billing/sales_billing";

export default function VentasContado() {
  const [ventas, setVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [detalles, setDetalles] = useState([]);
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  const loadVentas = async () => {
    try {
      const res = await obtenerVentasContado();
      setVentas(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar las ventas", "error");
    }
  };

  useEffect(() => {
    loadVentas();
  }, []);

  const addDetalle = () => {
    if (!producto || !cantidad || !precio) {
      return Swal.fire("Error", "Completa todos los campos", "warning");
    }

    setDetalles([
      ...detalles,
      {
        idProducto: Number(producto),
        cantidad: Number(cantidad),
        precio: Number(precio),
      },
    ]);

    setProducto("");
    setCantidad("");
    setPrecio("");
  };

  const handleCrearVenta = async () => {
    if (detalles.length === 0) {
      return Swal.fire("Error", "Debe agregar al menos un detalle", "warning");
    }

    const total = detalles.reduce((acc, item) => acc + item.cantidad * item.precio, 0);

    try {
      const res = await crearVentaContado({ total, detalles });

      Swal.fire("Éxito", "Venta creada con éxito", "success");
      setShowModal(false);
      setDetalles([]);
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

      {/* Listado */}
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.idVentaContado}>
              <td>{v.idVentaContado}</td>
              <td>{v.fecha?.split("T")[0]}</td>
              <td>L. {v.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block" style={{ background: "#00000088" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-3">

              <h4>Nueva Venta al Contado</h4>

              <div className="row mt-3">

                <div className="col-md-4 mb-2">
                  <label>ID Producto</label>
                  <input className="form-control"
                         value={producto}
                         onChange={(e) => setProducto(e.target.value)} />
                </div>

                <div className="col-md-4 mb-2">
                  <label>Cantidad</label>
                  <input className="form-control"
                         type="number"
                         value={cantidad}
                         onChange={(e) => setCantidad(e.target.value)} />
                </div>

                <div className="col-md-4 mb-2">
                  <label>Precio</label>
                  <input className="form-control"
                         type="number"
                         value={precio}
                         onChange={(e) => setPrecio(e.target.value)} />
                </div>

                <div className="col-md-12 mt-2">
                  <button className="btn btn-secondary" onClick={addDetalle}>
                    + Agregar Detalle
                  </button>
                </div>

              </div>

              <hr />

              <h5>Detalles agregados</h5>

              <ul className="list-group">
                {detalles.map((d, idx) => (
                  <li key={idx} className="list-group-item">
                    Producto {d.idProducto} — Cant: {d.cantidad} — Precio: L. {d.precio}
                  </li>
                ))}
              </ul>

              <div className="mt-3 d-flex justify-content-end">
                <button className="btn btn-success me-2" onClick={handleCrearVenta}>
                  Guardar Venta
                </button>

                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
