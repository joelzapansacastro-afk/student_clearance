/*
function protectPage() {
  const page = window.location.pathname.split("/").pop();

  const role = localStorage.getItem("role");

  if (!role) {
    window.location.href = "teacherlogin.html";
    return;
  }

  const allowedPages = {
    admin: [
      "home.html",
      "index.html",
      "dashboard.html",
      "registerstudent.html",
      "addteacher.html",
      "print.html",
      "studentstatus.html",
      "teacher.html"
    ],

    teacher: [
      "home.html",
      "dashboard.html",
      "teacher.html",
      "studentstatus.html"
    ]
  };

  if (!allowedPages[role]?.includes(page)) {
    alert("Access denied");

    window.location.href =
      role === "admin"
        ? "index.html"
        : "teacher.html";
  }
}
*/
function protectPage() {
  const page = window.location.pathname.split("/").pop();
  const role = localStorage.getItem("role");

  const allowedPages = {
    admin: [
      "index.html",
      "dashboard.html",
      "registerstudent.html",
      "addteacher.html",
      "studentstatus.html",
      "teacher.html",
      "print.html"
    ],
    teacher: [
      "dashboard.html",
      "teacher.html",
      "studentstatus.html",
      "print.html"
    ]
  };

  if (!role) {
    window.location.href = "home.html";
    return;
  }

  if (!allowedPages[role]?.includes(page)) {
    alert("Access denied");

    window.location.href =
      role === "admin" ? "index.html" : "dashboard.html";
  }
}
const role = localStorage.getItem("role");
const nav = document.getElementById("navLinks");

if (!nav) return;

if (role === "admin") {
  nav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="dashboard.html">Dashboard</a>
    <a href="registerstudent.html">Register</a>
    <a href="addteacher.html">Teachers</a>
    <a href="print.html">Print</a>
    <a href="studentstatus.html">Status</a>
    <a href="#" onclick="logout()">Logout</a>
  `;
} 
else if (role === "teacher") {
  nav.innerHTML = `
    <a href="teacher.html">Home</a>
    <a href="dashboard.html">Dashboard</a>
    <a href="studentstatus.html">Status</a>
    <a href="#" onclick="logout()">Logout</a>
  `;
}

function logout() {
  localStorage.clear();
  window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", () => {
  protectPage();
  setupNavbar();
});