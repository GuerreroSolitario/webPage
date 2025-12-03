let textoBusqueda = "";
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const cerrarMenu = document.getElementById("cerrar-menu");
const header = document.querySelector(".main-header");
const numeroWhatsApp = "5218180850586"; // 52 = México, 1 = celular, luego el número

let lastScrollY = window.scrollY;

// Abrir/cerrar al hacer clic en el ícono ☰
menuToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  navLinks.classList.toggle("show");

  if (navLinks.classList.contains("show")) {
    
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }
});

// Cerrar al hacer clic en ❌
cerrarMenu.addEventListener("click", (event) => {
  event.stopPropagation();
  navLinks.classList.remove("show");
  document.body.classList.remove("no-scroll");
});

// Cerrar al hacer clic fuera del menú
document.addEventListener("click", (event) => {
  const isClickInsideMenu = navLinks.contains(event.target);
  const isClickOnToggle = menuToggle.contains(event.target);

  if (!isClickInsideMenu && !isClickOnToggle) {
    navLinks.classList.remove("show");
    document.body.classList.remove("no-scroll");
  }
});

// Ocultar header al hacer scroll hacia abajo
window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 60) {
    header.classList.add("hide-header");
  } else {
    header.classList.remove("hide-header");
  }

  lastScrollY = currentScrollY;
});

// Buscador de marcas con normalización
const buscador = document.getElementById("marca-busqueda");
const etiquetas = document.querySelectorAll("#marca-form label");

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

buscador.addEventListener("input", () => {
  const filtro = normalizar(buscador.value);

  etiquetas.forEach((label) => {
    const textoMarca = normalizar(label.querySelector("span").textContent);
    label.style.display = textoMarca.includes(filtro) ? "flex" : "none";
  });
});

// Filtrado dinámico con productos.json
const checkboxes = document.querySelectorAll(
  '#marca-form input[type="checkbox"]'
);
const productList = document.getElementById("product-list");

// Guardamos las 12 tarjetas iniciales
const initialHTML = productList.innerHTML;

// Cargar JSON externo
let perfumes = [];
fetch("productos.json")
  .then((res) => res.json())
  .then((data) => {
    perfumes = data;

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const marcasSeleccionadas = Array.from(checkboxes)
          .filter((cb) => cb.checked)
          .map((cb) => normalizar(cb.value));

        if (marcasSeleccionadas.length === 0) {
          // Restaurar las 12 tarjetas iniciales
          productList.innerHTML = initialHTML;
        } else {
          // Renderizar tarjetas filtradas desde JSON
          productList.innerHTML = "";
          const filtrados = perfumes.filter((p) =>
            marcasSeleccionadas.includes(normalizar(p.Marca))
          );

          filtrados.forEach((p) => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.setAttribute("data-marca", p.Marca);

            card.innerHTML = `
  <img src="${p["LinkFoto"]}" alt="${p.Nombre}" />
  <div class="product-info">
    <p class="product-brand">${p.Marca}</p>
    <p class="product-name">${p.Nombre}</p>
  </div>
  <button class="botonChido">Cotizar</button>
`;

            productList.appendChild(card);
          });
        }

        // Reset buscador
        if (buscador.value.trim() !== "") {
          buscador.value = "";
          etiquetas.forEach((label) => (label.style.display = "flex"));
        }
      });
    });
  })
  .catch((err) => console.error("Error cargando productos.json:", err));

