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

// Mobile Menu Toggle Functions
function openMenu() {
  const navLink = document.getElementById("navLink");
  const overlay = document.getElementById("overlay");
  navLink.style.right = "0";
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  const navLink = document.getElementById("navLink");
  const overlay = document.getElementById("overlay");
  navLink.style.right = "-220px";
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Close menu when clicking overlay
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("overlay");

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // Close menu when clicking a link
  const navLinks = document.querySelectorAll(".nav-link ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });
});

// Smooth Scroll Animation Observer
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

// Observe all elements with scroll animation classes
const scrollElements = document.querySelectorAll(
  ".scroll-animation, .scroll-left, .scroll-right, .fade-in, .scale-up"
);

scrollElements.forEach((el) => {
  observer.observe(el);
});

// Check for elements already in viewport on page load
function checkVisibleElements() {
  scrollElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      el.classList.add("show");
    }
  });
}

// Run check on page load and after navigation
window.addEventListener("load", function () {
  // Small delay to ensure everything is rendered
  setTimeout(checkVisibleElements, 100);
});

// Also check after hash navigation (e.g., #harga, #layanan)
window.addEventListener("hashchange", function () {
  setTimeout(checkVisibleElements, 300);
});

// Smooth scroll for anchor links (backup jika CSS tidak bekerja)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 70; // 70px offset untuk navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      // Trigger animation check after smooth scroll
      setTimeout(checkVisibleElements, 500);
    }
  });
});

// Set initial state
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

  // Initial check for visible elements
  checkVisibleElements();
});

// Popup Form Functions
function openOrderForm(packageName, price) {
  const popupOverlay = document.getElementById("popupOverlay");
  const selectedPackage = document.getElementById("selectedPackage");
  const selectedPrice = document.getElementById("selectedPrice");

  selectedPackage.textContent = "Paket " + packageName;
  selectedPrice.textContent = price;

  popupOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeOrderForm() {
  const popupOverlay = document.getElementById("popupOverlay");
  popupOverlay.classList.remove("active");
  document.body.style.overflow = "";

  // Reset form
  document.getElementById("orderForm").reset();
}

// Close popup when clicking outside
const popupOverlay = document.getElementById("popupOverlay");

if (popupOverlay) {
  popupOverlay.addEventListener("click", function (e) {
    if (e.target === popupOverlay) {
      closeOrderForm();
    }
  });
}

// Global variable untuk menyimpan data order
let orderData = {};

// Handle form submission
const orderForm = document.getElementById("orderForm");

if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const noHp = document.getElementById("noHp").value;
    const jenisDesain = document.getElementById("jenisDesain").value;
    const deskripsi = document.getElementById("deskripsi").value;
    const metode = document.getElementById("metode").value;
    const paket = document.getElementById("selectedPackage").textContent;
    const harga = document.getElementById("selectedPrice").textContent;

    // Simpan data order
    orderData = {
      nama: nama,
      email: email,
      noHp: noHp,
      jenisDesain: jenisDesain,
      deskripsi: deskripsi,
      metode: metode,
      paket: paket,
      harga: harga,
    };

    // Cek metode pembayaran
    if (metode === "QRIS") {
      // Tutup form order
      closeOrderForm();

      // Buka halaman pembayaran QRIS
      setTimeout(() => {
        openPayment(paket, harga);
      }, 300);
    } else {
      // Langsung kirim ke WhatsApp untuk metode lain
      sendToWhatsApp();

      // Close popup after sending
      setTimeout(() => {
        closeOrderForm();
      }, 500);
    }
  });
}

// Payment Functions
function openPayment(packageName, price) {
  const paymentOverlay = document.getElementById("paymentOverlay");
  const paymentPackage = document.getElementById("paymentPackage");
  const paymentAmount = document.getElementById("paymentAmount");

  paymentPackage.textContent = packageName;
  paymentAmount.textContent = "Rp " + price;

  paymentOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePayment() {
  const paymentOverlay = document.getElementById("paymentOverlay");
  paymentOverlay.classList.remove("active");
  document.body.style.overflow = "";

  // Reset checkbox
  document.getElementById("paymentConfirm").checked = false;
  document.getElementById("confirmPaymentBtn").disabled = true;
}

function confirmPayment() {
  // Kirim ke WhatsApp dengan konfirmasi pembayaran
  sendToWhatsApp(true);

  // Tutup payment modal
  closePayment();

  // Show success message
  alert(
    "Terima kasih! Konfirmasi pembayaran Anda akan segera diproses. Kami akan menghubungi Anda melalui WhatsApp."
  );
}

function sendToWhatsApp(isPaid = false) {
  const { nama, email, noHp, jenisDesain, deskripsi, metode, paket, harga } =
    orderData;

  let message =
    `*FORM PEMESANAN DESAIN*%0A%0A` +
    `*Paket:* ${paket}%0A` +
    `*Harga:* Rp ${harga}%0A%0A` +
    `*Data Pelanggan:*%0A` +
    `Nama: ${nama}%0A` +
    `Email: ${email}%0A` +
    `No. WhatsApp: ${noHp}%0A%0A` +
    `*Detail Proyek:*%0A` +
    `Jenis Desain: ${jenisDesain}%0A` +
    `Deskripsi: ${deskripsi}%0A%0A` +
    `*Metode Pembayaran:* ${metode}`;

  if (isPaid) {
    message += `%0A%0A*STATUS:* ✅ Pembayaran telah dilakukan via QRIS`;
  }

  // Open WhatsApp with message
  const whatsappURL = `https://wa.me/6285128039505?text=${message}`;
  window.open(whatsappURL, "_blank");
}

// Enable confirm button when checkbox is checked
const paymentConfirmCheckbox = document.getElementById("paymentConfirm");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");

if (paymentConfirmCheckbox && confirmPaymentBtn) {
  paymentConfirmCheckbox.addEventListener("change", function () {
    confirmPaymentBtn.disabled = !this.checked;
  });
}

// Close payment when clicking outside
const paymentOverlay = document.getElementById("paymentOverlay");

if (paymentOverlay) {
  paymentOverlay.addEventListener("click", function (e) {
    if (e.target === paymentOverlay) {
      closePayment();
    }
  });
}
