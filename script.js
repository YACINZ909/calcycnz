const modules = [
    { name: "Algo", coef: 5, hasTP: true, hasTD: true },
    { name: "Algèbre", coef: 3, hasTP: false, hasTD: true },
    { name: "Analyse", coef: 5, hasTP: false, hasTD: true },
    { name: "STRM", coef: 4, hasTP: false, hasTD: true },
    { name: "Français", coef: 2, hasTP: false, hasTD: false },
    { name: "Bureautique", coef: 2, hasTP: false, hasTD: false },
    { name: "Physique", coef: 2, hasTP: false, hasTD: true },
    { name: "SE", coef: 3, hasTP: true, hasTD: false } // ✅ إضافة SE مع TP و Exam
];

const container = document.getElementById("modulesContainer");

// 🔹 إنشاء الحقول ديناميكيًا
modules.forEach((module, index) => {
    let html = `<div class="module">
        <h3>${module.name} (Coef: ${module.coef}) - <span id="avg${index}">--</span>/20</h3>`;

    if (module.hasTP) {
        html += `<label>TP: <input type="number" min="0" max="20" id="tp${index}"></label>`;
    }
    if (module.hasTD) {
        html += `<label>TD: <input type="number" min="0" max="20" id="td${index}"></label>`;
    }
    html += `<label>Exam: <input type="number" min="0" max="20" id="exam${index}"></label>`;

    html += `</div>`;
    container.innerHTML += html;
});

// 🔥 حساب المعدلات
function calculateAverages() {
    let totalWeightedSum = 0;
    let totalCoef = 0;

    modules.forEach((module, index) => {
        let tp = module.hasTP ? parseFloat(document.getElementById(`tp${index}`).value) || 0 : 0;
        let td = module.hasTD ? parseFloat(document.getElementById(`td${index}`).value) || 0 : 0;
        let exam = parseFloat(document.getElementById(`exam${index}`).value) || 0;

        let moduleAverage;
        if (module.hasTP && module.hasTD) {
            moduleAverage = (tp * 0.2) + (td * 0.2) + (exam * 0.6);
        } else if (module.hasTP) {
            moduleAverage = (tp * 0.4) + (exam * 0.6);
        } else if (module.hasTD) {
            moduleAverage = (td * 0.4) + (exam * 0.6);
        } else {
            moduleAverage = exam;
        }

        totalWeightedSum += moduleAverage * module.coef;
        totalCoef += module.coef;

        // 🔹 تحديث معدل المادة في الواجهة
        document.getElementById(`avg${index}`).innerText = moduleAverage.toFixed(2);
    });

    let finalAverage = totalWeightedSum / totalCoef;
    document.getElementById("finalAverage").innerText = `Final Average: ${finalAverage.toFixed(2)} / 20`;
}

// 📜 تحميل كشف النقاط كـ PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let finalAverageText = document.getElementById("finalAverage").innerText;
    let finalAverage = parseFloat(finalAverageText.split(":")[1]);
    let statusText = finalAverage >= 10 ? "✔ ناجح" : "❌ راسب";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("📜 كشف النقاط - Yacinz Calculator", 20, 20);

    doc.setFontSize(14);
    let yPosition = 40;

    modules.forEach((module, index) => {
        let avg = document.getElementById(`avg${index}`).innerText;
        doc.text(`${module.name} (Coef ${module.coef}): ${avg}/20`, 20, yPosition);
        yPosition += 10;
    });

    doc.text(`\n🔹 المعدل العام: ${finalAverage.toFixed(2)}/20`, 20, yPosition + 10);
    doc.text(`🔹 الحالة: ${statusText}`, 20, yPosition + 20);

    doc.save("Bulletin.pdf");
}