// Chips de marcas seleccionadas
document.addEventListener("DOMContentLoaded", function () {
  const marcaForm = document.getElementById("marca-form");
  const marcasSeleccionadas = document.getElementById("marcas-seleccionadas");
  const borrarFiltros = document.getElementById("borrar-filtros");
  const bloqueMarcas = document.getElementById("bloque-marcas-seleccionadas");

  function actualizarMarcasSeleccionadas() {
    const checkboxes = marcaForm.querySelectorAll("input[type='checkbox']");
    marcasSeleccionadas.innerHTML = "";

    const ul = document.createElement("ul");
    ul.classList.add("lista-marcas");

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const li = document.createElement("li");
        li.classList.add("marca-item", "newChipContainer");

        const span = document.createElement("span");
        span.textContent = checkbox.value;

        const botonX = document.createElement("button");
        botonX.classList.add("boton-x", "plpChipOn");
        botonX.setAttribute("aria-label", "Quitar marca");

        const iconoImg = document.createElement("img");
        iconoImg.src = "imagenes/remover.png";
        iconoImg.alt = "Quitar marca";
        iconoImg.classList.add("icono-x");

        botonX.appendChild(iconoImg);

        botonX.addEventListener("click", (event) => {
          event.stopPropagation();
          checkbox.checked = false;
          const eventoCambio = new Event("change", {
            bubbles: true,
          });
          checkbox.dispatchEvent(eventoCambio);
        });

        li.appendChild(span);
        li.appendChild(botonX);
        ul.appendChild(li);
      }
    });

    if (ul.children.length > 0) {
      marcasSeleccionadas.appendChild(ul);
      bloqueMarcas.style.display = "block";

      if (marcasSeleccionadas.scrollHeight > 190) {
        marcasSeleccionadas.classList.add("scrollable");
      } else {
        marcasSeleccionadas.classList.remove("scrollable");
      }
    } else {
      bloqueMarcas.style.display = "none";
      marcasSeleccionadas.classList.remove("scrollable");
    }
  }

  function toggleBorrarFiltros() {
    const algunoSeleccionado = Array.from(checkboxes).some((cb) => cb.checked);
    borrarFiltros.style.display = algunoSeleccionado ? "inline" : "none";
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      toggleBorrarFiltros();
      actualizarMarcasSeleccionadas();
    });
  });

  borrarFiltros.addEventListener("click", function () {
    // Desmarcar todas las marcas
    marcaCheckboxes.forEach((cb) => (cb.checked = false));

    // Desmarcar todos los géneros
    generoCheckboxes.forEach((cb) => (cb.checked = false));

    // Actualizar chips y botones
    toggleBorrarFiltros();
    actualizarMarcasSeleccionadas();

    // Restaurar tarjetas iniciales
    productList.innerHTML = initialHTML;
  });

  actualizarMarcasSeleccionadas();
  toggleBorrarFiltros();
});

// Botón de WhatsApp en cada producto
document.querySelectorAll(".product-card button").forEach((boton) => {
  boton.addEventListener("click", () => {
    if (navLinks.classList.contains("show")) return;

    const card = boton.closest(".product-card");
const nombreProducto = card.querySelector(".product-name").textContent;
const marcaProducto = card.querySelector(".product-brand").textContent;

const mensaje = `Hola, estoy interesado en el perfume: ${nombreProducto} | ${marcaProducto}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, "_blank");
  });
});

// Modal de imágenes
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("caption");
const spanClose = document.querySelector(".close");

document.querySelectorAll(".product-card img").forEach((img) => {
  img.addEventListener("click", () => {
    if (navLinks.classList.contains("show")) return;

    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.textContent = img.alt;
  });
});

spanClose.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

productList.addEventListener("click", (e) => {
  const boton = e.target.closest(".product-card button");
  if (boton) {
    if (navLinks.classList.contains("show")) return;

    const card = boton.closest(".product-card");

    const nombreProducto = card.querySelector(".product-name").textContent;
    const marcaProducto = card.querySelector(".product-brand").textContent;

    const mensaje = `Hola, estoy interesado en el perfume: ${nombreProducto} | ${marcaProducto}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, "_blank");
    return;
  }

  // Imagen modal (lo de abajo queda igual)
  const img = e.target.closest(".product-card img");
  if (img) {
    if (navLinks.classList.contains("show")) return;
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.textContent = img.alt;
  }
});


// Delegación para imágenes
productList.addEventListener("click", (e) => {
  const img = e.target.closest(".product-card img");
  if (!img) return;

  // Bloquear si menú abierto
  if (navLinks.classList.contains("show")) return;

  modal.style.display = "block";
  modalImg.src = img.src;
  captionText.textContent = img.alt;
});

