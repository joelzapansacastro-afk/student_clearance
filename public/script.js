const API = "http://localhost:5000/students";

// LOAD FOR TEACHER PAGE
/*
async function loadTeacherStudents() {
  const res = await fetch(API);
  let data = await res.json();

  const grade = document.getElementById("gradeFilter")?.value;

  const table = document.getElementById("studentTable");
  if (!table) return;

  table.innerHTML = "";

  // ✅ FILTER BY GRADE
  if (grade) {
    data = data.filter(s => s.gradelevel === grade);
  }

  data.forEach(student => {

    (student.subjects || []).forEach(sub => {

      const safeSubject = sub.subject.replace(/\s+/g, "_");

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.studentname} ${student.studentlname}</td>
        <td>${student.gradelevel}</td>

        <td>${sub.subject}</td>
        <td>${sub.teacher}</td>

        <td>
          <select id="status-${student._id}-${safeSubject}">
            <option ${sub.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option ${sub.status === 'Cleared' ? 'selected' : ''}>Cleared</option>
            <option ${sub.status === 'Not Cleared' ? 'selected' : ''}>Not Cleared</option>
          </select>
        </td>

        <td>
          <input type="text"
            id="comment-${student._id}-${safeSubject}"
            value="${sub.comments || ''}">
        </td>

        <td>
          <button onclick="updateStudent('${student._id}', '${sub.subject}')">
            Save
          </button>
        </td>
      `;

      table.appendChild(row);
    });

  });
}
*/
async function loadTeacherStudents() {
  const res = await fetch(API);
  let data = await res.json();

  //const teacher = localStorage.getItem("teacher");
  const teacher = localStorage.getItem("username");
  fetch(`/students?teacher=${teacher}`)

  const table = document.getElementById("studentTable");
  if (!table) return;

  table.innerHTML = "";

  data.forEach(student => {

    (student.subjects || []).forEach(sub => {

      // ✅ ONLY SHOW SUBJECTS OF THIS TEACHER
      //if (sub.teacher !== teacher) return;
      if ((sub.teacher || "").trim().toUpperCase() !== (teacher || "").trim().toUpperCase()) return;

      const safeSubject = sub.subject.replace(/\s+/g, "_");

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.studentname} ${student.studentlname}</td>
        <td>${student.gradelevel}</td>

        <td>${sub.subject}</td>
        <td>${sub.teacher}</td>

        <td>
          <select id="status-${student._id}-${safeSubject}">
            <option ${sub.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option ${sub.status === 'Cleared' ? 'selected' : ''}>Cleared</option>
            <option ${sub.status === 'Not Cleared' ? 'selected' : ''}>Not Cleared</option>
          </select>
        </td>

        <td>
          <input type="text"
            id="comment-${student._id}-${safeSubject}"
            value="${sub.comments || ''}">
        </td>

        <td>
          <button onclick="updateStudent('${student._id}', '${sub.subject}')">
            Save
          </button>
        </td>
      `;

      table.appendChild(row);
    });

  });
}


// UPDATE STATUS
/*
async function updateStudent(id) {
  const status = document.getElementById(`status-${id}`).value;
  const comments = document.getElementById(`comment-${id}`).value;

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, comments })
  });

  alert("Updated!");
}
*/
/*
async function updateStudent(id, subject) {

  const status = document.getElementById(`status-${id}-${subject}`).value;
  const comments = document.getElementById(`comment-${id}-${subject}`).value;

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject,   // 👈 IMPORTANT
      status,
      comments
    })
  });

  alert("Subject updated!");
}
*/
async function updateStudent(id, subject) {

  const safeSubject = subject.replace(/\s+/g, "_");

  const status = document.getElementById(`status-${id}-${safeSubject}`).value;
  const comments = document.getElementById(`comment-${id}-${safeSubject}`).value;

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: subject.trim(),   // ✅ CLEAN MATCH
      status,
      comments
    })
  });

  alert("Subject updated!");

  loadTeacherStudents();
}



// DASHBOARD LOAD
/*
async function loadStudents() {
  const grade = document.getElementById("gradeFilter").value;
  let url = API;

  if (grade) {
    url += `/grade/${grade}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  const table = document.getElementById("dashboardTable");
  table.innerHTML = "";

  data.forEach(student => {
    table.innerHTML += `
      <tr>
        <td>${student.studentname} ${student.studentlname}</td>
        <td>${student.gradelevel}</td>
        <td>${student.status}</td>
        <td>${student.comments || ''}</td>
      </tr>
    `;
  });
}
  */
 /*
async function loadStudents() {
  const grade = document.getElementById("gradeFilter")?.value;
  let url = API;

  if (grade) {
    url += `/grade/${grade}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  const table = document.getElementById("dashboardTable");
  table.innerHTML = "";

  data.forEach(student => {

    const subjects = student.subjects || [];

    // Count subjects
    const totalSubjects = subjects.length;

    // Count cleared subjects
    const clearedSubjects = subjects.filter(s => s.status === "Cleared").length;

    // Count NOT cleared
    const notCleared = totalSubjects - clearedSubjects;

    let overallStatus = "Pending";
    let comments = `${notCleared} subject(s) not yet cleared`;

    // ✅ ALL CLEARED
    if (totalSubjects > 0 && clearedSubjects === totalSubjects) {
      overallStatus = "Cleared";
      comments = "Completed";
    }

    table.innerHTML += `
      <tr>
        <td>${student.studentname} ${student.studentlname}</td>
        <td>${student.gradelevel}</td>
        <td>${overallStatus}</td>
        <td>${comments}</td>
      </tr>
    `;
  });
}
*/

async function loadStudents() {
  const grade = document.getElementById("gradeFilter")?.value;
  let url = API;

  if (grade) {
    url += `/grade/${grade}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  const table = document.getElementById("dashboardTable");
  table.innerHTML = "";

  data.forEach(student => {

    const subjects = student.subjects || [];

    const totalSubjects = subjects.length;
    const clearedSubjects = subjects.filter(s => s.status === "Cleared").length;

    const notClearedSubjects = subjects
      .filter(s => s.status !== "Cleared")
      .map(s => s.subject);

    let overallStatus = "Pending";

    let comments = `${notClearedSubjects.length} subject(s) not yet cleared`;

    if (notClearedSubjects.length > 0) {
      comments += `: ${notClearedSubjects.join(", ")}`;
    }

    if (totalSubjects > 0 && clearedSubjects === totalSubjects) {
      overallStatus = "Cleared";
      comments = "Completed";
    }

    table.innerHTML += `
      <tr>
        <td>${student.studentname} ${student.studentlname}</td>
        <td>${student.gradelevel}</td>
        <td>${overallStatus}</td>
        <td>${comments}</td>
      </tr>
    `;
  });
}

// AUTO LOAD
loadTeacherStudents();
/*
async function loadByGrade(grade) {

  const res = await fetch(API);
  const data = await res.json();

  const teacher = localStorage.getItem("teacher");

  const table = document.getElementById("studentTable");
  table.innerHTML = "";

  data
    .filter(student => student.gradelevel === grade)
    .forEach(student => {

      (student.subjects || []).forEach(sub => {

        // ✅ ONLY TEACHER'S SUBJECTS
        if (sub.teacher !== teacher) return;

        const safeSubject = sub.subject.replace(/\s+/g, "_");

        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${student.studentname} ${student.studentlname}</td>
          <td>${student.gradelevel}</td>

          <td>${sub.subject}</td>
          <td>${sub.teacher}</td>

          <td>
            <select id="status-${student._id}-${safeSubject}">
              <option ${sub.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option ${sub.status === 'Cleared' ? 'selected' : ''}>Cleared</option>
              <option ${sub.status === 'Not Cleared' ? 'selected' : ''}>Not Cleared</option>
            </select>
          </td>

          <td>
            <input type="text"
              id="comment-${student._id}-${safeSubject}"
              value="${sub.comments || ''}">
          </td>

          <td>
            <button onclick="updateStudent('${student._id}', '${sub.subject}')">
              Save
            </button>
          </td>
        `;

        table.appendChild(row);
      });

    });
}
    */
async function loadByGrade(grade) {

  const res = await fetch(API);
  const data = await res.json();

  const teacher = localStorage.getItem("username");

  const table = document.getElementById("studentTable");
  table.innerHTML = "";

  data
    .filter(student => student.gradelevel === grade)
    .forEach(student => {

      (student.subjects || []).forEach(sub => {

        if ((sub.teacher || "").trim().toUpperCase() !== (teacher || "").trim().toUpperCase()) return;

        const safeSubject = sub.subject.replace(/\s+/g, "_");

        const row = `
          <tr>
            <td>${student.studentname} ${student.studentlname}</td>
            <td>${student.gradelevel}</td>
            <td>${sub.subject}</td>
            <td>${sub.teacher}</td>
            <td>
              <select id="status-${student._id}-${safeSubject}">
                <option ${sub.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option ${sub.status === 'Cleared' ? 'selected' : ''}>Cleared</option>
                <option ${sub.status === 'Not Cleared' ? 'selected' : ''}>Not Cleared</option>
              </select>
            </td>
            <td>
              <input type="text"
                id="comment-${student._id}-${safeSubject}"
                value="${sub.comments || ''}">
            </td>
            <td>
              <button onclick="updateStudent('${student._id}', '${sub.subject}')">
                Save
              </button>
            </td>
          </tr>
        `;

        table.innerHTML += row;
      });

    });
}