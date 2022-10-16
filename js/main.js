// Variables Globales
const lista = document.querySelector("#lista");
const tbody = document.querySelector("#tbody");
const templateCarrito = document.querySelector("#templateCarrito").content;
const formularioIU = document.querySelector("#formulario");
const btnVaciar = document.querySelector("#btnVaciar");
const iCodigo = document.querySelector("#iCodigo");
const iDescripcion = document.querySelector("#iDescripcion");
const btnAgregar = document.querySelector("#btnAgregar");
const spanPrecio = document.querySelector("#spanPrecio");
const formCliente = document.querySelector("#formCliente");
const selectCliente = document.querySelector("#selectCliente");
const templateCodigos = document.querySelector("#templateCodigos").content;
const codigoLista = document.querySelector("#CodigoLista");
const btnCodigos = document.querySelector("#btnCodigos");
let carrito = [];
let productos = [];
let clientes = [];

// Clases

class Producto {
  // se construye plantilla de productos
  constructor(id, codigo, descripcion, categoria, precio) {
    this.id = id;
    this.codigo = codigo;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.precio = precio;
  }
}

class Carrito {
  constructor(cID, cCodigo, cDescripcion, cCantidad, cPrecioUnit) {
    this.cID = cID;
    this.cCodigo = cCodigo;
    this.cDescripcion = cDescripcion;
    this.cCantidad = cCantidad;
    this.cPrecioUnit = cPrecioUnit;
    this.cSubTotal = cPrecioUnit * cCantidad;
  }
}

// Funciones

// Mostrar clientes segun que opcion elijamos en el Select
function RenderizarCliente() {
  if (selectCliente.selectedIndex !== 0) {
    item = formCliente.elements;
    cliente = clientes.find((item) => item.id == selectCliente.selectedIndex);
    item.cNombre.value = cliente.nombre;
    item.cApellido.value = cliente.apellido;
    item.cProvincia.value = cliente.provincia;
    item.cLocalidad.value = cliente.localidad;
    item.cDireccion.value = cliente.direccion;
    item.cCodigoPostal.value = cliente.codigoPostal;
    item.cEmail.value = cliente.email;
    item.cTelTrabajo.value = Number(cliente.teltrabajo);
    item.cTelPersonal.value = Number(cliente.telpersonal);
  } else {
    formCliente.reset();
  }
}

// renderizar Lista de Codigos
function renderizarCodigos() {
  codigoLista.textContent = "";
  productos.forEach((item) => {
    clone = templateCodigos.cloneNode(true);
    clone.querySelector(".codigo").textContent = item.codigo;
    clone.querySelector(".descripcion").textContent = item.descripcion;

    codigoLista.appendChild(clone);
  });
}

// Obtener datos Json y Enviarlo al array de productos y Clientes
const ObtenerDatos = async () => {
  urlProductos = "./json/ProductosDB.json";
  urlClientes = "./json/UsuariosDB.json";
  try {
    const [respuestaProducto, respuestaCliente] = await Promise.all([
      fetch(urlProductos),
      fetch(urlClientes),
    ]);
    const arrayProductos = await respuestaProducto.json();
    const arrayClientes = await respuestaCliente.json();
    productos = arrayProductos;
    clientes = arrayClientes;

    ClienteSelect();
  } catch (error) {
    console.log(error);
  }
};

// Insertamos Options al Select de Clientes
function ClienteSelect() {
  clientes.forEach((cliente) => {
    option = `<option value="${cliente.id}">${cliente.nombre} ${cliente.apellido}</option>`;
    selectCliente.insertAdjacentHTML("beforeend", option);
  });
}

// Capturar datos FORM
formularioIU.addEventListener("submit", (e) => {
  e.preventDefault();
  form = new FormData(formularioIU);
  vCodigo = Number(form.get("vCodigo"));
  vCantidad = Number(form.get("vCantidad"));
  if (vCodigo == "" || vCantidad == "") {
    return;
  }

  cargarFactura(vCodigo, vCantidad);
});

