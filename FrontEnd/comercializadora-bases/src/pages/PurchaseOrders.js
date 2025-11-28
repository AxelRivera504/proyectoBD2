import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TabPanel, Item } from "devextreme-react/tab-panel";

import DataGrid, {
  Column,
  Paging,
  SearchPanel,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
  MasterDetail,
} from "devextreme-react/data-grid";

import Popup from "devextreme-react/popup";
import SelectBox from "devextreme-react/select-box";

import { getPurchaseOrders, createPurchaseOrder } from "../services/PurchaseOrder/purcharse_order_service";
import { getAllSuppliers } from "../services/Suppliers/supplier_service";
import { getAllProducts } from "../services/products/product_service";
import { receivePurchaseOrder } from "../services/PurchaseOrder/receive_purchase_order_service";


export default function PurchaseOrders() {
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [idProveedor, setIdProveedor] = useState("");
  const [detalles, setDetalles] = useState([]);

  const [productoId, setProductoId] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
   // Tabs
  const [selectedTab, setSelectedTab] = useState(0);

  // ----------------------------------------------------------------
  // CARGA INICIAL
  // ----------------------------------------------------------------

  const loadOrdenes = async () => {
    try {
      const res = await getPurchaseOrders();
      if (res.data.ok) setOrdenes(res.data.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las órdenes", "error");
    }
  };

  const loadProveedores = async () => {
    try {
      const res = await getAllSuppliers();
      if (res.ok) setProveedores(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
    }
  };

  const loadProductos = async () => {
    try {
      const res = await getAllProducts();
      setProductos(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    loadOrdenes();
    loadProveedores();
    loadProductos();
  }, []);

  // ----------------------------------------------------------------
  // AGREGAR DETALLE A TABLA
  // ----------------------------------------------------------------

  const handleSelectProducto = (id) => {
    setProductoId(id);
    const prod = productos.find((p) => p.idProducto === id);
    if (prod) setPrecioUnitario(prod.precioCosto || prod.precioVenta);
  };

  const agregarDetalle = () => {
    if (!productoId || !cantidad || !precioUnitario)
      return Swal.fire("Error", "Complete todos los datos del producto", "warning");

    const prod = productos.find((p) => p.idProducto === productoId);

    if (!prod) return;

    const existente = detalles.find((d) => d.idProducto === productoId);

    if (existente) {
      existente.cantidadSolicitada += Number(cantidad);
      existente.precioUnitario = Number(precioUnitario);
      setDetalles([...detalles]);
    } else {
      setDetalles([
        ...detalles,
        {
          idProducto: productoId,
          nombre: prod.nombre,
          cantidadSolicitada: Number(cantidad),
          precioUnitario: Number(precioUnitario),
        },
      ]);
    }

    setProductoId(null);
    setCantidad("");
    setPrecioUnitario("");
  };

  const eliminarDetalle = (id) => {
    setDetalles(detalles.filter((d) => d.idProducto !== id));
  };

  const totalOrden = detalles.reduce(
    (acc, d) => acc + d.cantidadSolicitada * d.precioUnitario,
    0
  );

  // ----------------------------------------------------------------
  // GUARDAR ORDEN DE COMPRA
  // ----------------------------------------------------------------

  const handleGuardar = async () => {
    if (!idProveedor)
      return Swal.fire("Validación", "Selecciona un proveedor", "warning");

    if (detalles.length === 0)
      return Swal.fire("Validación", "Agrega productos a la orden", "warning");

    const payload = {
      idProveedor: Number(idProveedor),
      detalles: detalles.map((d) => ({
        idProducto: d.idProducto,
        cantidadSolicitada: d.cantidadSolicitada,
        precioUnitario: d.precioUnitario,
      })),
    };

    try {
      const res = await createPurchaseOrder(payload);

      if (res.data.ok) {
        Swal.fire("Éxito", res.data.mensaje, "success");
        setShowModal(false);
        setIdProveedor("");
        setDetalles([]);
        loadOrdenes();
      } else {
        Swal.fire("Error", res.data.mensaje, "error");
      }
    } catch {
      Swal.fire("Error", "No se pudo registrar la orden de compra", "error");
    }
  };

  // ----------------------------------------------------------------
  // Badges de Estado
  // ----------------------------------------------------------------

  const EstadoBadge = ({ estado }) => {
    const color =
      estado === "Pendiente" ? "badge bg-warning text-dark" :
      estado === "Completado" ? "badge bg-success" :
      "badge bg-secondary";

    return <span className={color}>{estado}</span>;
  };

  const handleRecibirOrden = async (idOrdenCompra) => {

  const confirm = await Swal.fire({
    title: "¿Recibir Orden?",
    text: "Esto registrará la recepción e ingresará los productos al inventario",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, recibir",
    cancelButtonText: "Cancelar"
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await receivePurchaseOrder(idOrdenCompra);
    debugger;
    if (res.data.ok) {
      Swal.fire("Éxito", res.data.data, "success");
      loadOrdenes(); // recargar lista
    } else {
      Swal.fire("Error", res.data.data, "error");
    }

  } catch (err) {
    Swal.fire("Error", "No se pudo recibir la orden", "error");
  }
};

  // ----------------------------------------------------------------
  // MASTER DETAIL TEMPLATE
  // ----------------------------------------------------------------

  const renderDetail = (detail) => {
    const compras = detail.data.data;
    const rows = compras.detalles || [];

    if (!rows.length) {
      return (
        <div className="p-3">
          <strong>Orden compra #{compras.idOrdenCompra}</strong>
          <div className="text-muted mt-2">Esta orden de compra no tiene detalles.</div>
        </div>
      );
    }

    return (
    <div className="p-3">
      <h5>Detalles de la Orden #{compras.idOrdenCompra}</h5>

      <DataGrid
        dataSource={rows}
        columnAutoWidth={true}
        showBorders={true}
        rowAlternationEnabled={true}
        height={250}
      >
        <Column dataField="idProducto" caption="ID" width={80} />
        <Column dataField="nombreProducto" caption="Producto" />
        <Column dataField="cantidadSolicitada" caption="Cantidad" width={120} />
        <Column dataField="precioUnitario" caption="Precio" width={120} />
        <Column
          caption="Subtotal"
          width={130}
          calculateCellValue={(row) =>
            row.cantidadSolicitada * row.precioUnitario
          }
        />
      </DataGrid>
    </div>
    );
  };

  // ----------------------------------------------------------------
  // RENDER FINAL
  // ----------------------------------------------------------------

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Órdenes de Compra</h2>

      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        + Nueva Orden de Compra
      </button>

      {/* TABLA MAESTRA */}
      <DataGrid
        dataSource={ordenes}
        keyExpr="idOrdenCompra"
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        height={600}
      >
        <SearchPanel visible={true} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Paging defaultPageSize={10} />
        <ColumnChooser enabled={true} />

        <MasterDetail enabled={true} component={renderDetail} />

        <Column dataField="idOrdenCompra" caption="ID" width={80} />
        <Column dataField="nombreProveedor" caption="Proveedor" />
        <Column
          dataField="fecha"
          caption="Fecha"
          width={120}
          customizeText={(e) => e.value?.split("T")[0] || "-"}
        />
        <Column dataField="total" caption="Total L." width={120} />

        <Column
          caption="Acciones"
          width={150}
          cellRender={(e) => {

            const orden = e.data;

            if (orden.estado !== "Pendiente") {
              return <span className="badge bg-success">Recibida</span>;
            }

            return (
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleRecibirOrden(orden.idOrdenCompra)}
              >
                Recibir
              </button>
            );
          }}
        />

      </DataGrid>

      {/* POPUP CREAR ORDEN */}
      <Popup
        visible={showModal}
        width={900}
        height={650}
        onHiding={() => setShowModal(false)}
        title="Nueva Orden de Compra"
      >
        <div className="p-3">

          {/* ================================
              TABS
          ================================= */}
          <TabPanel
            selectedIndex={selectedTab}
            onSelectionChanged={(e) => {
              const nextIndex = e.component.option("selectedIndex");

              if (nextIndex === 1 && !idProveedor) {
                Swal.fire(
                  "Proveedor requerido",
                  "Seleccione un proveedor antes de continuar.",
                  "warning"
                );
                setSelectedTab(0);
              } else {
                setSelectedTab(nextIndex);
              }
            }}
          >
            {/* =====================================================
                TAB 1 → ENCABEZADO
            ======================================================= */}
            <Item title="Encabezado">
              <div className="p-2">

                <label className="fw-bold">Proveedor</label>
                <SelectBox
                  items={proveedores}
                  value={idProveedor}
                  displayExpr="nombre"
                  valueExpr="idProveedor"
                  searchEnabled={true}
                  placeholder="Seleccione proveedor"
                  onValueChange={setIdProveedor}
                  disabled={idProveedor !== ""}  // bloquear tras seleccionar
                />

                {idProveedor !== "" && (
                  <button
                    className="btn btn-warning mt-3"
                    onClick={() => setIdProveedor("")}
                  >
                    Cambiar proveedor
                  </button>
                )}

                <div className="alert alert-info mt-4">
                  Seleccione el proveedor y luego pase a la pestaña “Detalles”.
                </div>
              </div>
            </Item>

            {/* =====================================================
                TAB 2 → DETALLES
            ======================================================= */}
            <Item title="Detalles">
              <div className="p-2">

                {/* -----------------------------
                    FORM AGREGAR PRODUCTO
                ------------------------------ */}
                <div className="row mb-3">

                  <div className="col-md-4">
                    <label>Producto</label>
                    <SelectBox
                      items={productos}
                      displayExpr="nombre"
                      valueExpr="idProducto"
                      value={productoId}
                      searchEnabled={true}
                      placeholder="Seleccione producto"
                      onValueChange={handleSelectProducto}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Cantidad</label>
                    <input
                      type="number"
                      className="form-control"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Precio Unitario</label>
                    <input
                      type="number"
                      className="form-control"
                      value={precioUnitario}
                      onChange={(e) => setPrecioUnitario(Number(e.target.value))}
                    />
                  </div>

                  <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-secondary w-100" onClick={agregarDetalle}>
                      + Agregar
                    </button>
                  </div>

                </div>

                {/* -----------------------------
                    TABLA DE DETALLES
                ------------------------------ */}
                <DataGrid
                  dataSource={detalles}
                  keyExpr="idProducto"
                  showBorders={true}
                  rowAlternationEnabled={true}
                  columnAutoWidth={true}
                  height={260}
                >
                  <Column dataField="nombre" caption="Producto" />
                  <Column dataField="cantidadSolicitada" caption="Cantidad" width={120} />
                  <Column dataField="precioUnitario" caption="Precio" width={120} />

                  <Column
                    caption="Subtotal"
                    width={120}
                    calculateCellValue={(row) =>
                      row.cantidadSolicitada * row.precioUnitario
                    }
                  />

                  <Column
                    caption="Quitar"
                    width={100}
                    cellRender={(e) => (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarDetalle(e.data.idProducto)}
                      >
                        X
                      </button>
                    )}
                  />
                </DataGrid>

                <div className="text-end mt-3 fw-bold fs-5">
                  Total: L. {totalOrden}
                </div>

                {/* -----------------------------
                    BOTÓN GUARDAR
                ------------------------------ */}
                <div className="text-end mt-3">
                  <button className="btn btn-success me-2" onClick={handleGuardar}>
                    Guardar Orden de Compra
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </div>

              </div>
            </Item>
          </TabPanel>

        </div>
      </Popup>

    </div>
  );
}
