const modules = [
    { name: "Algo", coef: 5, hasTP: true, hasTD: true },
    { name: "Algèbre", coef: 3, hasTP: false, hasTD: true },
    { name: "Analyse", coef: 5, hasTP: false, hasTD: true },
    { name: "STRM", coef: 4, hasTP: false, hasTD: true },
    { name: "Français", coef: 1, hasTP: false, hasTD: false },
    { name: "Bureautique", coef: 2, hasTP: false, hasTD: false },
    { name: "Physique", coef: 2, hasTP: false, hasTD: true },
    { name: "SE", coef: 3, hasTP: true, hasTD: false }
];

const container = document.getElementById("modulesContainer");

// Generate input fields dynamically
modules.forEach((module, index) => {
    let html = `<div class="module">
        <h3>${module.name} (Coef: ${module.coef}) - <span id="avg${index}">--</span></h3>
        ${module.hasTP ? `<label>TP: <input type="number" min="0" max="20" id="tp${index}"></label>` : ""}
        ${module.hasTD ? `<label>TD: <input type="number" min="0" max="20" id="td${index}"></label>` : ""}
        <label>Exam: <input type="number" min="0" max="20" id="exam${index}"></label>
    </div>`;
    container.innerHTML += html;
});

function calculateAverages() {
    let totalWeightedSum = 0, totalCoef = 0;

    modules.forEach((module, index) => {
        let tp = module.hasTP ? parseFloat(document.getElementById(`tp${index}`).value) || 0 : 0;
        let td = module.hasTD ? parseFloat(document.getElementById(`td${index}`).value) || 0 : 0;
        let exam = parseFloat(document.getElementById(`exam${index}`).value) || 0;

        let moduleAverage = module.hasTP 
            ? (tp * 0.2) + (td * 0.2) + (exam * 0.6) 
            : module.hasTD 
            ? (td * 0.4) + (exam * 0.6) 
            : exam;

        totalWeightedSum += moduleAverage * module.coef;
        totalCoef += module.coef;

        document.getElementById(`avg${index}`).innerText = moduleAverage.toFixed(2);
    });

    let finalAverage = totalWeightedSum / totalCoef;
    document.getElementById("finalAverage").innerText = `Final Average: ${finalAverage.toFixed(2)} / 20`;
}


function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // Get student name
    let studentName = document.getElementById("studentName").value || "Unknown Student";

    // Set background color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, "F");

    // Header: Student Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 122, 255);
    doc.setFillColor(0, 122, 255);
    doc.roundedRect(20, 15, 170, 12, 4, 4, "F");
    doc.setTextColor(255);
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
    doc.setFillColor(0, 122, 255);
    doc.setTextColor(255);
    doc.roundedRect(20, y, 170, 10, 4, 4, "F");
    doc.text("Module", 25, y + 7);
    doc.text("Coef", 75, y + 7);
    doc.text("TP", 95, y + 7);
    doc.text("TD", 115, y + 7);
    doc.text("Exam", 135, y + 7);
    doc.text("Average", 155, y + 7);

    // Table Rows (Modules)
    y += 12;
    doc.setFontSize(10);
    doc.setTextColor(0);

    // Updated module names
    const updatedModules = [
        { name: "Algorithme", coef: 5, hasTP: true, hasTD: true },
        { name: "Algèbre", coef: 3, hasTP: false, hasTD: true },
        { name: "Analyse", coef: 5, hasTP: false, hasTD: true },
        { name: "Structure Machine", coef: 4, hasTP: false, hasTD: true },
        { name: "Français", coef: 2, hasTP: false, hasTD: false },
        { name: "Bureautique", coef: 2, hasTP: false, hasTD: false },
        { name: "Mécanique des Points", coef: 2, hasTP: false, hasTD: true },
        { name: "Système d'Exploitation", coef: 3, hasTP: true, hasTD: true }
    ];

    updatedModules.forEach((module, index) => {
        let tp = module.hasTP ? (document.getElementById(`tp${index}`).value || "--") : "--";
        let td = module.hasTD ? (document.getElementById(`td${index}`).value || "--") : "--";
        let exam = document.getElementById(`exam${index}`).value || "--";
        let avg = document.getElementById(`avg${index}`).innerText;

        // Drawing the table row with rounded corners for each module
        doc.roundedRect(20, y, 170, 8, 4, 4);
        doc.text(module.name, 25, y + 5);
        doc.text(module.coef.toString(), 80, y + 5);
        doc.text(tp, 100, y + 5);
        doc.text(td, 120, y + 5);
        doc.text(exam, 140, y + 5);
        doc.text(avg, 160, y + 5);

        y += 10; // Increase row height for a taller table
    });

    // Final Average Section (Centered with Green/Red color)
    let finalAverage = (parseFloat(document.getElementById("finalAverage").innerText.split(": ")[1]) || 0).toFixed(2);
    let status = finalAverage < 10 ? "❌ Failed" : "✅ Passed";
    
    doc.setFontSize(12);
    doc.setTextColor(finalAverage < 10 ? 255 : 0, finalAverage < 10 ? 0 : 0, finalAverage < 10 ? 0 : 0); // Red for Failed
    doc.roundedRect(20, y, 170, 15, 4, 4, "S"); // Final Average Box
    doc.text(`Final Average: ${finalAverage} / 20`, 105, y + 10, null, null, "center");

    y += 18; // Space between final average and status

    doc.setFontSize(12);
    doc.setTextColor(finalAverage < 10 ? 255 : 0, finalAverage < 10 ? 0 : 0, finalAverage < 10 ? 0 : 0); // Red for Failed
    doc.roundedRect(20, y, 170, 15, 4, 4, "S"); // Status Box
    doc.text(`Status: ${status}`, 105, y + 10, null, null, "center");

    // Save the PDF
    doc.save("grades_report.pdf");
}
