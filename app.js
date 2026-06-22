const deliveries = [
  {
    code: "PP-1028",
    patient: "Mariana Paredes",
    destination: "Av. Francisco de Orellana",
    clinic: "Clinica Kennedy",
    driver: "Carlos Vera",
    eta: "18 min",
    status: "en camino",
    otp: "482913",
  },
  {
    code: "PP-1029",
    patient: "Jorge Medina",
    destination: "Centro de Guayaquil",
    clinic: "Clinica Kennedy",
    driver: "Luis Mora",
    eta: "24 min",
    status: "en camino",
    otp: "739204",
  },
  {
    code: "PP-1030",
    patient: "Daniela Ruiz",
    destination: "Urdesa Central",
    clinic: "Clinica Kennedy",
    driver: "Carlos Vera",
    eta: "42 min",
    status: "pendiente",
    otp: "125884",
  },
  {
    code: "PP-1031",
    patient: "Empresa Aliada",
    destination: "Via a la Costa",
    clinic: "Bodega PharmaPro",
    driver: "Sin asignar",
    eta: "-",
    status: "pendiente",
    otp: "664210",
  },
  {
    code: "PP-1022",
    patient: "Rosa Cedeno",
    destination: "Alborada",
    clinic: "Clinica Kennedy",
    driver: "Luis Mora",
    eta: "Completada",
    status: "entregado",
    otp: "938411",
  },
];

const drivers = [
  {
    name: "Carlos Vera",
    initials: "CV",
    id: "0912458891",
    status: "en ruta",
    active: 2,
    completed: 8,
    avg: "31 min",
  },
  {
    name: "Luis Mora",
    initials: "LM",
    id: "0921164308",
    status: "en ruta",
    active: 2,
    completed: 7,
    avg: "34 min",
  },
];

function getStats() {
  const totalToday = 30;
  const onRoute = deliveries.filter(
    (item) => item.status === "en camino",
  ).length;
  const completed = deliveries.filter(
    (item) => item.status === "entregado",
  ).length;

  return [
    {
      label: "Entregas de hoy",
      value: totalToday,
      note: "Meta operativa diaria",
    },
    { label: "En camino", value: onRoute, note: "Con ubicacion activa" },
    { label: "Entregadas", value: completed, note: "Confirmadas con OTP" },
    { label: "Repartidores", value: drivers.length, note: "Equipo activo" },
  ];
}

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-");
}

function renderStats() {
  const target = $("#statsGrid");
  if (!target) return;

  target.innerHTML = getStats()
    .map(
      (item) => `
        <article class="stat-card">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <span>${item.note}</span>
        </article>
      `,
    )
    .join("");
}

function renderTodayList() {
  const target = $("#todayList");
  if (!target) return;

  target.innerHTML = deliveries
    .slice(0, 5)
    .map(
      (item) => `
        <article class="delivery-item">
          <strong>${item.code} - ${item.patient}</strong>
          <div class="meta-row">
            <span>${item.destination}</span>
            <span>${item.driver}</span>
            <span>${item.eta}</span>
            <span class="status ${statusClass(item.status)}">${item.status}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderDeliveries() {
  const filter = $("#statusFilter")?.value || "all";
  const target = $("#deliveriesTable");
  if (!target) return;

  const visibleDeliveries =
    filter === "all"
      ? deliveries
      : deliveries.filter((item) => item.status === filter);

  target.innerHTML = visibleDeliveries
    .map(
      (item) => `
        <tr>
          <td><strong>${item.code}</strong></td>
          <td>${item.patient}</td>
          <td>${item.destination}</td>
          <td>${item.driver}</td>
          <td>${item.eta}</td>
          <td><span class="status ${statusClass(item.status)}">${item.status}</span></td>
          <td>${item.otp}</td>
        </tr>
      `,
    )
    .join("");
}

function renderDrivers() {
  const target = $("#driversGrid");
  if (!target) return;

  target.innerHTML = drivers
    .map(
      (driver) => `
        <article class="driver-card">
          <header>
            <div class="driver-title">
              <div class="driver-avatar">${driver.initials}</div>
              <div>
                <strong>${driver.name}</strong>
                <span>ID ${driver.id}</span>
              </div>
            </div>
            <span class="status en-camino">${driver.status}</span>
          </header>
          <div class="driver-metrics">
            <div>
              <strong>${driver.active}</strong>
              <span>Activas</span>
            </div>
            <div>
              <strong>${driver.completed}</strong>
              <span>Completadas</span>
            </div>
            <div>
              <strong>${driver.avg}</strong>
              <span>Promedio</span>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function showView(viewId) {
  $all(".view").forEach((view) => view.classList.remove("active"));
  $(`#${viewId}`)?.classList.add("active");

  $all(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });
}

function toast(message) {
  const element = $("#toast");
  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  window.setTimeout(() => {
    element.classList.remove("show");
  }, 2500);
}

function simulateLocation() {
  const pinA = $("#pinA");
  const pinB = $("#pinB");
  if (!pinA || !pinB) return;

  const currentLeftA = Number.parseFloat(pinA.style.left || 39);
  const currentTopA = Number.parseFloat(pinA.style.top || 33);
  const currentLeftB = Number.parseFloat(pinB.style.left || 55);
  const currentTopB = Number.parseFloat(pinB.style.top || 59);

  pinA.style.left = `${Math.min(currentLeftA + 4, 68)}%`;
  pinA.style.top = `${Math.max(currentTopA - 1, 27)}%`;
  pinB.style.left = `${Math.min(currentLeftB + 3, 72)}%`;
  pinB.style.top = `${Math.max(currentTopB - 2, 40)}%`;

  toast("Ubicaciones actualizadas en el mapa.");
}

function confirmOtp() {
  const input = $("#otpInput");
  const message = $("#otpMessage");
  if (!input || !message) return;

  const mainDelivery = deliveries[0];
  const code = input.value.trim();

  if (code === mainDelivery.otp) {
    mainDelivery.status = "entregado";
    mainDelivery.eta = "Completada";

    message.textContent = "Entrega confirmada correctamente.";
    message.style.color = "var(--success)";
    input.value = "";

    renderStats();
    renderTodayList();
    renderDeliveries();
    toast(`OTP correcto. Entrega ${mainDelivery.code} completada.`);
    return;
  }

  message.textContent = "Codigo incorrecto. Verifica con el cliente.";
  message.style.color = "var(--danger)";
}

function bindEvents() {
  $all(".nav-item").forEach((item) => {
    item.addEventListener("click", () => showView(item.dataset.view));
  });

  $("#statusFilter")?.addEventListener("change", renderDeliveries);
  $("#simulateLocation")?.addEventListener("click", simulateLocation);
  $("#confirmOtp")?.addEventListener("click", confirmOtp);

  $("#reportIssue")?.addEventListener("click", () => {
    toast("Incidencia registrada para revision del operador.");
  });

  $("#newDelivery")?.addEventListener("click", () => {
    showView("deliveries");
    toast("En la siguiente version este boton abrira el formulario.");
  });
}

function initApp() {
  renderStats();
  renderTodayList();
  renderDeliveries();
  renderDrivers();
  bindEvents();
}

document.addEventListener("DOMContentLoaded", initApp);