// Pushear items a Carrito
const cargarFactura = (cod, cant) => {
  itemsFactura = productos.find((item) => item.codigo === cod);
  const { id, codigo, descripcion, precio } = itemsFactura;
  item = carrito.findIndex((i) => i.cCodigo === cod);
  item == -1
    ? carrito.push(new Carrito(id, codigo, descripcion, cant, precio))
    : ((carrito[item].cCantidad += cant),
      (carrito[item].cSubTotal = precio * carrito[item].cCantidad));

  //  Resetea Formulario -
  formularioIU.reset();

  //  Hace Focus al input del codigo
  iCodigo.focus();

  // Toast de que el producto se cargo
  Swal.fire({
    text: "Se agrego exitosamente tu producto",
    showConfirmButton: false,
    icon: "success",
    toast: true,
    position: "top-end",
    timer: 3000,
  });

  pintarCarrito();
};

//Calcular Total
const sumaTotal = () => {
  let total = carrito.reduce(
    (acc, current) => acc + current.cCantidad * current.cPrecioUnit,
    0
  );
  return total.toFixed(2);
};

// Mostrar Carrito
const pintarCarrito = () => {
  //LocalStorage
  localStorage.setItem("carrito_db", JSON.stringify(carrito));
  spanPrecio.textContent = "";
  tbody.textContent = "";
  lista.classList.add("d-none");
  carrito.forEach((item) => {
    lista.classList.remove("d-none");
    const clone = templateCarrito.cloneNode(true);
    const { cCodigo, cDescripcion, cPrecioUnit, cCantidad, cSubTotal, cID } =
      item;
    clone.querySelector(".cod").textContent = cCodigo;
    clone.querySelector(".desc").textContent = cDescripcion;
    clone.querySelector(".prec").textContent = cPrecioUnit;
    clone.querySelector(".cant").textContent = cCantidad;
    subTotal = cSubTotal;
    clone.querySelector(".subt").textContent = subTotal.toFixed(2);
    clone.querySelector(".btn-danger").dataset.id = cID;
    spanPrecio.textContent = sumaTotal();

    // Evento Eliminar
    clone.querySelector(".btn-danger").addEventListener("click", (evento) => {
      indice = carrito.findIndex((i) => i.cID === cID);
      if (indice !== -1) {
        carrito.splice(indice, 1);
      }
      pintarCarrito();

      // Toast que confirma la eliminacion del producto
      Swal.fire({
        text: "Item eliminado Correctamente",
        showConfirmButton: false,
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 3000,
      });
    });
    tbody.appendChild(clone);
  });
};

// E V E N T O S
// Renderizar Codigos al dar click en el boton
btnCodigos.addEventListener("click", renderizarCodigos);

// Detectar cliente en Select

selectCliente.addEventListener("click", RenderizarCliente);

// BUSCADOR EN TIEMPO REAL -
iCodigo.addEventListener("keyup", () => {
  let vCodigo = Number(iCodigo.value);
  existeID = productos.findIndex((e) => e.codigo === vCodigo);
  if (existeID !== -1) {
    btnAgregar.removeAttribute("disabled");
    let text = productos.find((p) => p.codigo === vCodigo);
    iDescripcion.value = text.descripcion;
  } else {
    btnAgregar.setAttribute("disabled", "");
    if (iCodigo.value !== "") {
      iDescripcion.value = "El Codigo no Existe...";
    } else {
      iDescripcion.value = "Esperando Codigo...";
    }
  }
});

// PUSHEAR FACTURA

// Boton Vaciar Carrito
btnVaciar.addEventListener("click", (e) => {
  e.preventDefault();
  // Alerta para Reiniciar Factura
  Swal.fire({
    text: "¿Estas seguro que deseas Reinciar la Factura?",
    showConfirmButton: true,
    showDenyButton: true,
    confirmButtonText: "SI",
    icon: "question",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    stopKeydownPropagation: false,
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      carrito = [];
      formularioIU.reset();
      pintarCarrito();
      iCodigo.focus();
    }
  });
});

// Lo primero en Cargar

document.addEventListener("DOMContentLoaded", (e) => {
  // if (!sessionStorage.getItem("Sesion")) {
  //   window.location.assign("login.html");
  // }
  //LOCAL STORAGE
  localStorage.getItem("carrito_db")
    ? ((carrito = JSON.parse(localStorage.getItem("carrito_db"))),
      pintarCarrito())
    : (carrito = []);

  // Obtener datos y Pushear al Arrayprodcutos
  ObtenerDatos();
});
