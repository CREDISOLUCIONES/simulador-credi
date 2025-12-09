function calcularAmortizacion() {
  const monto = parseFloat(document.getElementById("monto").value);
  const plazo = parseInt(document.getElementById("plazo").value);
  const tasa = 0.018; // 1.80% quincenal

  if (isNaN(monto) || isNaN(plazo) || monto <= 0 || plazo < 1 || plazo > 8) {
    alert("Ingrese un monto válido y un plazo entre 1 y 8 quincenas.");
    return;
  }

  // Calcular cuota de administración según rangos actualizados
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

  // Mostrar resumen
  const resumen = `
    <h3>Resumen del Crédito</h3>
    <p><strong>Monto solicitado:</strong> $${monto.toLocaleString()}</p>
    <p><strong>Cuota de administración:</strong> $${administracion.toLocaleString()}</p>
    <p><strong>Plazo:</strong> ${plazo} quincenas</p>
    <p><strong>Monto total del crédito:</strong> $${montoCredito.toLocaleString()}</p>
    <p><strong>Tasa quincenal:</strong> 1.80%</p>
    <p><strong>Cuota fija quincenal:</strong> $${cuota.toFixed(0).toLocaleString()}</p>
    <p><strong>Total a pagar:</strong> $${(cuota * plazo).toFixed(0).toLocaleString()}</p>
  `;
  document.getElementById("resumen").innerHTML = resumen;
  document.getElementById("resumen").style.display = "block";

  // Generar tabla de amortización
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

    // Calcular fecha quincenal (15 o 30)
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
}

function calcularPrestaciones() {
  const salario = Number(document.getElementById("salario").value);
  const fechaIngreso = new Date(document.getElementById("fechaIngreso").value);
  const fechaCorte = new Date(document.getElementById("fechaCorte").value);
  const porcentaje = Number(document.getElementById("porcentaje").value) / 100;

  if (!fechaIngreso || !fechaCorte || fechaIngreso >= fechaCorte) {
    alert("Verifica correctamente las fechas");
    return;
  }

  const dias =
    Math.floor((fechaCorte - fechaIngreso) / (1000 * 60 * 60 * 24));

  const cesantias = salario * dias / 360;
  const intereses = cesantias * 0.12 * dias / 360;
  const prima = salario * dias / 360;
  const vacaciones = salario * dias / 720;

  const totalPrestacional =
    cesantias + intereses + prima + vacaciones;

  const montoBase = totalPrestacional * porcentaje;

  document.getElementById("`
<div class="result-grid">
  <div><strong>Días trabajados</strong><span>${dias}</span></div>
  <div><strong>Cesantías</strong><span>$${cesantias.toLocaleString()}</span></div>
  <div><strong>Intereses cesantías</strong><span>$${intereses.toLocaleString()}</span></div>
  <div><strong>Prima</strong><span>$${prima.toLocaleString()}</span></div>
  <div><strong>Vacaciones</strong><span>$${vacaciones.toLocaleString()}</span></div>
</div>

<div class="highlight">
  <p>Total prestacional</p>
  <h2>$${totalPrestacional.toLocaleString()}</h2>
</div>

<div class="highlight success">
  <p>Monto base máximo para crédito</p>
  <h2>$${montoBase.toLocaleString()}</h2>
</div>

<small>*Valores informativos sujetos a validación final*</small>
`
").innerHTML = `
    <p><strong>Días trabajados:</strong> ${dias}</p>
    <p>Cesantías: $${cesantias.toLocaleString()}</p>
    <p>Intereses cesantías: $${intereses.toLocaleString()}</p>
    <p>Prima: $${prima.toLocaleString()}</p>
    <p>Vacaciones: $${vacaciones.toLocaleString()}</p>
    <hr />
    <h4>Total prestacional: $${totalPrestacional.toLocaleString()}</h4>
    <h3>Monto base para crédito: $${montoBase.toLocaleString()}</h3>
    <small>*Valores informativos sujetos a validación*</small>
  `;
}
document.getElementById("fechaCorte").valueAsDate = new Date();


