import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/Suppliers/supplier_service";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    idProveedor: 0,
    nombre: "",
    rtn: "",
    telefono: "",
    direccion: "",
    limiteCredito: "",
    saldoActual: "",
    fechaRegistro: "",
  });

  const resetForm = () => {
    setFormData({
      idProveedor: 0,
      nombre: "",
      rtn: "",
      telefono: "",
      direccion: "",
      limiteCredito: "",
      saldoActual: "",
      fechaRegistro: "",
    });
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const loadSuppliers = async () => {
    try {
      const res = await getAllSuppliers();
      setSuppliers(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.idProveedor === 0) {
        const resp = await addSupplier(formData);
        Swal.fire("Éxito", resp.data || "Proveedor agregado exitosamente", "success");
      } else {
        const resp = await updateSupplier(formData);
        Swal.fire("Éxito", resp.data || "Proveedor actualizado exitosamente", "success");
      }

      setShowModal(false);
      loadSuppliers();

    } catch (err) {
      Swal.fire("Error", "Ocurrió un error al guardar el proveedor", "error");
    }
  };

  const handleEdit = (sup) => {
    setFormData({
      idProveedor: sup.idProveedor,
      nombre: sup.nombre,
      rtn: sup.rtn || "",
      telefono: sup.telefono || "",
      direccion: sup.direccion || "",
      limiteCredito: sup.limiteCredito || "",
      saldoActual: sup.saldoActual || "",
      fechaRegistro: sup.fechaRegistro?.split("T")[0] || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar proveedor?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const resp = await deleteSupplier(id);
      Swal.fire("Eliminado", resp.data || "Proveedor eliminado exitosamente", "success");
      loadSuppliers();
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar el proveedor", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Gestión de Proveedores</h2>

      <button className="btn btn-primary mb-3" onClick={openNewModal}>
        + Nuevo Proveedor
      </button>

      {/* Tabla ----------------------------- */}
      <table className="table table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RTN</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Límite Crédito</th>
            <th>Saldo Actual</th>
            <th>Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.length === 0 ? (
            <tr><td colSpan="9">No hay proveedores</td></tr>
          ) : (
            suppliers.map((sup) => (
              <tr key={sup.idProveedor}>
                <td>{sup.idProveedor}</td>
                <td>{sup.nombre}</td>
                <td>{sup.rtn || "-"}</td>
                <td>{sup.telefono || "-"}</td>
                <td>{sup.direccion || "-"}</td>
                <td>{sup.limiteCredito}</td>
                <td>{sup.saldoActual}</td>
                <td>{sup.fechaRegistro?.split("T")[0] || "-"}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(sup)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(sup.idProveedor)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

      {/* Modal ----------------------------- */}
      {showModal && (
        <div className="modal show fade d-block" style={{ background: "#00000088" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-3">

              <h4 className="mb-3">
                {formData.idProveedor === 0 ? "Nuevo Proveedor" : "Editar Proveedor"}
              </h4>

              <form onSubmit={handleSubmit}>

                <div className="row">

                  <div className="col-md-6 mb-2">
                    <label>Nombre</label>
                    <input
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label>RTN</label>
                    <input
                      className="form-control"
                      name="rtn"
                      value={formData.rtn}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label>Teléfono</label>
                    <input
                      className="form-control"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label>Dirección</label>
                    <input
                      className="form-control"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label>Límite Crédito</label>
                    <input
                      type="number"
                      className="form-control"
                      name="limiteCredito"
                      value={formData.limiteCredito}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label>Saldo Actual</label>
                    <input
                      type="number"
                      className="form-control"
                      name="saldoActual"
                      value={formData.saldoActual}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label>Fecha Registro</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fechaRegistro"
                      value={formData.fechaRegistro}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="mt-3 d-flex justify-content-end">
                  <button className="btn btn-success me-2" type="submit">
                    Guardar
                  </button>
                  <button
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
};

export default Suppliers;
