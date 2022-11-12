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

    document.getElementById('sonidos').innerHTML = '<audio src="./sounds/SD_ALERT_18.mp3" autoplay></audio>';
    
    swal(
      "¡Cuidado!",
      "Te has acercado mucho a la pantalla, recuerda tener una distancia moderada",
      "warning"
    );
    let arr = [data[0][0].distancia, data[0][1].distancia, data[0][2].distancia]

    socket.emit('alerta', arr);
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
  convertJsonToExcel(data);
});

const convertJsonToExcel = (data) => {
  const workSheet = XLSX.utils.json_to_sheet(data[0]);
  const workSheet2 =XLSX.utils.json_to_sheet(data[1]);

  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook, workSheet, "distancias");
  XLSX.utils.book_append_sheet(workBook, workSheet2, "alertas");
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

