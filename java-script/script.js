// Digital Clock
function startClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  setInterval(() => {
    let now = new Date();
    clock.innerText = now.toLocaleTimeString();
  }, 1000);
}

// To-Do List
function addTask() {
  const input = document.getElementById("taskInput");
  const list = document.getElementById("taskList");
  if (input.value.trim() === "") return;
  let li = document.createElement("li");
  li.textContent = input.value;
  li.onclick = () => li.remove();
  list.appendChild(li);
  input.value = "";
}

// Image Slider
let slideIndex = 0;
function showSlides() {
  const slides = document.querySelectorAll(".slider img");
  if (!slides.length) return;
  slides.forEach(s => s.classList.remove("active"));
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
  setTimeout(showSlides, 2000);
}

// Form Validation
function validateForm(e) {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();
  if (!name || !email || !msg) {
    alert("All fields are required!");
    e.preventDefault();
    return false;
  }
  alert("Form submitted successfully!");
}
