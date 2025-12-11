function calcularAmortizacion() {
  const monto = parseFloat(document.getElementById("monto").value);
  const plazo = parseInt(document.getElementById("plazo").value);

  // ⭐⭐⭐ CAMBIAS SOLO ESTA LÍNEA CADA MES ⭐⭐⭐
  const tasa = 0.0187; // 1.87% quincenal

  if (isNaN(monto) || isNaN(plazo) || monto <= 0 || plazo < 1 || plazo > 8) {
    alert("Ingrese un monto válido y un plazo entre 1 y 8 quincenas.");
    return;
  }

  // Cuotas de administración por rangos
  let administracion = 0;
  if (monto <= 499999) administracion = 119990;
  else if (monto <= 999999) administracion = 149990;
  else if (monto <= 5000000) administracion = 179990;
  else {
    alert("El monto solicitado excede el máximo permitido.");
    return;
  }

  const montoCredito = monto + administracion;

  // Cuota fija fórmula
  const cuota = (montoCredito * tasa) / (1 - Math.pow(1 + tasa, -plazo));

  // ---- CALCULO TOTAL INTERESES ----
  let saldoTemp = montoCredito;
  let interesesTotales = 0;

  for (let i = 0; i < plazo; i++) {
    const interes = saldoTemp * tasa;
    const abono = cuota - interes;
    saldoTemp -= abono;
    interesesTotales += interes;
  }

  const montoTotalCreditoFinal = montoCredito + interesesTotales;

  // === RESUMEN CON FORMATO DE MILES ===
  let resumen = `
    <h3>Resumen del Crédito</h3>
    <p><strong>Monto solicitado:</strong> $${monto.toLocaleString("es-CO")}</p>
    <p><strong>Cuota administración:</strong> $${administracion.toLocaleString("es-CO")}</p>
    <p><strong>Plazo:</strong> ${plazo} quincenas</p>
    <p><strong>Monto total crédito:</strong> $${Math.round(montoTotalCreditoFinal).toLocaleString("es-CO")}</p>
    <p><strong>Tasa quincenal:</strong> ${(tasa * 100).toFixed(2)}%</p>
    <p><strong>Cuota fija:</strong> $${Math.round(cuota).toLocaleString("es-CO")}</p>
  `;

  document.getElementById("resumen").innerHTML = resumen;
  document.getElementById("resumen").style.display = "block";

  // === TABLA DE AMORTIZACIÓN ===
  let tabla = `
    <h3>Tabla de Amortización</h3>
    <table>
      <tr>
        <th>Fecha de Pago</th>
        <th>Cuota</th>
        <th>Saldo Inicial</th>
        <th>Interés</th>
        <th>Abono Capital</th>
        <th>Cuota</th>
        <th>Saldo Final</th>
      </tr>
  `;

  let saldo = montoCredito;
  let fecha = new Date();

  for (let i = 1; i <= plazo; i++) {
    const interes = saldo * tasa;
    const abono = cuota - interes;
    const saldoFinal = saldo - abono;

    // Fechas quincenales
    const dia = fecha.getDate() <= 15 ? 15 : 30;
    fecha.setDate(dia);
    const fechaPago = fecha.toLocaleDateString("es-CO");

    if (dia === 15) {
      fecha.setDate(30);
    } else {
      fecha.setMonth(fecha.getMonth() + 1);
      fecha.setDate(15);
    }

    tabla += `
      <tr>
        <td>${fechaPago}</td>
        <td>${i}</td>
        <td>$${Math.round(saldo).toLocaleString("es-CO")}</td>
        <td>$${Math.round(interes).toLocaleString("es-CO")}</td>
        <td>$${Math.round(abono).toLocaleString("es-CO")}</td>
        <td>$${Math.round(cuota).toLocaleString("es-CO")}</td>
        <td>$${Math.round(saldoFinal).toLocaleString("es-CO")}</td>
      </tr>
    `;

    saldo = saldoFinal;
  }

  tabla += `</table>`;
  document.getElementById("tablaAmortizacion").innerHTML = tabla;
  document.getElementById("tablaAmortizacion").style.display = "block";
}



/* ========================================================
    ⭐ FUNCIÓN PARA DESCARGAR TODO EN PDF ⭐
======================================================== */
async function descargarPDF() {
  const elemento = document.getElementById("contenedorPDF");

  const opt = {
    margin: 5,
    filename: "simulacion_credito.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  await html2pdf().set(opt).from(elemento).save();
}


