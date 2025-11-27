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

import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/products/product_service";

export default function Products() {
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

  // 🚀 Cargar productos
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

  // Crear
  const openNewModal = () => {
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
    setShowModal(true);
  };

  // Editar
  const openEditModal = (p) => {
    setFormData({
      ...p,
      fechaVencimiento: p.fechaVencimiento ? p.fechaVencimiento.split("T")[0] : "",
    });
    setShowModal(true);
  };

  // Guardar
  const saveProduct = async () => {
  try {
    const isEdit = formData.idProducto > 0;

    const payload = {
      ...formData,
      fechaVencimiento: formData.fechaVencimiento
        ? new Date(formData.fechaVencimiento).toISOString().split("T")[0]
        : null,
    };

    const resp = isEdit
      ? await updateProduct(payload)
      : await addProduct(payload);

      Swal.fire("Éxito", resp.data.data || "Guardado correctamente", "success");

      setShowModal(false);
      loadProducts();

    } catch (err) {
      Swal.fire("Error", "Error al guardar el producto", "error");
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const resp = await deleteProduct(id);
      Swal.fire("Eliminado", resp.data.data || "Producto eliminado", "success");
      loadProducts();
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Gestión de Productos</h2>

      <button className="btn btn-primary mb-3" onClick={openNewModal}>
        + Nuevo Producto
      </button>

      {/* 📌 DevExtreme DataGrid */}
      <DataGrid
        dataSource={products}
        keyExpr="idProducto"
        showBorders={true}
        columnAutoWidth={true}
        height={550}
      >
        <SearchPanel visible={true} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <ColumnChooser enabled={true} />

        <Paging defaultPageSize={10} />

        <Column dataField="idProducto" caption="ID" width={60} />
        <Column dataField="nombre" caption="Nombre" />
        <Column dataField="descripcion" caption="Descripción" />
        <Column dataField="precioCosto" caption="Costo" />
        <Column dataField="precioVenta" caption="Venta" />
        <Column dataField="existencia" caption="Stock" />
        <Column dataField="minimo" caption="Mínimo" />
        <Column dataField="tipo" caption="Tipo" />

        <Column
          dataField="fechaVencimiento"
          caption="Vencimiento"
          customizeText={(e) => (e.value ? e.value.split("T")[0] : "-")}
        />

        <Column
          caption="Acciones"
          width={180}
          cellRender={(e) => (
            <>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => openEditModal(e.data)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(e.data.idProducto)}
              >
                Eliminar
              </button>
            </>
          )}
        />
      </DataGrid>

      {/* 📌 Popup DevExtreme */}
      <Popup
        visible={showModal}
        onHiding={() => setShowModal(false)}
        closeOnOutsideClick={true}
        dragEnabled={false}
        width={650}
        height="auto"
        title={formData.idProducto === 0 ? "Nuevo Producto" : "Editar Producto"}
      >
        <Form
          formData={formData}
          onFieldDataChanged={(e) =>
            setFormData({ ...formData, [e.dataField]: e.value })
          }
        >
          <Item dataField="nombre">
            <Label text="Nombre" />
          </Item>

          <Item dataField="descripcion">
            <Label text="Descripción" />
          </Item>

          <Item dataField="precioCosto" editorType="dxNumberBox">
            <Label text="Costo" />
          </Item>

          <Item dataField="precioVenta" editorType="dxNumberBox">
            <Label text="Venta" />
          </Item>

          <Item dataField="existencia" editorType="dxNumberBox">
            <Label text="Existencia" />
          </Item>

          <Item dataField="minimo" editorType="dxNumberBox">
            <Label text="Mínimo" />
          </Item>

          <Item dataField="tipo" editorType="dxSelectBox"
            editorOptions={{
              items: ["Producto", "MateriaPrima"],
              searchEnabled: true,
            }}
          >
            <Label text="Tipo" />
          </Item>

          <Item dataField="fechaVencimiento" editorType="dxDateBox">
            <Label text="Fecha de vencimiento" />
          </Item>

        </Form>

        <div className="text-end mt-3">
          <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={saveProduct}>
            Guardar
          </button>
        </div>
      </Popup>
    </div>
  );
}
