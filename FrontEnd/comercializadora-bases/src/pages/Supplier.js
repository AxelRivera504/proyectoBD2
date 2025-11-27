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
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/Suppliers/supplier_service";

export default function Suppliers() {
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

  // 🚀 Cargar proveedores
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

  // Crear proveedor
  const openNewModal = () => {
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
    setShowModal(true);
  };

  // Editar proveedor
  const openEditModal = (sup) => {
    setFormData({
      ...sup,
      fechaRegistro: sup.fechaRegistro ? sup.fechaRegistro.split("T")[0] : "",
    });
    setShowModal(true);
  };

  // Guardar proveedor
  const saveSupplier = async () => {
    try {
      const isEdit = formData.idProveedor > 0;

      const payload = {
        ...formData,
        fechaRegistro:
          formData.fechaRegistro && formData.fechaRegistro !== ""
            ? new Date(formData.fechaRegistro).toISOString().split("T")[0]
            : null,
      };

      const resp = isEdit
        ? await updateSupplier(payload)
        : await addSupplier(payload);

      Swal.fire("Éxito", resp.data.data || "Guardado correctamente", "success");

      setShowModal(false);
      loadSuppliers();
    } catch (err) {
      Swal.fire("Error", "Error al guardar el proveedor", "error");
    }
  };

  // Eliminar proveedor
  const handleDelete = async (idProveedor) => {
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
      const resp = await deleteSupplier(idProveedor);
      Swal.fire("Eliminado", resp.data.data || "Proveedor eliminado", "success");
      loadSuppliers();
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Proveedores</h2>

      <button className="btn btn-primary mb-3" onClick={openNewModal}>
        + Nuevo Proveedor
      </button>

      {/* 📌 DevExtreme DataGrid */}
      <DataGrid
        dataSource={suppliers}
        keyExpr="idProveedor"
        showBorders={true}
        columnAutoWidth={true}
        height={550}
      >
        <SearchPanel visible={true} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <ColumnChooser enabled={true} />

        <Paging defaultPageSize={10} />

        <Column dataField="idProveedor" caption="ID" width={60} />
        <Column dataField="nombre" caption="Nombre" />
        <Column dataField="rtn" caption="RTN" />
        <Column dataField="telefono" caption="Teléfono" />
        <Column dataField="direccion" caption="Dirección" />
        <Column dataField="limiteCredito" caption="Límite Crédito" />
        <Column dataField="saldoActual" caption="Saldo Actual" />

        <Column
          dataField="fechaRegistro"
          caption="Registro"
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
                onClick={() => handleDelete(e.data.idProveedor)}
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
        title={formData.idProveedor === 0 ? "Nuevo Proveedor" : "Editar Proveedor"}
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

          <Item dataField="rtn">
            <Label text="RTN" />
          </Item>

          <Item dataField="telefono">
            <Label text="Teléfono" />
          </Item>

          <Item dataField="direccion">
            <Label text="Dirección" />
          </Item>

          <Item dataField="limiteCredito" editorType="dxNumberBox">
            <Label text="Límite Crédito" />
          </Item>

          <Item dataField="saldoActual" editorType="dxNumberBox">
            <Label text="Saldo Actual" />
          </Item>

          <Item
            dataField="fechaRegistro"
            editorType="dxDateBox"
            editorOptions={{
              type: "date",
              displayFormat: "yyyy-MM-dd",
              value: formData.fechaRegistro || null,
            }}
          >
            <Label text="Fecha Registro" />
          </Item>
        </Form>

        <div className="text-end mt-3">
          <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={saveSupplier}>
            Guardar
          </button>
        </div>
      </Popup>
    </div>
  );
}
