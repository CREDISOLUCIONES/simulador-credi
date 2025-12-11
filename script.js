function calcularAmortizacion() {
  const monto = parseFloat(document.getElementById("monto").value);
  const plazo = parseInt(document.getElementById("plazo").value);
  const tasa = 0.018; // 1.80% quincenal

  if (isNaN(monto) || isNaN(plazo) || monto <= 0 || plazo < 1 || plazo > 8) {
    alert("Ingrese un monto válido y un plazo entre 1 y 8 quincenas.");
    return;
  }

  // Calcular cuota de administración
  let administracion = 0;
  if (monto <= 499999) {
    administracion = 119990;
  } else if (monto <= 999999) {
    administracion = 149990;
  } else if (monto <= 5000000) {
    administracion = 179990;
  } else {
    alert("El monto solicitado excede el límite permitido (máx. $5.000.000).");
    return;
  }

  const montoCredito = monto + administracion;

  // Calcular cuota fija
  const cuota = (montoCredito * tasa) / (1 - Math.pow(1 + tasa, -plazo));

  // ---------------------------------------------
  //  SUMATORIA DE INTERESES REALES (CORREGIDO)
  // ---------------------------------------------
  let totalIntereses = 0;

  // ---------------------------------------------
  //  TABLA DE AMORTIZACIÓN
  // ---------------------------------------------
  let tabla = `
    <h3>Tabla de Amortización</h3>
    <table>
      <tr>
        <th>Fecha</th>
        <th>Quincena</th>
        <th>Saldo Inicial</th>
        <th>Cuota</th>
        <th>Interés</th>
        <th>Abono a Capital</th>
        <th>Saldo Final</th>
      </tr>
  `;

  let saldo = montoCredito;
  let fecha = new Date();

  for (let i = 1; i <= plazo; i++) {
    const interes = saldo * tasa;
    const abonoCapital = cuota - interes;
    const saldoFinal = saldo - abonoCapital;

    // Acumular intereses reales
    totalIntereses += interes;

    // Calcular fecha quincenal (15/30)
    const dia = fecha.getDate() <= 15 ? 15 : 30;
    fecha.setDate(dia);
    const fechaPago = fecha.toLocaleDateString('es-CO');

    if (dia === 15) fecha.setDate(30);
    else {
      fecha.setMonth(fecha.getMonth() + 1);
      fecha.setDate(15);
    }

    tabla += `
      <tr>
        <td>${fechaPago}</td>
        <td>${i}</td>
        <td>$${saldo.toFixed(0).toLocaleString()}</td>
        <td>$${cuota.toFixed(0).toLocaleString()}</td>
        <td>$${interes.toFixed(0).toLocaleString()}</td>
        <td>$${abonoCapital.toFixed(0).toLocaleString()}</td>
        <td>$${saldoFinal.toFixed(0).toLocaleString()}</td>
      </tr>
    `;

    saldo = saldoFinal;
  }

  tabla += `</table>`;
  document.getElementById("tablaAmortizacion").innerHTML = tabla;
  document.getElementById("tablaAmortizacion").style.display = "block";

  // ---------------------------------------------
  //  RESUMEN CORREGIDO CON INTERESES REALES
  // ---------------------------------------------
  const resumen = `
    <h3>Resumen del Crédito</h3>

    <p><strong>Monto solicitado:</strong> $${monto.toLocaleString()}</p>
    <p><strong>Cuota de administración:</strong> $${administracion.toLocaleString()}</p>
    <p><strong>Plazo:</strong> ${plazo} quincenas</p>
    <p><strong>Monto total del crédito:</strong> $${montoCredito.toLocaleString()}</p>

    <p><strong>Intereses totales:</strong> $${totalIntereses.toFixed(0).toLocaleString()}</p>

    <p><strong>Total a pagar:</strong> 
      $${(montoCredito + totalIntereses).toFixed(0).toLocaleString()}
    </p>
  `;

  document.getElementById("resumen").innerHTML = resumen;
  document.getElementById("resumen").style.display = "block";
}