// Checkboxes de marcas y géneros
const marcaCheckboxes = document.querySelectorAll(
  '#marca-form input[type="checkbox"]'
);
const generoCheckboxes = document.querySelectorAll(
  '#genero-form input[type="checkbox"]'
);

function filtrarProductos() {
  const marcasSeleccionadas = Array.from(marcaCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => normalizar(cb.value));

  const generosSeleccionados = Array.from(generoCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => normalizar(cb.value));

  // Si no hay filtros, restaurar inicial
  if (marcasSeleccionadas.length === 0 && generosSeleccionados.length === 0) {
    productList.innerHTML = initialHTML;
    return;
  }

  // Filtrar desde perfumes.json
  productList.innerHTML = "";
  const filtrados = perfumes.filter((p) => {
    const marcaOk =
      marcasSeleccionadas.length === 0 ||
      marcasSeleccionadas.includes(normalizar(p.Marca));
    const generoOk =
      generosSeleccionados.length === 0
        ? true
        : generosSeleccionados.includes(normalizar(p["Género"]));
    return marcaOk && generoOk;
  });

  filtrados.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-marca", p.Marca);

    card.innerHTML = `
      <img src="${p["LinkFoto"]}" alt="${p.Nombre}" />
      <div class="product-info">
        <p class="product-brand">${p.Marca}</p>
        <p class="product-name">${p.Nombre}</p>
      </div>
      <button class="botonChido">Cotizar</button>
    `;

    productList.appendChild(card);
  });

  actualizarVista();
}

// Escuchar cambios en ambos grupos de checkboxes
marcaCheckboxes.forEach((cb) =>
  cb.addEventListener("change", filtrarProductos)
);
generoCheckboxes.forEach((cb) =>
  cb.addEventListener("change", filtrarProductos)
);

// Estado y referencias

fetch("productos.json")
  .then((res) => res.json())
  .then((data) => {
    perfumes = data;
    // Primer render: sin filtros (usa las 12 iniciales ya en HTML)
    attachFilterListeners();
  })
  .catch((err) => console.error("Error cargando productos.json:", err));

// Función de render unificada
function renderProductos() {
  const marcasSeleccionadas = Array.from(marcaCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => normalizar(cb.value));

  const generosSeleccionados = Array.from(generoCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => normalizar(cb.value));

  // Si no hay filtros, restaura inicial
  if (marcasSeleccionadas.length === 0 && generosSeleccionados.length === 0) {
    productList.innerHTML = initialHTML;
    return;
  }

  const filtrados = perfumes.filter((p) => {
    const marcaOk =
      marcasSeleccionadas.length === 0 ||
      marcasSeleccionadas.includes(normalizar(p.Marca));

    const generoOk =
      generosSeleccionados.length === 0 ||
      generosSeleccionados.includes(normalizar(p["Género"])) ||
      (normalizar(p["Género"]) === "unisex" &&
        (generosSeleccionados.includes("caballero") ||
          generosSeleccionados.includes("dama")));

    return marcaOk && generoOk;
  });

  // Render
  productList.innerHTML = "";
  if (filtrados.length === 0) {
    productList.innerHTML = `<p class="no-results">No hay productos que coincidan con los filtros seleccionados.</p>`;
    return;
  }

  filtrados.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-marca", p.Marca);

    card.innerHTML = `
      <img src="${p["LinkFoto"]}" alt="${p.Nombre}" />
      <div class="product-info">
        <p class="product-brand">${p.Marca}</p>
        <p class="product-name">${p.Nombre}</p>
      </div>
      <button class="botonChido">Cotizar</button>
    `;

    productList.appendChild(card);
  });

  actualizarVista();
}

