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
const studentNameInput = document.getElementById("studentName");

function saveNotes() {
    let grades = [];

    modules.forEach((module, index) => {
        let tp = module.hasTP ? parseFloat(document.getElementById(`tp${index}`).value) || 0 : 0;
        let td = module.hasTD ? parseFloat(document.getElementById(`td${index}`).value) || 0 : 0;
        let exam = parseFloat(document.getElementById(`exam${index}`).value) || 0;
        
        grades.push({ 
            name: module.name,
            tp: tp,
            td: td,
            exam: exam
        });
    });

    let studentName = studentNameInput.value || "Unknown Student";
    localStorage.setItem("grades", JSON.stringify(grades));
    localStorage.setItem("studentName", studentName);
    alert("Data saved successfully!");
}

function loadNotes() {
    const savedGrades = localStorage.getItem("grades");
    const savedStudentName = localStorage.getItem("studentName");

    if (savedGrades && savedStudentName) {
        const grades = JSON.parse(savedGrades);
        studentNameInput.value = savedStudentName;

        grades.forEach((grade, index) => {
            if (modules[index].hasTP) {
                document.getElementById(`tp${index}`).value = grade.tp;
            }
            if (modules[index].hasTD) {
                document.getElementById(`td${index}`).value = grade.td;
            }
            document.getElementById(`exam${index}`).value = grade.exam;
        });
        alert("Notes loaded from storage!");
    }
}

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
    let status = finalAverage < 10 ? "❌ Failed" : "✅ Passed";

    document.getElementById("finalAverage").innerText = `Final Average: ${finalAverage.toFixed(2)} / 20 (${status})`;
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    let studentName = document.getElementById("studentName").value || "Unknown Student";

    // Background Color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, "F");

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 122, 255);
    doc.text("Université de Bejaia", 105, 20, null, null, "center");

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Spécialité: Computer Science", 105, 30, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Student Name: ${studentName}`, 20, 40);

    // Table Header
    let y = 55;
    doc.setFontSize(12);
    doc.setFillColor(0, 122, 255);
    doc.setTextColor(255);
    doc.roundedRect(20, y, 170, 10, 2, 2, "F"); // Rounded borders
    doc.text("Module", 25, y + 7);
    doc.text("Coef", 75, y + 7);
    doc.text("TP", 95, y + 7);
    doc.text("TD", 115, y + 7);
    doc.text("Exam", 135, y + 7);
    doc.text("Average", 155, y + 7);

    // Table Rows
    y += 12;
    doc.setFontSize(10);
    doc.setTextColor(0);

    modules.forEach((module, index) => {
        let tp = module.hasTP ? (document.getElementById(`tp${index}`).value || "--") : "--";
        let td = module.hasTD ? (document.getElementById(`td${index}`).value || "--") : "--";
        let exam = document.getElementById(`exam${index}`).value || "--";
        let avg = document.getElementById(`avg${index}`).innerText;

        doc.roundedRect(20, y, 170, 8, 2, 2);
        doc.text(module.name, 25, y + 5);
        doc.text(module.coef.toString(), 80, y + 5);
        doc.text(tp, 100, y + 5);
        doc.text(td, 120, y + 5);
        doc.text(exam, 140, y + 5);
        doc.text(avg, 160, y + 5);

        y += 9;
    });

    // Final Average
    let finalAverage = parseFloat(document.getElementById("finalAverage").innerText.split(": ")[1]);
    let status = finalAverage < 10 ? "❌ Failed" : "✅ Passed";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setFillColor(finalAverage < 10 ? 255, 0, 0 : 0, 200, 0);
    doc.setTextColor(255);
    doc.roundedRect(20, y, 170, 10, 3, 3, "F");
    doc.text(`Final Average: ${finalAverage.toFixed(2)} / 20 (${status})`, 25, y + 7);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Generated by Yacinz Calculator", 105, 280, null, null, "center");

    doc.save(`${studentName}_Report.pdf`);
}

// Load notes on page load
window.onload = function() {
    loadNotes();
};
