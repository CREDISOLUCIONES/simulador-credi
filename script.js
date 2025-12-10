function calcularAmortizacion() {
  const monto = Number(document.getElementById("monto").value);
  const plazo = Number(document.getElementById("plazo").value);
  const tasa = 0.018; // 1.8% quincenal

  if (!monto || plazo < 1 || plazo > 8) {
    alert("Ingrese un monto válido y un plazo entre 1 y 8.");
    return;
  }

  // Cuota de administración
  let administracion = 0;
  if (monto <= 499999) administracion = 119990;
  else if (monto <= 999999) administracion = 149990;
  else if (monto <= 5000000) administracion = 179990;
  else {
    alert("Monto máximo permitido $5.000.000");
    return;
  }

  const montoCredito = monto + administracion;

  const cuota =
    (montoCredito * tasa) /
    (1 - Math.pow(1 + tasa, -plazo));

  // ---------- RESUMEN ----------
  document.getElementById("resumen").innerHTML = `
    <h3>Resumen del Crédito</h3>
    <p><strong>Monto solicitado:</strong> $${monto.toLocaleString()}</p>
    <p><strong>Administración:</strong> $${administracion.toLocaleString()}</p>
    <p><strong>Plazo:</strong> ${plazo} quincenas</p>
    <p><strong>Cuota quincenal:</strong> $${cuota.toFixed(0).toLocaleString()}</p>
    <p><strong>Total a pagar:</strong> $${(cuota * plazo).toFixed(0).toLocaleString()}</p>
  `;
  document.getElementById("resumen").style.display = "block";

  // ---------- TABLA ----------
  let tabla = `
    <h3>Tabla de Amortización</h3>
    <table>
      <tr>
        <th>Cuota</th>
        <th>Fecha de Pago</th>
        <th>Saldo Inicial</th>
        <th>Interés</th>
        <th>Abono Capital</th>
        <th>Cuota</th>
        <th>Saldo Final</th>
      </tr>
  `;

  let saldo = montoCredito;
  let fecha = new Date();
  let dia = fecha.getDate() <= 15 ? 15 : 30;
  fecha.setDate(dia);

  for (let i = 1; i <= plazo; i++) {
    const interes = saldo * tasa;
    const abonoCapital = cuota - interes;
    const saldoFinal = saldo - abonoCapital;

    const fechaPago = fecha.toLocaleDateString("es-CO");

    tabla += `
      <tr>
        <td>${i}</td>
        <td>${fechaPago}</td>
        <td>$${saldo.toFixed(0).toLocaleString()}</td>
        <td>$${interes.toFixed(0).toLocaleString()}</td>
        <td>$${abonoCapital.toFixed(0).toLocaleString()}</td>
        <td>$${cuota.toFixed(0).toLocaleString()}</td>
        <td>$${saldoFinal.toFixed(0).toLocaleString()}</td>
      </tr>
    `;

    saldo = saldoFinal;

    // Avanzar fecha quincenal
    if (dia === 15) {
      dia = 30;
      fecha.setDate(30);
    } else {
      dia = 15;
      fecha.setMonth(fecha.getMonth() + 1);
      fecha.setDate(15);
    }
  }

  tabla += `</table>`;
  document.getElementById("tablaAmortizacion").innerHTML = tabla;
  document.getElementById("tablaAmortizacion").style.display = "block";
}






