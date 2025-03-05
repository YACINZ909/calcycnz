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
    let doc = new jsPDF();

    let studentName = document.getElementById("studentName").value || "Unknown Student";
    doc.setFontSize(16);
    doc.text(`Report Card: ${studentName}`, 20, 20);

    let y = 40;
    doc.setFontSize(12);
    doc.text("Module     |  TP  |  TD  |  Exam  |  Average", 20, y);
    doc.setFontSize(10);

    modules.forEach((module, index) => {
        y += 10;
        let tp = module.hasTP ? (document.getElementById(`tp${index}`).value || "--") : "--";
        let td = module.hasTD ? (document.getElementById(`td${index}`).value || "--") : "--";
        let exam = document.getElementById(`exam${index}`).value || "--";
        let avg = document.getElementById(`avg${index}`).innerText;

        doc.text(`${module.name.padEnd(10)} |  ${tp}  |  ${td}  |  ${exam}  |  ${avg}`, 20, y);
    });

    let finalAvg = document.getElementById("finalAverage").innerText;
    doc.text(finalAvg, 20, y + 20);
    
    doc.save(`${studentName}_Report.pdf`);
}
