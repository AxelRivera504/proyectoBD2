import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Menu from "devextreme-react/menu";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Inicio",
      path: "/",
    },
    {
      text: "Inventario",
      items: [
        { text: "Productos", path: "/productos" },
        { text: "Elaboración de Productos", path: "/elaboracion" },
      ],
    },
    {
      text: "Compras",
      items: [
        { text: "Proveedores", path: "/suppliers" },
        { text: "Órdenes de Compra", path: "/purchaseOrders" },
        { text: "Pago a Proveedores", path: "/supplierPayment" },
        { text: "Devoluciones Proveedor", path: "/devolutions" },
      ],
    },
    {
      text: "Ventas",
      items: [
        { text: "Ventas Contado", path: "/ventasDetalle" },
        { text: "Ventas Mayorista", path: "/ventasMayorista" },
        { text: "Clientes", path: "/clients" },
      ],
    },
    {
      text: "Reportes",
      path: "/reportes",
    },
  ];

  const handleClick = (e) => {
    if (e.itemData?.path) {
      navigate(e.itemData.path);
    }
  };

  // marcar activo
  const cssClass = (path) =>
    location.pathname === path ? "active-nav" : "";

  // agregamos clase activa a los hijos
  const addActiveClass = (items) =>
    items.map((item) => ({
      ...item,
      cssClass: cssClass(item.path),
      items: item.items ? addActiveClass(item.items) : undefined,
    }));

  return (
    <nav className="nav-bar shadow-sm">
  <div className="nav-center">
    <Menu
      dataSource={addActiveClass(menuItems)}
      displayExpr="text"
      orientation="horizontal"
      onItemClick={handleClick}
    />
  </div>
</nav>

  );
};

export default Navigation;
