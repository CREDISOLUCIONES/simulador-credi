function calcularAmortizacion() {
  const monto = Number(document.getElementById("monto").value);
  const plazo = Number(document.getElementById("plazo").value);
  const tasa = 0.0187;

  if (!monto || plazo < 1 || plazo > 8) {
    alert("Verifique monto y plazo (1 a 8 quincenas)");
    return;
  }

  let admin = monto <= 499999 ? 119990 :
              monto <= 999999 ? 149990 :
              monto <= 5000000 ? 179990 : null;

  if (!admin) {
    alert("Monto máximo permitido $5.000.000");
    return;
  }

  const montoCredito = monto + admin;
  const cuota = (montoCredito * tasa) / (1 - Math.pow(1 + tasa, -plazo));

  let resumenHTML = `
    <h3>Resumen del Crédito</h3>
    <p>Monto solicitado: <strong>$${monto.toLocaleString()}</strong></p>
    <p>Cuota administración: <strong>$${admin.toLocaleString()}</strong></p>
    <p>Monto total crédito: <strong>$${montoCredito.toLocaleString()}</strong></p>
    <p>Plazo: <strong>${plazo} quincenas</strong></p>
    <p>Cuota quincenal: <strong>$${cuota.toFixed(0).toLocaleString()}</strong></p>
  `;

  document.getElementById("resumen").innerHTML = resumenHTML;
  document.getElementById("resumen").style.display = "block";

  let tabla = `
    <h3>Tabla de Amortización</h3>
    <table>
      <tr>
        <th>Cuota</th>
        <th>Fecha de pago</th>
        <th>Saldo inicial</th>
        <th>Interés</th>
        <th>Abono capital</th>
        <th>Cuota</th>
        <th>Saldo final</th>
      </tr>
  `;

  let saldo = montoCredito;
  let fecha = new Date();

  for (let i = 1; i <= plazo; i++) {
    let interes = saldo * tasa;
    let abono = cuota - interes;
    let saldoFinal = saldo - abono;

    let dia = fecha.getDate() <= 15 ? 15 : 30;
    fecha.setDate(dia);
    let fechaPago = fecha.toLocaleDateString("es-CO");

    fecha.setDate(dia === 15 ? 30 : 15);
    if (dia === 30) fecha.setMonth(fecha.getMonth() + 1);

    tabla += `
      <tr>
        <td>${i}</td>
        <td>${fechaPago}</td>
        <td>$${saldo.toFixed(0).toLocaleString()}</td>
        <td>$${interes.toFixed(0).toLocaleString()}</td>
        <td>$${abono.toFixed(0).toLocaleString()}</td>
        <td>$${cuota.toFixed(0).toLocaleString()}</td>
        <td>$${saldoFinal.toFixed(0).toLocaleString()}</td>
      </tr>
    `;

    saldo = saldoFinal;
  }

  tabla += `</table>`;
  document.getElementById("tablaAmortizacion").innerHTML = tabla;
  document.getElementById("tablaAmortizacion").style.display = "block";
}

/* PDF */
function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Simulación de Crédito - CREDISOLUCIONES", 14, 15);
  doc.text(document.getElementById("resumen").innerText, 14, 30);

  doc.save("Simulacion_Credito_Credisoluciones.pdf");
}



