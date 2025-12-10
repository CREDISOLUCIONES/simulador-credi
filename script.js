function calcularAmortizacion() {
  const monto = Number(document.getElementById("monto").value);
  const plazo = Number(document.getElementById("plazo").value);
  const tasa = 0.018;

  if (!monto || plazo < 1 || plazo > 8) {
    alert("Ingrese un monto válido y un plazo entre 1 y 8 quincenas");
    return;
  }

  let admin = monto <= 499999 ? 119990 :
              monto <= 999999 ? 149990 :
              monto <= 5000000 ? 179990 : null;

  if (!admin) {
    alert("Monto máximo permitido: $5.000.000");
    return;
  }

  const montoCredito = monto + admin;
  const cuota = (montoCredito * tasa) / (1 - Math.pow(1 + tasa, -plazo));

  document.getElementById("resumen").innerHTML = `
    <h3 style="color:#00a9b7;">Resumen del Crédito</h3>
    <p><strong>Monto solicitado:</strong> $${monto.toLocaleString()}</p>
    <p><strong>Administración:</strong> $${admin.toLocaleString()}</p>
    <p><strong>Monto total:</strong> $${montoCredito.toLocaleString()}</p>
    <p><strong>Plazo:</strong> ${plazo} quincenas</p>
    <p><strong>Cuota quincenal:</strong> $${cuota.toFixed(0).toLocaleString()}</p>
  `;
  document.getElementById("resumen").style.display = "block";

  let tabla = `
    <h3 style="color:#00a9b7;">Tabla de Amortización</h3>
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

function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Simulación de Crédito - CREDISOLUCIONES", 14, 20);
  doc.text(document.getElementById("resumen").innerText, 14, 35);
  doc.save("Simulacion_Credito.pdf");
}
