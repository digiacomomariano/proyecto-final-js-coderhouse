// Variables Globales

// Const OTROS
const lista = document.querySelector("#lista");
const tbody = document.querySelector("#tbody");
const sectionVerFactura = document.querySelector("#sectionVerFactura");
const anclaFactura = document.querySelector("#anclaFactura");
const spanPrecio = document.querySelector("#spanPrecio");
const codigoLista = document.querySelector("#CodigoLista");
const badge = document.querySelector(".badge");
const btnnavbar = document.querySelector("#btnnavbar");
//  Const Form
const formularioIU = document.querySelector("#formulario");
const iDescripcion = document.querySelector("#iDescripcion");
const iCodigo = document.querySelector("#iCodigo");
const formCliente = document.querySelector("#formCliente");
const formCrearCliente = document.querySelector("#formCrearCliente");
const selectCliente = document.querySelector("#selectCliente");
//  Const Templates
const templateLI = document.querySelector("#templateLI").content;
const templateCarrito = document.querySelector("#templateCarrito").content;
const templateCodigos = document.querySelector("#templateCodigos").content;
const templateListarFactura = document.querySelector(
  "#templateListarFactura"
).content;

//  Const Botones
const btnVaciar = document.querySelector("#btnVaciar");
const btnAgregar = document.querySelector("#btnAgregar");
const btnCodigos = document.querySelector("#btnCodigos");
const cartIcon = document.querySelector(".icon");
const btnNewClient = document.querySelector("#btnNewClient");
const btnEnviarFactura = document.querySelector("#btnEnviarFactura");
const btnVaciarFactura = document.querySelector("#btnVaciarFactura");

//Array
let carrito = [];
let productos = [];
let clientes = [];
let facturas = [];

//  Instancio modal de crear cliente
const modal = new bootstrap.Modal(document.getElementById("CrearCliente"), {
  keyboard: false,
});

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

// Obtener datos Json y Enviarlo al array de productos y Clientes
const ObtenerDatos = async () => {
  urlProductos =
    "https://digiacomomariano.github.io/proyecto-final-js-coderhouse/json/ProductosDB.json";
  urlClientes =
    "https://digiacomomariano.github.io/proyecto-final-js-coderhouse/json/UsuariosDB.json";
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

// Funcion para validar y crear clientes

function newClient() {
  item = formCrearCliente.elements;
  const [
    cNombre,
    cApellido,
    cProvincia,
    cLocalidad,
    cDireccion,
    cCodigoPostal,
    cEmail,
    cTelTrabajo,
    cTelPersonal,
  ] = item;
  if (
    ![
      cNombre.value,
      cApellido.value,
      cProvincia.value,
      cLocalidad.value,
      cDireccion.value,
      cCodigoPostal.value,
      cEmail.value,
      cTelTrabajo.value,
      cTelPersonal.value,
    ].includes("")
  ) {
    // Pushear cliente nuevo y cerrar modal.
    clientes.push({
      id: generarID(),
      nombre: cNombre.value,
      apellido: cApellido.value,
      direccion: cDireccion.value,
      provincia: cProvincia.value,
      localidad: cLocalidad.value,
      teltrabajo: cTelTrabajo.value,
      telpersonal: cTelPersonal.value,
      codigoPostal: cCodigoPostal.value,
      email: cEmail.value,
    });

    // renderizar clientes
    ClienteSelect();

    // reset form
    formCrearCliente.reset();

    // Cerrar Modal
    modal.toggle();
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Lo siento, Todos los campos son Obligatorios",
    });
  }
}

// GENERADOR DE ID
function generarID() {
  const a = Math.random().toString(36).substring(2);
  const b = Date.now().toString(36);
  return a + b;
}