// Listeners de filtro
function attachFilterListeners() {
  // ▶️ Si el usuario selecciona una marca o género, se borra la búsqueda
  marcaCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      textoBusqueda = ""; // limpiar texto buscado

      const input = document.querySelector(".search-box");
      if (input) input.value = ""; // limpiar input visual

      // cerrar el header de búsqueda si está abierto
      container.innerHTML = "";

      actualizarVista(); // refrescar productos
    });
  });

  generoCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      textoBusqueda = "";

      const input = document.querySelector(".search-box");
      if (input) input.value = "";

      container.innerHTML = "";

      actualizarVista();
    });
  });
}

// Delegación de eventos para botones e imágenes (una sola vez)
productList.addEventListener("click", (e) => {
  // Botón cotizar
  const boton = e.target.closest(".product-card button");
  if (boton) {
    if (navLinks.classList.contains("show")) return;
    const card = boton.closest(".product-card");
    const nombreProducto = card.querySelector(".product-name").textContent;
    const mensaje = `Hola, estoy interesado en el perfume: ${nombreProducto}`;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank");
    return;
  }

  // Imagen modal
  const img = e.target.closest(".product-card img");
  if (img) {
    if (navLinks.classList.contains("show")) return;
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.textContent = img.alt;
  }
});

const searchToggle = document.getElementById("search-toggle");
const container = document.getElementById("search-header-container");

searchToggle.addEventListener("click", function () {
  const existingHeader = container.querySelector("header");

  if (!existingHeader) {
    const header = document.createElement("header");
    header.classList.add("main-header");

    // Wrapper para input + lupa
    const inputWrapper = document.createElement("div");
    inputWrapper.classList.add("input-wrapper");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Buscar producto...";
    input.classList.add("search-box");

    const lupaIcon = document.createElement("img");
    lupaIcon.src = "imagenes/buscar.png";
    lupaIcon.alt = "Buscar";
    lupaIcon.classList.add("lupa-icon");

    inputWrapper.appendChild(input);
    inputWrapper.appendChild(lupaIcon);

    // Botón remover (tacha)
    const removerBtn = document.createElement("img");
    removerBtn.src = "imagenes/remover.png";
    removerBtn.alt = "Cerrar búsqueda";
    removerBtn.classList.add("remover-icon");

    removerBtn.addEventListener("click", () => {
      container.innerHTML = "";
    });

    // Insertamos ambos en el header
    header.appendChild(inputWrapper);
    header.appendChild(removerBtn);

    container.appendChild(header);
    input.focus();

    // Escuchar cambios en el buscador dinámico
input.addEventListener("input", () => {
  const filtro = normalizar(input.value);
  textoBusqueda = filtro;

  // 🔥 Si el usuario escribe → limpiar TODOS los filtros
  marcaCheckboxes.forEach(cb => cb.checked = false);
  generoCheckboxes.forEach(cb => cb.checked = false);

  // 🔥 Limpiar chips visuales
  const bloqueMarcas = document.getElementById("bloque-marcas-seleccionadas");
  const marcasSeleccionadas = document.getElementById("marcas-seleccionadas");
  if (bloqueMarcas) bloqueMarcas.style.display = "none";
  if (marcasSeleccionadas) marcasSeleccionadas.innerHTML = "";

  actualizarVista();
});

  }
});

