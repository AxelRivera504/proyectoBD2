import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import DataGrid, {
  Column,
  Paging,
  FilterRow,
  SearchPanel,
  HeaderFilter,
  Selection
} from "devextreme-react/data-grid";

import Popup from "devextreme-react/popup";

import {
  getPendingInvoices,
  paySingleInvoice,
  payMultipleInvoices
} from "../services/payments/suppliers/supplier_payment_service";


export default function SupplierPayments() {
  const [facturas, setFacturas] = useState([]);

  // MODAL INDIVIDUAL
  const [showModalIndividual, setShowModalIndividual] = useState(false);
  const [facturaActual, setFacturaActual] = useState(null);
  const [montoPago, setMontoPago] = useState(0);
  const [tipoPagoIndividual, setTipoPagoIndividual] = useState("Efectivo");

  // MULTIPLE PAYMENT
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [showModalMultiple, setShowModalMultiple] = useState(false);
  const [montosMultiples, setMontosMultiples] = useState({});
  const [tipoPagoMultiple, setTipoPagoMultiple] = useState("Efectivo");

  // TIPOS DE PAGO
  const tiposPago = [
    { id: "Efectivo", nombre: "Efectivo" },
    { id: "Transferencia", nombre: "Transferencia" },
    { id: "Tarjeta", nombre: "Tarjeta" },
    { id: "Deposito", nombre: "Depósito" },
    { id: "Cheque", nombre: "Cheque" }
  ];

  // =======================================================
  // CARGAR FACTURAS
  // =======================================================
  const loadFacturas = async () => {
    try {
      const res = await getPendingInvoices();
      if (res.data.ok) {
        setFacturas(res.data.data);
      }
    } catch {
      Swal.fire("Error", "No se pudieron cargar las facturas del proveedor", "error");
    }
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  // =======================================================
  // ABRIR MODAL INDIVIDUAL
  // =======================================================
  const abrirModalIndividual = (factura) => {
    setFacturaActual(factura);
    setMontoPago(factura.saldo);
    setShowModalIndividual(true);
  };

  const confirmarPagoIndividual = async () => {
    if (montoPago <= 0 || montoPago > facturaActual.saldo) {
      return Swal.fire("Monto inválido", "El monto excede el saldo pendiente", "warning");
    }

    const payload = {
      idFactura: facturaActual.idFactura,
      montoPagado: montoPago,
      tipoPago: tipoPagoIndividual
    };

    try {
      const res = await paySingleInvoice(payload);

      if (res.data.ok) {
        Swal.fire("Éxito", res.data.data, "success");
        setShowModalIndividual(false);
        loadFacturas();
      } else {
        Swal.fire("Error", res.data.data, "error");
      }
    } catch {
      Swal.fire("Error", "Falló el pago de la factura", "error");
    }
  };

  // =======================================================
  // MULTIPLE PAYMENT HANDLING
  // =======================================================
  const abrirModalMultiple = () => {
    if (seleccionadas.length === 0) {
      return Swal.fire("Selecciona facturas", "No has seleccionado ninguna factura", "warning");
    }
    setShowModalMultiple(true);
  };

  const actualizarMontoMultiple = (idFactura, valor) => {
    setMontosMultiples({
      ...montosMultiples,
      [idFactura]: valor
    });
  };

  const totalPagoMultiple = Object.values(montosMultiples).reduce(
    (acc, v) => acc + (Number(v) || 0),
    0
  );

  const guardarPagoMultiple = async () => {
    // Validación total
    for (let f of seleccionadas) {
      const monto = Number(montosMultiples[f.idFactura] || 0);
      if (monto <= 0) {
        return Swal.fire(
          "Monto inválido",
          `Factura ${f.idFactura} tiene monto inválido`,
          "warning"
        );
      }
      if (monto > f.saldo) {
        return Swal.fire(
          "Monto excedido",
          `Factura ${f.idFactura} supera el saldo disponible`,
          "warning"
        );
      }
    }

    // Convertir a cadena: "20310|5000;20311|3300"
    let cadena = seleccionadas
      .map(
        (f) => `${f.idFactura}|${montosMultiples[f.idFactura] || 0}`
      )
      .join(";");

    const payload = {
      idProveedor: seleccionadas[0].idProveedor,
      facturasCadena: cadena,
      tipoPago: tipoPagoMultiple,
      montoTotal: totalPagoMultiple
    };

    try {
      const res = await payMultipleInvoices(payload);

      if (res.data.ok) {
        Swal.fire("Éxito", res.data.data, "success");
        setShowModalMultiple(false);
        setMontosMultiples({});
        loadFacturas();
      } else {
        Swal.fire("Error", res.data.data, "error");
      }
    } catch {
      Swal.fire("Error", "Falló el pago múltiple", "error");
    }
  };

  // =======================================================
  // RENDER
  // =======================================================
  return (
    <div className="container mt-4">
      <h2>Pagos a Proveedores</h2>

      <button
        className="btn btn-success mb-3"
        onClick={abrirModalMultiple}
      >
        Pagar múltiples facturas
      </button>

      {/* TABLA PRINCIPAL */}
      <DataGrid
        dataSource={facturas}
        keyExpr="idFactura"
        showBorders={true}
        columnAutoWidth={true}
        height={550}
        onSelectionChanged={(e) => setSeleccionadas(e.selectedRowsData)}
      >
        <Selection mode="multiple" />
        <SearchPanel visible={true} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Paging defaultPageSize={12} />

        <Column dataField="idFactura" caption="Factura" width={100} />
        <Column dataField="nombreProveedor" caption="Proveedor" />
        <Column dataField="fecha" caption="Fecha" width={120} customizeText={(e) => e.value?.split("T")[0]} />
        <Column dataField="total" caption="Total L." width={120} />
        <Column dataField="saldo" caption="Saldo L." width={120} />
        <Column dataField="estado" caption="Estado" width={120} />

        <Column
          caption="Acciones"
          width={150}
          cellRender={(e) => (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => abrirModalIndividual(e.data)}
              disabled={e.data.estado === "Pagada"}
            >
              Pagar
            </button>
          )}
        />
      </DataGrid>

      {/* =======================================================
          MODAL INDIVIDUAL
      ======================================================= */}
      <Popup
        visible={showModalIndividual}
        width={450}
        height={380}
        title="Pago de factura"
        onHiding={() => setShowModalIndividual(false)}
      >
        <div className="p-3">
          <h5>
            Factura #{facturaActual?.idFactura} – Saldo:{" "}
            <strong>L. {facturaActual?.saldo}</strong>
          </h5>

          <label className="fw-bold mt-3">Tipo de pago</label>
          <select
            className="form-control"
            value={tipoPagoIndividual}
            onChange={(e) => setTipoPagoIndividual(e.target.value)}
          >
            {tiposPago.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>

          <label className="mt-3">Monto a pagar</label>
          <input
            type="number"
            className="form-control"
            value={montoPago}
            max={facturaActual?.saldo}
            onChange={(e) => setMontoPago(Number(e.target.value))}
          />

          <div className="text-end mt-4">
            <button className="btn btn-success me-2" onClick={confirmarPagoIndividual}>
              Pagar
            </button>
            <button className="btn btn-secondary" onClick={() => setShowModalIndividual(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </Popup>

      {/* =======================================================
          MODAL MULTIPLE
      ======================================================= */}
      <Popup
        visible={showModalMultiple}
        width={500}
        height={550}
        title="Pago múltiple"
        onHiding={() => setShowModalMultiple(false)}
      >
        <div className="p-3">
          <h5>Facturas seleccionadas: {seleccionadas.length}</h5>

          <label className="fw-bold mt-2">Tipo de Pago</label>
          <select
            className="form-control mb-3"
            value={tipoPagoMultiple}
            onChange={(e) => setTipoPagoMultiple(e.target.value)}
          >
            {tiposPago.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>

          {seleccionadas.map((f) => (
            <div key={f.idFactura} className="border rounded p-2 my-2">
              <strong>Factura #{f.idFactura}</strong>
              <div>Saldo: L. {f.saldo}</div>
              <input
                type="number"
                className="form-control mt-2"
                placeholder="Monto a pagar"
                value={montosMultiples[f.idFactura] || ""}
                max={f.saldo}
                onChange={(e) =>
                  actualizarMontoMultiple(f.idFactura, Number(e.target.value))
                }
              />
            </div>
          ))}

          <div className="fw-bold fs-5 mt-3">
            Total a pagar: L. {totalPagoMultiple}
          </div>

          <div className="text-end mt-4">
            <button className="btn btn-success me-2" onClick={guardarPagoMultiple}>
              Confirmar Pago
            </button>
            <button className="btn btn-secondary" onClick={() => setShowModalMultiple(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
