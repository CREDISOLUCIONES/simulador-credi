function obtenerFechaQuincenal(fechaBase, numeroCuota) {
  const fechaPago = obtenerFechaQuincenal(new Date(), i)
  .toLocaleDateString("es-CO");
  const esPrimeraQuincena = fecha.getDate() <= 15;

  let dia;
  let mes = fecha.getMonth();
  let anio = fecha.getFullYear();

  if (esPrimeraQuincena) {
    dia = numeroCuota % 2 === 1 ? 15 : 30;
  } else {
    dia = numeroCuota % 2 === 1 ? 30 : 15;
    if (dia === 15) mes++;
  }

  return new Date(anio, mes, dia);
}
function calcularFechaPago(numeroCuota) {
  const hoy = new Date();
  let dia = hoy.getDate();
  let mes = hoy.getMonth();
  let anio = hoy.getFullYear();

  if (dia <= 15) {
    dia = numeroCuota % 2 === 1 ? 15 : 30;
  } else {
    dia = numeroCuota % 2 === 1 ? 30 : 15;
    if (dia === 15) mes++;
  }

  return new Date(anio, mes, dia);
}

function calcularAmortizacion() {
  const monto = parseFloat(document.getElementById("monto").value);
  const plazo = parseInt(document.getElementById("plazo").value);
  const tasa = 0.018; // 1.80% quincenal

  if (isNaN(monto) || isNaN(plazo) || monto <= 0 || plazo < 1 || plazo > 8) {
    alert("Ingrese un monto válido y un plazo entre 1 y 8 quincenas.");
    return;
  }

  // Cuota de administración según monto
  let administracion = 0;
  if (monto <= 499999) {
    administracion = 119990;
  } else if (monto <= 999999) {
    administracion = 149990;
  } else if (monto <= 5000000) {
    administracion = 179990;
  } else {
    alert("El monto máximo permitido es $5.000.000");
    return;
  }

  const montoCredito = monto + administracion;

  // Cuota fija
  const cuota = (montoCredito * tasa) / (1 - Math.pow(1 + tasa, -plazo));

  // Resumen
  const resumenHTML = `
    <h3>Resumen del Crédito</h3>
    <p><strong>Monto solicitado:</strong> $${monto.toLocaleString()}</p>
    <p><strong>Cuota de administración:</strong> $${administracion.toLocaleString()}</p>
    <p><strong>Plazo:</strong> ${plazo} quincenas</p>
    <p><strong>Tasa quincenal:</strong> 1.80%</p>
    <p><strong>Cuota quincenal:</strong> $${cuota.toFixed(0).toLocaleString()}</p>
    <p><strong>Total a pagar:</strong> $${(cuota * plazo).toFixed(0).toLocaleString()}</p>
  `;

  const resumen = document.getElementById("resumen");
  resumen.innerHTML = resumenHTML;
  resumen.style.display = "block";

  // Tabla de amortización
  let tabla = `
    <h3>Tabla de Amortización</h3>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr>
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

  for (let i = 1; i <= plazo; i++) {
  const interes = saldo * tasa;
  const abonoCapital = cuota - interes;
  const saldoFinal = saldo - abonoCapital;

  const fechaPago = calcularFechaPago(i)
    .toLocaleDateString("es-CO");

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
}

  }

  tabla += `</table>`;

  const tablaDiv = document.getElementById("tablaAmortizacion");
  tablaDiv.innerHTML = tabla;
  tablaDiv.style.display = "block";
}