function obtenerProductosFiltrados() {
  const marcasActivas = Array.from(
    document.querySelectorAll('#marca-form input[type="checkbox"]:checked')
  ).map(cb => normalizar(cb.value));

  const generosActivos = Array.from(
    document.querySelectorAll('#genero-form input[type="checkbox"]:checked')
  ).map(cb => normalizar(cb.value));

  const texto = textoBusqueda.trim();
  const palabras = texto.split(/\s+/).filter(Boolean);

  if (
    palabras.length === 0 &&
    marcasActivas.length === 0 &&
    generosActivos.length === 0
  ) {
    return "DEFAULT";
  }

  const filtrados = perfumes.filter(p => {
    const marcaOk =
      marcasActivas.length === 0 ||
      marcasActivas.includes(normalizar(p.Marca));

 const generoOk =
  generosActivos.length === 0 ||
  generosActivos.includes(normalizar(p["Género"])) ||
  (normalizar(p["Género"]) === "unisex" &&
    (generosActivos.includes("caballero") ||
     generosActivos.includes("dama")));

    const combinado = normalizar(`${p.Marca} ${p.Nombre}`);

    const textoOk =
      palabras.length === 0 ||
      palabras.every(palabra => combinado.includes(palabra));

    return marcaOk && generoOk && textoOk;
  });

  return filtrados.sort((a, b) => {
    const nombreA = normalizar(a.Nombre);
    const nombreB = normalizar(b.Nombre);
    const marcaA = normalizar(a.Marca);
    const marcaB = normalizar(b.Marca);

    const scoreA = palabras.reduce((score, palabra) => {
      if (nombreA.split(/\s+/).includes(palabra)) score += 5; // palabra exacta en nombre
      else if (marcaA.split(/\s+/).includes(palabra)) score += 4; // palabra exacta en marca
      else if (nombreA.includes(palabra)) score += 2; // parcial en nombre
      else if (marcaA.includes(palabra)) score += 1; // parcial en marca
      return score;
    }, 0);

    const scoreB = palabras.reduce((score, palabra) => {
      if (nombreB.split(/\s+/).includes(palabra)) score += 5;
      else if (marcaB.split(/\s+/).includes(palabra)) score += 4;
      else if (nombreB.includes(palabra)) score += 2;
      else if (marcaB.includes(palabra)) score += 1;
      return score;
    }, 0);

    if (scoreB !== scoreA) {
      return scoreB - scoreA; // mayor score primero
    }

    // desempate alfabético
    return nombreA.localeCompare(nombreB);
  });
}




const porPagina = 30;
let paginaActual = 1;

function renderizarPagina(pagina) {
  const productos = obtenerProductosFiltrados();

  if (productos === "DEFAULT") {
  productList.innerHTML = initialHTML;
  return;
}
  // ✔ SI NO HAY PRODUCTOS → mostrar mensaje
  if (productos.length === 0) {
    productList.innerHTML = `
      <div class="mensaje-wrapper">
        <p class="no-results">No se encontraron productos.</p>
      </div>
    `;
    return;
  }

  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  const visibles = productos.slice(inicio, fin);

  productList.innerHTML = "";

  visibles.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-marca", p.Marca);
    card.innerHTML = `
      <img src="${p["LinkFoto"]}" alt="${p.Nombre}" />
      <div class="product-info">
        <p class="product-brand">${p.Marca}</p>
        <p class="product-name">${p.Nombre}</p>
      </div>
      <button class="botonChido">Cotizar</button>
    `;
    productList.appendChild(card);
  });
}

function renderizarBotonesPaginacion() {
  const productos = obtenerProductosFiltrados();
  const paginacion = document.getElementById("paginacion");
  paginacion.innerHTML = "";

  // ✔ SI NO HAY PRODUCTOS → NO MOSTRAR PAGINACIÓN
  if (productos.length === 0) return;

  const totalPaginas = Math.ceil(productos.length / porPagina);

  if (totalPaginas <= 1) return;

  function crearBoton(num) {
    const btn = document.createElement("button");
    btn.textContent = num;
    btn.className = num === paginaActual ? "activo" : "";
btn.onclick = () => {
  paginaActual = num;
  renderizarPagina(num);
  renderizarBotonesPaginacion();

  // 🔥 Subir al inicio suave
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

    paginacion.appendChild(btn);
  }

  crearBoton(1);

  if (paginaActual > 4) {
    const dots = document.createElement("span");
    dots.textContent = "...";
    paginacion.appendChild(dots);
  }

  const inicio = Math.max(2, paginaActual - 2);
  const fin = Math.min(totalPaginas - 1, paginaActual + 2);
  for (let i = inicio; i <= fin; i++) {
    crearBoton(i);
  }

  if (paginaActual < totalPaginas - 3) {
    const dots = document.createElement("span");
    dots.textContent = "...";
    paginacion.appendChild(dots);
  }

  crearBoton(totalPaginas);
}

function actualizarVista() {
  paginaActual = 1;
  renderizarPagina(paginaActual);
  renderizarBotonesPaginacion();
}
