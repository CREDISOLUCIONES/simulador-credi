function calcularAmortizacion() {
  const monto = Number(document.getElementById("monto").value);
  const plazo = Number(document.getElementById("plazo").value);
  const tasa = 0.018;

  if (!monto || plazo < 1 || plazo > 8) {
    alert("Ingrese un monto válido y un plazo entre 1 y 8 quincenas.");
    return;
  }

  let administracion = 0;
  if (monto <= 499999) administracion = 119990;
  else if (monto <= 999999) administracion = 149990;
  else if (monto <= 5000000) administracion = 179990;
  else {
    alert("Monto máximo permitido $5.000.000");
    return;
  }

  const montoCredito = monto + administracion;
  const cuota = (montoCredito * tasa) / (1 - Math.pow(1 + tasa, -plazo));

  document.getElementById("resumen").innerHTML = `
    <h3>Resumen del Crédito</h3>
    <div class="resumen-grid">
      <div class="resumen-item"><strong>Monto solicitado</strong><span>$${monto.toLocaleString()}</span></div>
      <div class="resumen-item"><strong>Administración</strong><span>$${administracion.toLocaleString()}</span></div>
      <div class="resumen-item"><strong>Plazo</strong><span>${plazo} quincenas</span></div>
      <div class="resumen-item"><strong>Tasa</strong><span>1.80%</span></div>
      <div class="resumen-item resumen-highlight"><strong>Cuota quincenal</strong><span>$${cuota.toFixed(0).toLocaleString()}</span></div>
    </div>
  `;
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
  let dia = fecha.getDate() <= 15 ? 15 : 30;
  fecha.setDate(dia);

  for (let i = 1; i <= plazo; i++) {
    const interes = saldo * tasa;
    const abonoCapital = cuota - interes;
    const saldoFinal = saldo - abonoCapital;

    tabla += `
      <tr>
        <td>${i}</td>
        <td>${fecha.toLocaleDateString("es-CO")}</td>
        <td>$${saldo.toFixed(0).toLocaleString()}</td>
        <td>$${interes.toFixed(0).toLocaleString()}</td>
        <td>$${abonoCapital.toFixed(0).toLocaleString()}</td>
        <td>$${cuota.toFixed(0).toLocaleString()}</td>
        <td>$${saldoFinal.toFixed(0).toLocaleString()}</td>
      </tr>
    `;

    saldo = saldoFinal;

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








