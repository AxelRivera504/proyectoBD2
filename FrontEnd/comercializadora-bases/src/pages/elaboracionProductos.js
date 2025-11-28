import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import SelectBox from "devextreme-react/select-box";
import DataGrid, { Column } from "devextreme-react/data-grid";

import {
  getProductosFinales,
  getInsumos,
  elaborarProducto,
} from "../services/creationProduct/creation_product_service";

export default function ElaboracionProductos() {
  const [productosFinales, setProductosFinales] = useState([]);
  const [insumos, setInsumos] = useState([]);

  const [idProductoFinal, setIdProductoFinal] = useState(null);
  const [cantidadFinal, setCantidadFinal] = useState("");

  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [cantidadInsumo, setCantidadInsumo] = useState("");

  const [listaInsumos, setListaInsumos] = useState([]);

  // ================= Cargar datos =================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const pf = await getProductosFinales();
    const ins = await getInsumos();

    if (pf.data.ok) setProductosFinales(pf.data.data);
    if (ins.data.ok) setInsumos(ins.data.data);
  };

  // ================ Agregar insumo =================
  const agregarInsumo = () => {
    if (!insumoSeleccionado || !cantidadInsumo) {
      return Swal.fire("Error", "Completar insumo y cantidad", "warning");
    }

    const ins = insumos.find(i => i.idProducto === insumoSeleccionado);

    const existente = listaInsumos.find(i => i.idProductoInsumo === insumoSeleccionado);

    if (existente) {
      existente.cantidadUsada += Number(cantidadInsumo);
      setListaInsumos([...listaInsumos]);
    } else {
      setListaInsumos([
        ...listaInsumos,
        {
          idProductoInsumo: ins.idProducto,
          nombre: ins.nombre,
          cantidadUsada: Number(cantidadInsumo),
        },
      ]);
    }

    setInsumoSeleccionado(null);
    setCantidadInsumo("");
  };

  const eliminarInsumo = (id) => {
    setListaInsumos(listaInsumos.filter(x => x.idProductoInsumo !== id));
  };

  // ================ Guardar Elaboración ================
  const guardarElaboracion = async () => {
    if (!idProductoFinal) return Swal.fire("Error", "Selecciona un producto final", "warning");
    if (!cantidadFinal) return Swal.fire("Error", "Ingresa la cantidad elaborada", "warning");
    if (listaInsumos.length === 0) return Swal.fire("Error", "Agrega al menos un insumo", "warning");

    const payload = {
      idProductoFinal,
      cantidadElaborada: Number(cantidadFinal),
      insumos: listaInsumos,
    };

    const res = await elaborarProducto(payload);

    if (res.data.ok) {
      Swal.fire("Éxito", "Elaboración registrada exitosamente", "success");
      setIdProductoFinal(null);
      setCantidadFinal("");
      setListaInsumos([]);
    } else {
      Swal.fire("Error", res.data.mensaje, "error");
    }
  };

  // =============== Render ===================
  return (
    <div className="container mt-4">
      <h2>Elaboración de Productos</h2>
      <hr />

      {/* PRODUCTO FINAL */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label>Producto final</label>
          <SelectBox
            items={productosFinales}
            displayExpr="nombre"
            valueExpr="idProducto"
            value={idProductoFinal}
            onValueChange={setIdProductoFinal}
            searchEnabled
            placeholder="Seleccione"
          />
        </div>

        <div className="col-md-3">
          <label>Cantidad elaborada</label>
          <input
            type="number"
            className="form-control"
            value={cantidadFinal}
            onChange={(e) => setCantidadFinal(e.target.value)}
          />
        </div>
      </div>

      <hr />

      {/* INSUMOS */}
      <h4>Insumos utilizados</h4>

      <div className="row mt-3">
        <div className="col-md-5">
          <label>Insumo</label>
          <SelectBox
            items={insumos}
            displayExpr="nombre"
            valueExpr="idProducto"
            value={insumoSeleccionado}
            onValueChange={setInsumoSeleccionado}
            searchEnabled
            placeholder="Seleccione insumo"
          />
        </div>

        <div className="col-md-3">
          <label>Cantidad</label>
          <input
            type="number"
            className="form-control"
            value={cantidadInsumo}
            onChange={(e) => setCantidadInsumo(e.target.value)}
          />
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-secondary w-100" onClick={agregarInsumo}>
            + Agregar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <DataGrid
        dataSource={listaInsumos}
        keyExpr="idProductoInsumo"
        className="mt-4"
        showBorders
      >
        <Column dataField="nombre" caption="Insumo" />
        <Column dataField="cantidadUsada" caption="Cantidad" width={120} />
        <Column
          caption="Quitar"
          width={100}
          cellRender={(e) => (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => eliminarInsumo(e.data.idProductoInsumo)}
            >
              X
            </button>
          )}
        />
      </DataGrid>

      <div className="text-end mt-4">
        <button className="btn btn-success" onClick={guardarElaboracion}>
          Guardar Elaboración
        </button>
      </div>
    </div>
  );
}
