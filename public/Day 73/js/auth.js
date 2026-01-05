function login() {
  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const email = document.getElementById("email");
  const level = document.getElementById("level");

  if (!fname.value || !email.value || !level.value) {
    alert("Please fill all required fields");
    return;
  }

  const user = {
    name: `${fname.value} ${lname.value}`,
    email: email.value,
    level: level.value
  };

  // ✅ ONE CONSISTENT KEY
  localStorage.setItem("ml_user", JSON.stringify(user));

  // redirect to home
  window.location.href = "index.html";
}
