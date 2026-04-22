const API = "http://localhost:5000/students";

// ADD SUBJECT FIELD
function addSubject(subject = "", teacher = "") {
  const container = document.getElementById("subjectsContainer");

  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" placeholder="Subject" value="${subject}">
    <input type="text" placeholder="Teacher" value="${teacher}">
    <button onclick="this.parentElement.remove()">X</button>
  `;

  container.appendChild(div);
}

// GET SUBJECTS DATA
function getSubjects() {
  const container = document.getElementById("subjectsContainer");
  const rows = container.querySelectorAll("div");

  let subjects = [];

  rows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    subjects.push({
      subject: inputs[0].value,
      teacher: inputs[1].value
    });
  });

  return subjects;
}

// SAVE
async function saveStudent() {
  const student = getFormData();

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  loadStudents();
  clearForm();
}

// UPDATE
async function updateStudent() {
  const id = document.getElementById("studentId").value;
  const student = getFormData();

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  loadStudents();
  clearForm();
}

// DELETE
async function deleteStudent() {
  const id = document.getElementById("studentId").value;

  await fetch(`${API}/${id}`, { method: "DELETE" });

  loadStudents();
  clearForm();
}

// LOAD TABLE
async function loadStudents() {
  const res = await fetch(API);
  const data = await res.json();

  const table = document.getElementById("studentList");
  table.innerHTML = "";

  data.forEach(s => {

    if (s.subjects && s.subjects.length > 0) {

      s.subjects.forEach(sub => {

        const row = document.createElement("tr");
        row.onclick = () => editStudent(s._id);

        row.innerHTML = `
          <td>${s.studentname} ${s.studentlname}</td>
          <td>${s.gradelevel}</td>
          <td>${sub.subject}</td>
          <td>${sub.teacher}</td>
        `;

        table.appendChild(row);
      });

    } else {

      const row = document.createElement("tr");
      row.onclick = () => editStudent(s._id);

      row.innerHTML = `
        <td>${s.studentname} ${s.studentlname}</td>
        <td>${s.gradelevel}</td>
        <td>-</td>
        <td>-</td>
      `;

      table.appendChild(row);
    }

  });
}

// EDIT
async function editStudent(id) {
  const res = await fetch(`${API}/${id}`);
  const s = await res.json();

  document.getElementById("studentId").value = s._id;

  document.getElementById("studentno").value = s.studentno;
  document.getElementById("studentname").value = s.studentname;
  document.getElementById("studentlname").value = s.studentlname;
  document.getElementById("gradelevel").value = s.gradelevel;

  const container = document.getElementById("subjectsContainer");
  container.innerHTML = "";

  (s.subjects || []).forEach(sub => {
    addSubject(sub.subject, sub.teacher);
  });
}

// CLEAR
function clearForm() {
  document.getElementById("studentId").value = "";
  document.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById("subjectsContainer").innerHTML = "";
}

// FORM DATA
function getFormData() {
  return {

    studentno: document.getElementById("studentno").value,
    studentname: document.getElementById("studentname").value,
    studentlname: document.getElementById("studentlname").value,
    gradelevel: document.getElementById("gradelevel").value,
    subjects: getSubjects()
  };
}

function downloadTemplate() {
  const data = [
    {
      studentno: "2024-001",
      studentname: "Juan",
      studentlname: "Dela Cruz",
      gradelevel: "Grade 5",
      subject: "Math",
      teacher: "Mr. Cruz"
    },
    {
      studentno: "2024-001",
      studentname: "Juan",
      studentlname: "Dela Cruz",
      gradelevel: "Grade 5",
      subject: "English",
      teacher: "Ms. Lee"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Template");

  XLSX.writeFile(wb, "student_template.xlsx");
}

//const API = "http://localhost:5000/students";

async function handleExcelUpload() {
  const file = document.getElementById("excelFile").files[0];

  if (!file) {
    alert("Please select an Excel file");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // ✅ GROUP BY STUDENT NUMBER
    const grouped = {};

    rows.forEach(row => {
      const key = row.studentno;

      if (!grouped[key]) {
        grouped[key] = {
          studentno: row.studentno,
          studentname: row.studentname,
          studentlname: row.studentlname,
          gradelevel: row.gradelevel,
          subjects: []
        };
      }

      grouped[key].subjects.push({
        subject: row.subject,
        teacher: row.teacher,
        status: "Pending",
        comments: ""
      });
    });

    const students = Object.values(grouped);

    try {
      document.getElementById("excelStatus").innerText = "Uploading...";

      await fetch("http://localhost:5000/students/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students })
      });

      document.getElementById("excelStatus").innerText =
        `Uploaded ${students.length} students successfully`;

      loadStudents();

    } catch (err) {
      console.error(err);
      document.getElementById("excelStatus").innerText = "Upload failed";
    }
  };

  reader.readAsArrayBuffer(file);
}


// AUTO LOAD
window.onload = loadStudents;