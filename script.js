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

    const imgPath = "/mnt/data/18a1b3aa03b9f93dbc00e06e7c7917d6.jpg";
    doc.addImage(imgPath, "JPEG", 0, 0, 210, 297, '', 'FAST'); // Fit image to A4 page

    const studentName = document.getElementById("studentName").value || "Unknown Student";
    const finalAverage = parseFloat(document.getElementById("finalAverage").textContent.split(": ")[1]) || 0;
    const status = finalAverage < 10 ? "❌ Failed" : "✅ Passed";
    const avgColor = finalAverage < 10 ? [255, 100, 100] : [100, 255, 100];

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255);
    doc.text("Université de Bejaia", 105, 20, null, null, "center");

    doc.setFontSize(14);
    doc.text("Spécialité: Computer Science", 105, 30, null, null, "center");

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(studentName, 105, 40, null, null, "center");

    // Table Header
    let y = 50;
    doc.setFontSize(12);
    doc.setFillColor(0, 122, 255); // Bright blue for contrast
    doc.setTextColor(255);
    doc.roundedRect(20, y, 170, 10, 4, 4, "F");
    doc.text("Module", 25, y + 7);
    doc.text("Coef", 85, y + 7);
    doc.text("TP", 105, y + 7);
    doc.text("TD", 125, y + 7);
    doc.text("Exam", 145, y + 7);
    doc.text("Average", 170, y + 7);

    y += 12;
    doc.setFontSize(10);

    // Modules Data
    modules.forEach((module, index) => {
        const tp = module.hasTP ? document.getElementById(`tp${index}`).value || "--" : "--";
        const td = module.hasTD ? document.getElementById(`td${index}`).value || "--" : "--";
        const exam = document.getElementById(`exam${index}`).value || "--";
        const avg = document.getElementById(`avg${index}`).textContent;
        const coef = module.coef.toString();

        const avgValue = parseFloat(avg) || 0;
        const textColor = avgValue < 10 ? [255, 100, 100] : [100, 255, 100];

        doc.setTextColor(255); // White text for readability
        doc.roundedRect(20, y, 170, 8, 4, 4, "S");
        doc.text(module.name, 25, y + 5);
        doc.text(coef, 90, y + 5);
        doc.text(tp, 110, y + 5);
        doc.text(td, 130, y + 5);
        doc.text(exam, 150, y + 5);

        doc.setTextColor(...textColor);
        doc.text(avg, 175, y + 5);

        y += 10;
    });

    // Final Average
    doc.setFontSize(14);
    doc.setTextColor(...avgColor);
    doc.roundedRect(20, y, 170, 15, 4, 4, "S");
    doc.text(`Final Average: ${finalAverage.toFixed(2)} / 20`, 105, y + 10, null, null, "center");

    y += 18;

    doc.setTextColor(...avgColor);
    doc.roundedRect(20, y, 170, 15, 4, 4, "S");
    doc.text(`Status: ${status}`, 105, y + 10, null, null, "center");

    doc.save("grades_report.pdf");
    };
}
// Event Listeners
document.addEventListener("DOMContentLoaded", renderModules);

// Event Listeners
document.addEventListener("DOMContentLoaded", renderModules);
