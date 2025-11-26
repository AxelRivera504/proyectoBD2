import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClients,
  addClient,
  updateClient,
  deleteClient,
} from "../services/clients/client_service";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    idCliente: 0,
    nombre: "",
    direccion: "",
    telefono: "",
    tipo: "",
    fechaRegistro: "",
  });

  // Cargar todos los clientes
  const loadClients = async () => {
    try {
      const response = await getClients();

      if (response.data.ok) {
        setClients(response.data.data);
      } else {
        Swal.fire("Error", response.data.mensaje, "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // Abrir modal en modo creación
  const openCreateModal = () => {
    setFormData({
      idCliente: 0,
      nombre: "",
      direccion: "",
      telefono: "",
      tipo: "",
      fechaRegistro: "",
    });
    setShowModal(true);
  };

  // Abrir modal en modo edición
  const openEditModal = (client) => {
    setFormData(client);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const saveClient = async (e) => {
    e.preventDefault();
    const isEdit = formData.idCliente > 0;

    try {
      let response = isEdit
        ? await updateClient(formData)
        : await addClient(formData);

      if (response.data.ok) {
        Swal.fire(
          "Éxito",
          response.data.data,
          "success"
        );
        closeModal();
        loadClients();
      } else {
        Swal.fire("Error", response.data.mensaje, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al guardar el cliente", "error");
    }
  };

  const handleDelete = async (client) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await deleteClient(client);

      if (response.data.ok) {
        Swal.fire("Eliminado", response.data.data, "success");
        loadClients();
      } else {
        Swal.fire("Error", response.data.mensaje, "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el cliente", "error");
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Gestión de Clientes</h2>

      <button className="btn btn-primary mb-3" onClick={openCreateModal}>
        + Nuevo Cliente
      </button>

      {/* Tabla */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Tipo</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => (
            <tr key={c.idCliente}>
              <td>{c.idCliente}</td>
              <td>{c.nombre}</td>
              <td>{c.direccion}</td>
              <td>{c.telefono}</td>
              <td>{c.tipo}</td>
              <td>{c.fechaRegistro?.split("T")[0]}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => openEditModal(c)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(c)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "#00000090" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">

              <h4 className="mb-3">
                {formData.idCliente > 0 ? "Editar Cliente" : "Nuevo Cliente"}
              </h4>

              <form onSubmit={saveClient}>
                
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label>Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      name="telefono"
                      value={formData.telefono || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label>Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    name="direccion"
                    value={formData.direccion || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label>Tipo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tipo"
                      value={formData.tipo || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label>Fecha Registro</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fechaRegistro"
                      value={formData.fechaRegistro?.split("T")[0] || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-3 text-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="btn btn-success">
                    Guardar
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

export default Clients;
