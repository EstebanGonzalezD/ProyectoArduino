const cnx = require("./cnx");
const sql = require("mssql");

async function getMarcaciones() {
 
  try {
    let pool = await sql.connect(cnx);
    let salida = await pool
      .request()
      .query("select top 3 * from Marcaciones order by fecha desc");
    return salida.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function postMarcaciones(marcacion) {
  var today = new Date();
  var date =
    today.getFullYear() +
    "-" +
    AddZero(today.getMonth() + 1) +
    "-" +
    AddZero(today.getDate());
  var time =
    AddZero(today.getHours()) +
    ":" +
    AddZero(today.getMinutes()) +
    ":" +
    AddZero(today.getSeconds());
  var now = date + "T" + time;

  try {
    let pool = await sql.connect(cnx);
    let salida = await pool
      .request()
      .query(
        `insert into Marcaciones(fecha, distancia) values('${now}', ${marcacion})`
      );
  } catch (error) {
    console.log(error);
  }
}

async function postAlertas(arr) {

  var today = new Date();
  var date =
    today.getFullYear() +
    "-" +
    AddZero(today.getMonth() + 1) +
    "-" +
    AddZero(today.getDate());
  var time =
    AddZero(today.getHours()) +
    ":" +
    AddZero(today.getMinutes()) +
    ":" +
    AddZero(today.getSeconds());
  var now = date + "T" + time;

  try {
    let pool = await sql.connect(cnx);
    let salida = await pool
      .request()
      .query(
        `insert into Alertas(fecha, distancia_1, distancia_2, distancia_3) values('${now}', ${arr[0]}, ${arr[1]}, ${arr[2]})`
      );
  } catch (error) {
    console.log(error);
  }
}



async function informeExcel(dtmFechaDesde, dtmFechaHasta){
  try {
    let pool = await sql.connect(cnx);
    let salida = await pool.request().query(`select * from Marcaciones where fecha between '${dtmFechaDesde}:00.000' and '${dtmFechaHasta}:00.000'; select * from Alertas where fecha between '${dtmFechaDesde}:00.000' and '${dtmFechaHasta}:00.000'`);
    return salida.recordsets;
  } catch (error) {
    console.log(error);
  }
}

function AddZero(num) {
  return num >= 0 && num < 10 ? "0" + num : num + "";
}


module.exports.getMarcaciones = getMarcaciones;
module.exports.postMarcaciones = postMarcaciones;
module.exports.postAlertas = postAlertas;
module.exports.informeExcel = informeExcel;
