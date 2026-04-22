const API = "http://localhost:5000/students";

// SEARCH STUDENTS
async function searchStudent() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  if (!query) return;

  const res = await fetch(API);
  const students = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  const filtered = students.filter(s =>
    s.studentname.toLowerCase().includes(query) ||
    s.studentlname.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    results.innerHTML = "<li>No results found</li>";
    return;
  }

  filtered.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.studentname} ${s.studentlname} (${s.gradelevel})`;

    li.onclick = () => showStudent(s);

    results.appendChild(li);
  });
}

// SHOW STUDENT DATA
function showStudent(student) {
  const table = document.getElementById("studentData");
  table.innerHTML = "";

  (student.subjects || []).forEach(sub => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${sub.subject}</td>
      <td>${sub.teacher}</td>
      <td style="color:${
        sub.status === "Cleared" ? "green" :
        sub.status === "Not Cleared" ? "red" : "orange"
      }">
        ${sub.status}
      </td>
      <td>${sub.comments || ""}</td>
    `;

    table.appendChild(row);
  });
}