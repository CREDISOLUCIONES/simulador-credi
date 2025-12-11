function simular() {

    let monto = parseFloat(document.getElementById("monto").value);
    let interes = parseFloat(document.getElementById("interes").value) / 100; // 1.87% por defecto ya viene en el HTML
    let meses = parseInt(document.getElementById("meses").value);

    let cuota = (monto * interes) / (1 - Math.pow(1 + interes, -meses));
    let saldo = monto;

    let totalIntereses = 0;

    let tbody = document.querySelector("#tabla tbody");
    tbody.innerHTML = "";

    for (let i = 1; i <= meses; i++) {
        let interesPago = saldo * interes;
        let abono = cuota - interesPago;
        saldo -= abono;

        totalIntereses += interesPago;

        tbody.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${cuota.toFixed(0)}</td>
                <td>${interesPago.toFixed(0)}</td>
                <td>${abono.toFixed(0)}</td>
                <td>${saldo.toFixed(0)}</td>
            </tr>
        `;
    }

    document.getElementById("cuota").innerText = cuota.toFixed(0);
    document.getElementById("totalIntereses").innerText = totalIntereses.toFixed(0);
    document.getElementById("totalPagar").innerText = (monto + totalIntereses).toFixed(0);

    document.getElementById("resultados").style.display = "block";
    document.getElementById("tablaBox").style.display = "block";
}

function enviarWhatsApp() {
    let cuota = document.getElementById("cuota").innerText;
    let intereses = document.getElementById("totalIntereses").innerText;
    let total = document.getElementById("totalPagar").innerText;

    let mensaje = `Simulación de crédito:%0A
Cuota mensual: ${cuota}%0A
Total intereses: ${intereses}%0A
Total a pagar: ${total}`;

    window.open(`https://wa.me/?text=${mensaje}`, "_blank");
}





