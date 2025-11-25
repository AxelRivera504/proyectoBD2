import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/products/product_service";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    idProducto: 0,
    nombre: "",
    descripcion: "",
    precioCosto: "",
    precioVenta: "",
    existencia: "",
    minimo: "",
    fechaVencimiento: "",
    tipo: "",
  });

  const resetForm = () => {
    setFormData({
      idProducto: 0,
      nombre: "",
      descripcion: "",
      precioCosto: "",
      precioVenta: "",
      existencia: "",
      minimo: "",
      fechaVencimiento: "",
      tipo: "",
    });
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.idProducto === 0) {
        await addProduct(formData);
        Swal.fire({
          icon: "success",
          title: "Producto agregado",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await updateProduct(formData);
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setShowModal(false);
      loadProducts();
    } catch (err) {
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  const handleEdit = (prod) => {
    setFormData({
      idProducto: prod.idProducto,
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precioCosto: prod.precioCosto,
      precioVenta: prod.precioVenta,
      existencia: prod.existencia,
      minimo: prod.minimo,
      fechaVencimiento: prod.fechaVencimiento || "",
      tipo: prod.tipo,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteProduct(id);
        Swal.fire({
          icon: "success",
          title: "Eliminado correctamente",
          toast: true,
          position: "top-end",
          timer: 1800,
          showConfirmButton: false,
        });
        loadProducts();
      }
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Gestión de Productos</h2>

      <button className="btn btn-primary mb-3" onClick={openNewModal}>
        + Nuevo Producto
      </button>

      {/* Tabla ----------------------------- */}
      <table className="table table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Costo</th>
            <th>Venta</th>
            <th>Stock</th>
            <th>Mínimo</th>
            <th>Tipo</th>
            <th>Expira</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="10">No hay productos</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.idProducto}>
                <td>{p.idProducto}</td>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>{p.precioCosto}</td>
                <td>{p.precioVenta}</td>
                <td>{p.existencia}</td>
                <td>{p.minimo}</td>
                <td>{p.tipo}</td>
                <td>{p.fechaVencimiento || "-"}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.idProducto)}
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
        <div className="modal show fade d-block">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-3">

              <h4 className="mb-3">
                {formData.idProducto === 0 ? "Nuevo Producto" : "Editar Producto"}
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
                    <label>Descripción</label>
                    <input
                      className="form-control"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Costo</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precioCosto"
                      value={formData.precioCosto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Venta</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precioVenta"
                      value={formData.precioVenta}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Existencia</label>
                    <input
                      type="number"
                      className="form-control"
                      name="existencia"
                      value={formData.existencia}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Mínimo</label>
                    <input
                      type="number"
                      className="form-control"
                      name="minimo"
                      value={formData.minimo}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Tipo</label>
                    <select
                      name="tipo"
                      className="form-control"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione</option>
                      <option value="Producto">Producto</option>
                      <option value="MateriaPrima">Materia Prima</option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Fecha de vencimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fechaVencimiento"
                      value={formData.fechaVencimiento}
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

export default Products;