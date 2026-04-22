const API = "http://localhost:5000/students";
/*
async function loadByGrade() {
  const grade = document.getElementById("gradeSelect").value;

  if (!grade) {
    alert("Please select a grade level");
    return;
  }

  const res = await fetch(`${API}/grade/${grade}`);
  const students = await res.json();

  const container = document.getElementById("printArea");
  container.innerHTML = "";

  students.forEach(student => {

    let html = `
      <h3>${student.studentname} ${student.studentlname} - ${student.gradelevel}</h3>

      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Teacher</th>
            <th>Status</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
    `;

    (student.subjects || []).forEach(sub => {
      html += `
        <tr>
          <td>${sub.subject}</td>
          <td>${sub.teacher}</td>
          <td>${sub.status || 'Pending'}</td>
          <td>${sub.comments || ''}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
      <hr>
    `;

    container.innerHTML += html;
  });
}
  */

//const API = "http://localhost:5000/students";

async function loadByGrade() {
  const grade = document.getElementById("gradeSelect").value;

  if (!grade) {
    alert("Please select a grade level");
    return;
  }

  const res = await fetch(`${API}/grade/${grade}`);
  const students = await res.json();

  const container = document.getElementById("printArea");
  container.innerHTML = "";

  students.forEach(student => {

    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "25px";
    wrapper.style.pageBreakInside = "avoid";

    let html = `
      <div style="margin-bottom:10px;">
        <h2 style="margin:0; color:#1f3c88;">
          ${student.studentname} ${student.studentlname}
        </h2>
        <p style="margin:2px 0; font-size:13px;">
          Grade Level: <b>${student.gradelevel}</b>
        </p>
      </div>

      <table style="
        width:100%;
        border-collapse:collapse;
        font-size:13px;
      ">
        <thead>
          <tr style="background:#1f3c88; color:white;">
            <th style="padding:8px; text-align:left;">Subject</th>
            <th style="padding:8px; text-align:left;">Teacher</th>
            <th style="padding:8px; text-align:left;">Status</th>
            <th style="padding:8px; text-align:left;">Comments</th>
          </tr>
        </thead>
        <tbody>
    `;

    (student.subjects || []).forEach(sub => {
      html += `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #eee;">
            ${sub.subject}
          </td>
          <td style="padding:8px; border-bottom:1px solid #eee;">
            ${sub.teacher}
          </td>
          <td style="padding:8px; border-bottom:1px solid #eee;">
            ${sub.status || 'Pending'}
          </td>
          <td style="padding:8px; border-bottom:1px solid #eee;">
            ${sub.comments || ''}
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    wrapper.innerHTML = html;
    container.appendChild(wrapper);
  });
}