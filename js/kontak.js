// Navbar Scroll Effect
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  const logo = document.querySelector("nav img");

  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
    nav.classList.remove("transparent");
    // Ganti ke logo gelap saat navbar putih
    if (logo) {
      logo.src = "img/logo-dark.png";
    }
  } else {
    nav.classList.add("transparent");
    nav.classList.remove("scrolled");
    // Kembali ke logo putih saat navbar transparan
    if (logo) {
      logo.src = "img/logo.png";
    }
  }
});

// Set initial navbar state
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav");
  const logo = document.querySelector("nav img");

  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
    if (logo) {
      logo.src = "img/logo-dark.png";
    }
  } else {
    nav.classList.add("transparent");
    if (logo) {
      logo.src = "img/logo.png";
    }
  }
});

// Navbar Mobile Menu
function openMenu() {
  const navLink = document.getElementById("navLink");
  const overlay = document.getElementById("overlay");
  navLink.style.right = "0";
  overlay.classList.add("active");
}

function closeMenu() {
  const navLink = document.getElementById("navLink");
  const overlay = document.getElementById("overlay");
  navLink.style.right = "-220px";
  overlay.classList.remove("active");
}

// Close menu when clicking overlay
document.getElementById("overlay").addEventListener("click", closeMenu);

// Close menu when clicking a link
const navLinks = document.querySelectorAll(".nav-link ul li a");
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    if (window.innerWidth <= 900) {
      closeMenu();
    }
  });
});

// Form Handler - Send to WhatsApp
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value;

  // Format WhatsApp message
  const waMessage =
    `*PESAN DARI WEBSITE TEMPLAY*%0A%0A` +
    `*Nama:* ${encodeURIComponent(name)}%0A` +
    `*No. WhatsApp:* ${encodeURIComponent(phone)}%0A` +
    `*Email:* ${encodeURIComponent(email)}%0A` +
    `*Paket Diminati:* ${encodeURIComponent(service)}%0A%0A` +
    `*Pesan:*%0A${encodeURIComponent(message)}`;

  // WhatsApp URL
  const waURL = `https://wa.me/6285128039505?text=${waMessage}`;

  // Open WhatsApp
  window.open(waURL, "_blank");

  // Reset form
  document.getElementById("contactForm").reset();

  // Show success message (optional)
  alert("Terima kasih! Anda akan diarahkan ke WhatsApp.");
});

// Scroll Animation Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, observerOptions);

// Observe all elements with animation classes
const animatedElements = document.querySelectorAll(".scale-up, .fade-in");

animatedElements.forEach((el) => {
  observer.observe(el);
});

// Phone number validation
document.getElementById("phone").addEventListener("input", function (e) {
  // Remove non-numeric characters
  let value = e.target.value.replace(/\D/g, "");

  // Limit to 13 digits
  if (value.length > 13) {
    value = value.slice(0, 13);
  }

  e.target.value = value;
});

// Auto scroll to top on page load
window.addEventListener("load", function () {
  window.scrollTo(0, 0);
});

window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
    nav.classList.remove("transparent");
  } else {
    nav.classList.add("transparent");
    nav.classList.remove("scrolled");
  }
});