// Mostrar clientes segun que opcion elijamos en el Select
function RenderizarCliente() {
  if (selectCliente.selectedIndex !== 0) {
    item = formCliente.elements;
    cliente = clientes.find((item) => item.id === selectCliente.value);
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

//  Insertamos Options al Select de Clientes

function ClienteSelect() {
  selectCliente.textContent = "";
  selectCliente.insertAdjacentHTML(
    "beforeend",
    `<option selected value="0">-- Seleccione un Cliente --</option>`
  );
  clientes.forEach((cliente) => {
    const opciones = document.createElement("option");
    opciones.value = cliente.id;
    opciones.text = `${cliente.nombre} ${cliente.apellido} `;
    selectCliente.appendChild(opciones);
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
    position: "bottom-end",
    timer: 1500,
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
  //Comprobar si existen elemntos en el carrito para mostrar botones
  carrito.length > 0
    ? btnnavbar.classList.remove("d-none")
    : btnnavbar.classList.add("d-none");
  //LocalStorage
  localStorage.setItem("carrito_db", JSON.stringify(carrito));
  badge.textContent = "";
  spanPrecio.textContent = "";
  tbody.textContent = "";
  lista.classList.add("d-none");
  carrito.forEach((item) => {
    badge.textContent = carrito.length;
    badge.classList.remove("d-none");
    lista.classList.remove("d-none");
    const clone = templateCarrito.cloneNode(true);
    const { cCodigo, cDescripcion, cPrecioUnit, cCantidad, cSubTotal, cID } =
      item;
    clone.querySelector(".cod").textContent = cCodigo;
    clone.querySelector(".prec").textContent = cPrecioUnit;
    clone.querySelector(".cant").textContent = cCantidad;
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
        position: "bottom-end",
        timer: 3000,
      });
    });
    tbody.appendChild(clone);
  });
};

// Formatear fecha

function FormatearFecha() {
  fechaActual = new Date();
  dia = fechaActual.getDate();
  mes = fechaActual.getMonth() + 1;
  anio = fechaActual.getUTCFullYear();
  fecha = `${dia}/${mes}/${anio}`;
  return fecha;
}

// Obtener Facturas
function ObtenerFacturas() {
  sectionVerFactura.textContent = "";
  if (facturas.length === 0) {
    sectionVerFactura.textContent = "";
    p = document.createElement("p");
    p.classList.add("p-4");
    p.textContent = "Lo siento, No hay facturas disponibles para Mostrar";
    sectionVerFactura.appendChild(p);
    return;
  } else {
    ListarFacturas();
  }
}

function ListarFacturas() {
  sectionVerFactura.textContent = "";
  filtrarID = facturas.map((item) => item.idcliente);
  idSinRepetir = [...new Set(filtrarID)];

  idSinRepetir.forEach((name) => {
    buscarName = clientes.find((clienteName) => clienteName.id == name);
    identificador = buscarName.nombre + buscarName.id;
    clone = templateListarFactura.cloneNode(true);
    clone.querySelector(
      "button"
    ).textContent = `${buscarName.nombre} ${buscarName.apellido}`;
    clone.querySelector("button").dataset.bsTarget = "#" + identificador;
    clone.querySelector(".accordion-collapse").id = identificador;

    sectionVerFactura.appendChild(clone);
  });
}

// render factura

function RenderFacturaCliente(nameid) {
  // console.log("me diste click");
  // const ulFactura = document.querySelector("#ulFactura");
  // ulFactura.textContent = "";
  // clone = templateLI.cloneNode(true);
  // clone.querySelector("a").textContent = "nameid";
  sectionVerFactura.querySelector("#ulFactura li a").textContent = "hola";
}

// E V E N T O S

// Llamar funcion para ver facturas
anclaFactura.addEventListener("click", ObtenerFacturas);

// Renderizar Codigos al dar click en el boton
btnCodigos.addEventListener("click", renderizarCodigos);

// Detectar cliente en Select

selectCliente.addEventListener("change", RenderizarCliente);

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

//  Evento Finalizar factura -
btnEnviarFactura.addEventListener("click", (e) => {
  e.preventDefault();
  clienteID = selectCliente.value;
  if (clienteID !== "0") {
    // Pushear Factura
    facturas.push({
      idfactura: generarID(),
      nrofactura: Math.random().toString().slice(12),
      fecha: FormatearFecha(),
      idcliente: clienteID,
      detalle: carrito,
    });
    selectCliente.selectedIndex = 0;
    //  Guardamos Factura en el localStorage
    localStorage.setItem("factura_db", JSON.stringify(facturas));
    // Mensaje de Confirmacion
    Swal.fire({
      icon: "success",
      text: "Se registro la factura Correctamente",
    });

    // Limpiamos Carrito, Reiniciamos Formulario de cliente, volvemos a renderizar carrito vacio
    carrito = [];
    formCliente.reset();
    pintarCarrito();
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor seleccione un cliente Valido",
    });
  }
});

// Nuevo CLiente

btnNewClient.addEventListener("click", newClient);

// Boton Vaciar Factura
btnVaciarFactura.addEventListener("click", (e) => {
  e.preventDefault();
  // Alerta para Reiniciar Factura
  Swal.fire({
    text: "¿Estas seguro que deseas Vaciar la Factura?",
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
