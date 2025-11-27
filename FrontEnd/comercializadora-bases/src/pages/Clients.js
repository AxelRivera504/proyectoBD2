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
  getClients,
  addClient,
  updateClient,
  deleteClient,
} from "../services/clients/client_service";

export default function Clients() {
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

  // 🚀 Cargar clientes
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

  // 🟢 Nuevo cliente
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

  // 🟡 Editar cliente
  const openEditModal = (client) => {
    setFormData({
      ...client,
      fechaRegistro: client.fechaRegistro
        ? client.fechaRegistro.split("T")[0]
        : "",
    });
    setShowModal(true);
  };

  // 🔴 Eliminar cliente
  const handleDelete = async (client) => {
    Swal.fire({
      title: "¿Eliminar cliente?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        const response = await deleteClient(client);
        if (response.data.ok) {
          Swal.fire("Eliminado", response.data.data, "success");
          loadClients();
        } else {
          Swal.fire("Error", response.data.mensaje, "error");
        }
      } catch {
        Swal.fire("Error", "No se pudo eliminar el cliente", "error");
      }
    });
  };

  // 💾 Guardar cliente (crear o editar)
  const saveClient = async () => {
    try {
      const isEdit = formData.idCliente > 0;

      const response = isEdit
        ? await updateClient(formData)
        : await addClient(formData);

      if (response.data.ok) {
        Swal.fire("Éxito", response.data.data, "success");
        setShowModal(false);
        loadClients();
      } else {
        Swal.fire("Error", response.data.mensaje, "error");
      }
    } catch {
      Swal.fire("Error", "No se pudo guardar el cliente", "error");
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Gestión de Clientes</h2>

      <button className="btn btn-primary mb-3" onClick={openCreateModal}>
        + Nuevo Cliente
      </button>

      {/* 📌 Tabla DevExtreme */}
      <DataGrid
        dataSource={clients}
        keyExpr="idCliente"
        showBorders={true}
        columnAutoWidth={true}
        height={550}
      >
        <SearchPanel visible={true} highlightCaseSensitive={true} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <ColumnChooser enabled={true} />

        <Paging defaultPageSize={10} />

        <Column dataField="idCliente" caption="ID" width={60} />
        <Column dataField="nombre" caption="Nombre" />
        <Column dataField="direccion" caption="Dirección" />
        <Column dataField="telefono" caption="Teléfono" width={120} />
        <Column dataField="tipo" caption="Tipo" width={120} />
        <Column
          dataField="fechaRegistro"
          caption="Fecha"
          customizeText={(e) =>
            e.value ? e.value.split("T")[0] : "-"
          }
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
                onClick={() => handleDelete(e.data)}
              >
                Eliminar
              </button>
            </>
          )}
        />
      </DataGrid>

      {/* 📌 Popup para agregar/editar */}
      <Popup
        visible={showModal}
        onHiding={() => setShowModal(false)}
        dragEnabled={false}
        closeOnOutsideClick={true}
        showTitle={true}
        title={formData.idCliente > 0 ? "Editar Cliente" : "Nuevo Cliente"}
        width={600}
        height="auto"
      >
        <Form formData={formData} onFieldDataChanged={(e) => setFormData({ ...formData, [e.dataField]: e.value })}>
          <Item dataField="nombre">
            <Label text="Nombre" />
          </Item>

          <Item dataField="telefono">
            <Label text="Teléfono" />
          </Item>

          <Item dataField="direccion">
            <Label text="Dirección" />
          </Item>

          <Item dataField="tipo">
            <Label text="Tipo" />
          </Item>

          <Item dataField="fechaRegistro" editorType="dxDateBox">
            <Label text="Fecha Registro" />
          </Item>

        </Form>

        <div className="text-end mt-3">
          <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={saveClient}>
            Guardar
          </button>
        </div>
      </Popup>
    </div>
  );
}
