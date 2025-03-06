const modules = [
    { name: "Algo", coef: 5, hasTP: true, hasTD: true, credit: 6 },
    { name: "Algèbre", coef: 3, hasTP: false, hasTD: true, credit: 5 },
    { name: "Analyse", coef: 5, hasTP: false, hasTD: true, credit: 6 },
    { name: "STRM", coef: 4, hasTP: false, hasTD: true, credit: 5 },
    { name: "Français", coef: 2, hasTP: false, hasTD: false, credit: 3 },
    { name: "Bureautique", coef: 2, hasTP: false, hasTD: false, credit: 3 },
    { name: "Physique", coef: 2, hasTP: false, hasTD: true, credit: 4 },
    { name: "SE", coef: 3, hasTP: true, hasTD: false, credit: 5 }
];

const container = document.getElementById("modulesContainer");

// Generate input fields dynamically
function renderModules() {
    container.innerHTML = modules
        .map(
            (module, index) => `
            <div class="module">
                <h3>${module.name} (Coef: ${module.coef}) - <span id="avg${index}">--</span></h3>
                ${module.hasTP ? `<label>TP: <input type="number" min="0" max="20" id="tp${index}" oninput="validateInput(this)"></label>` : ""}
                ${module.hasTD ? `<label>TD: <input type="number" min="0" max="20" id="td${index}" oninput="validateInput(this)"></label>` : ""}
                <label>Exam: <input type="number" min="0" max="20" id="exam${index}" oninput="validateInput(this)"></label>
            </div>
        `
        )
        .join("");
}

// Validate input fields (prevent negatives)
function validateInput(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 20) input.value = 20;
}

// Calculate module averages and final average
function calculateAverages() {
    let totalWeightedSum = 0,
        totalCoef = 0;

    modules.forEach((module, index) => {
        const tp = module.hasTP ? parseFloat(document.getElementById(`tp${index}`).value) || 0 : 0;
        const td = module.hasTD ? parseFloat(document.getElementById(`td${index}`).value) || 0 : 0;
        const exam = parseFloat(document.getElementById(`exam${index}`).value) || 0;

        const moduleAverage = module.hasTP
            ? tp * 0.2 + td * 0.2 + exam * 0.6
            : module.hasTD
            ? td * 0.4 + exam * 0.6
            : exam;

        totalWeightedSum += moduleAverage * module.coef;
        totalCoef += module.coef;

        document.getElementById(`avg${index}`).textContent = moduleAverage.toFixed(2);
    });

    const finalAverage = totalCoef ? (totalWeightedSum / totalCoef).toFixed(2) : "0.00";
    document.getElementById("finalAverage").textContent = `Final Average: ${finalAverage} / 20`;
}

// Generate and download PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const studentName = document.getElementById("studentName").value || "Unknown Student";
    const finalAverage = parseFloat(document.getElementById("finalAverage").textContent.split(": ")[1]) || 0;
    const status = finalAverage < 10 ? "❌ Failed" : "✅ Passed";
    const avgColor = finalAverage < 10 ? [255, 0, 0] : [0, 150, 0];

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255);
    doc.setFillColor(0, 122, 255);
    doc.roundedRect(20, 15, 170, 12, 4, 4, "F");
    doc.text(studentName, 105, 22, null, null, "center");

    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 122, 255);
    doc.text("Université de Bejaia", 105, 35, null, null, "center");

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Spécialité: Computer Science", 105, 45, null, null, "center");

    // Table Header
    let y = 55;
    doc.setFontSize(12);
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0);
    doc.roundedRect(20, y, 170, 10, 4, 4, "F");
    doc.text("Module", 25, y + 7);
    doc.text("Credit", 75, y + 7);
    doc.text("Coef", 95, y + 7);
    doc.text("TP", 115, y + 7);
    doc.text("TD", 135, y + 7);
    doc.text("Exam", 155, y + 7);
    doc.text("Average", 175, y + 7);

    y += 12;
    doc.setFontSize(10);

    // Modules Data
    modules.forEach((module, index) => {
        const tp = module.hasTP ? document.getElementById(`tp${index}`).value || "--" : "--";
        const td = module.hasTD ? document.getElementById(`td${index}`).value || "--" : "--";
        const exam = document.getElementById(`exam${index}`).value || "--";
        const avg = document.getElementById(`avg${index}`).textContent;
        const coef = module.coef.toString();
        const credit = module.credit.toString();

        const avgValue = parseFloat(avg) || 0;
        const textColor = avgValue < 10 ? [255, 0, 0] : [0, 150, 0];

        doc.setTextColor(0);
        doc.roundedRect(20, y, 170, 8, 4, 4);
        doc.text(module.name, 25, y + 5);
        doc.text(credit, 80, y + 5);
        doc.text(coef, 100, y + 5);
        doc.text(tp, 120, y + 5);
        doc.text(td, 140, y + 5);
        doc.text(exam, 160, y + 5);

        doc.setTextColor(...textColor);
        doc.text(avg, 180, y + 5);

        y += 10;
    });

    // Final Average
    doc.setFontSize(12);
    doc.setTextColor(...avgColor);
    doc.roundedRect(20, y, 170, 15, 4, 4, "S");
    doc.text(`Final Average: ${finalAverage} / 20`, 105, y + 10, null, null, "center");

    y += 18;

    doc.setFontSize(12);
    doc.setTextColor(...avgColor);
    doc.roundedRect(20, y, 170, 15, 4, 4, "S");
    doc.text(`Status: ${status}`, 105, y + 10, null, null, "center");

    doc.save("grades_report.pdf");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", renderModules);
