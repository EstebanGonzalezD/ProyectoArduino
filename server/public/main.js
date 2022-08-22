const socket = io();
const temp = 0;
const XLSX = require("xlsx");

socket.on("temp", function (data) {
  let temp = document.getElementById("distance");
  temp.innerHTML = `${data}` + "cm";
  temp = data;
});

socket.on("distancias", function (data) {
  let alerta = 0;

  if (data[0][0].distancia < 40) {
    alerta++;
  }
  if (data[0][1].distancia < 40) {
    alerta++;
  }
  if (data[0][2].distancia < 40) {
    alerta++;
  }

  if (alerta == 3) {
    swal(
      "¡Cuidado!",
      "Te has acercado mucho a la pantalla, recuerda tener una distancia moderada",
      "warning"
    );
  }
});

document
  .getElementById("button")
  .addEventListener("click", generarExcel, false);

document
  .getElementById("pausar")
  .addEventListener("click", pausar, false);

function generarExcel() {
  const dtmFechaDesde = document.getElementById("fechaDesde").value;
  const dtmFechaHasta = document.getElementById("fechaHasta").value;

  socket.emit("dtmFechaDesde", dtmFechaDesde);
  socket.emit("dtmFechaHasta", dtmFechaHasta);
}

socket.on("informeExcel", function (data) {
  convertJsonToExcel(data[0]);
});

const convertJsonToExcel = (data) => {
  const workSheet = XLSX.utils.json_to_sheet(data);
  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook, workSheet, "data");
  // Generate buffer
  XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

  // Binary string
  XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

  XLSX.writeFile(workBook, "InformeDistancias.xlsx");
};

function pausar() {

  if (document.getElementById("pausar").textContent == "Detener") {
    document.getElementById("pausar").innerText = "Iniciar";
    socket.emit("Detener", '')
  } else {
    document.getElementById("pausar").innerText = "Detener";
    socket.emit("Iniciar", '')
  }
}
