// ===== GLOBAL VARIABLES =====
let orderData = {};
let orderNumber = "";
let paymentTimer = null;
let uploadedFiles = [];
let paymentProofFile = null;

// ===== UTILITY FUNCTIONS =====

// Generate unique order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `TMP${year}${month}${day}${random}`;
}

// Format price to IDR
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price);
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone number (Indonesian format)
function validatePhone(phone) {
  const re = /^(08)[0-9]{8,11}$/;
  return re.test(phone.replace(/\s/g, ""));
}

// Set minimum date for deadline input
function setMinDate() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0];
  const deadlineInput = document.getElementById("deadline");
  if (deadlineInput) {
    deadlineInput.min = minDate;
  }
}

// ===== NAVBAR FUNCTIONS =====

window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  const logo = document.querySelector("nav img");

  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
    nav.classList.remove("transparent");
    if (logo) {
      logo.src = "img/logo-dark.png";
    }
  } else {
    nav.classList.add("transparent");
    nav.classList.remove("scrolled");
    if (logo) {
      logo.src = "img/logo.png";
    }
  }
});

function openMenu() {
  const navLink = document.getElementById("navLink");
  const overlay = document.getElementById("overlay");
  if (navLink) navLink.style.right = "0";
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  const navLink = document.getElementById("navLink");
  const overlay = document.getElementById("overlay");
  if (navLink) navLink.style.right = "-220px";
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ===== SCROLL ANIMATIONS =====

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, observerOptions);

const scrollElements = document.querySelectorAll(
  ".scroll-animation, .scroll-left, .scroll-right, .fade-in, .scale-up"
);

scrollElements.forEach(function (el) {
  observer.observe(el);
});

function checkVisibleElements() {
  scrollElements.forEach(function (el) {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      el.classList.add("show");
    }
  });
}

// ===== ORDER FORM FUNCTIONS =====

function openOrderForm(packageName, price) {
  orderNumber = generateOrderNumber();

  const popupOverlay = document.getElementById("popupOverlay");
  const selectedPackage = document.getElementById("selectedPackage");
  const selectedPrice = document.getElementById("selectedPrice");
  const orderNumberDisplay = document.getElementById("orderNumber");
  const summaryPackage = document.getElementById("summaryPackage");
  const summaryPrice = document.getElementById("summaryPrice");
  const summaryTotal = document.getElementById("summaryTotal");

  if (selectedPackage) selectedPackage.textContent = "Paket " + packageName;
  if (selectedPrice) selectedPrice.textContent = formatPrice(price);
  if (orderNumberDisplay) orderNumberDisplay.textContent = orderNumber;
  if (summaryPackage) summaryPackage.textContent = "Paket " + packageName;
  if (summaryPrice) summaryPrice.textContent = "Rp " + formatPrice(price);
  if (summaryTotal) summaryTotal.textContent = "Rp " + formatPrice(price);

  if (popupOverlay) popupOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  const orderForm = document.getElementById("orderForm");
  if (orderForm) orderForm.reset();
  uploadedFiles = [];
  const fileList = document.getElementById("fileList");
  if (fileList) fileList.innerHTML = "";
}

function closeOrderForm() {
  const popupOverlay = document.getElementById("popupOverlay");
  if (popupOverlay) popupOverlay.classList.remove("active");
  document.body.style.overflow = "";

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach(function (el) {
    el.textContent = "";
  });
}

// ===== FILE UPLOAD HANDLING =====

function handleFileUpload(event) {
  const files = event.target.files;
  const fileList = document.getElementById("fileList");

  if (!fileList) return;

  Array.from(files).forEach(function (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert("File " + file.name + " terlalu besar. Maksimal 5MB per file.");
      return;
    }

    uploadedFiles.push(file);

    const fileItem = document.createElement("div");
    fileItem.className = "file-item";
    fileItem.innerHTML =
      '<span><i class="fa-solid fa-file"></i> ' +
      file.name +
      "</span>" +
      '<button type="button" onclick="removeFile(\'' +
      file.name +
      "')\">" +
      '<i class="fa-solid fa-xmark"></i>' +
      "</button>";
    fileList.appendChild(fileItem);
  });

  event.target.value = "";
}

function removeFile(fileName) {
  uploadedFiles = uploadedFiles.filter(function (file) {
    return file.name !== fileName;
  });

  const fileList = document.getElementById("fileList");
  if (!fileList) return;

  const items = fileList.querySelectorAll(".file-item");
  items.forEach(function (item) {
    if (item.textContent.includes(fileName)) {
      item.remove();
    }
  });
}

// ===== FORM VALIDATION =====

function validateForm() {
  let isValid = true;

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach(function (el) {
    el.textContent = "";
  });

  const nama = document.getElementById("nama");
  const namaError = document.getElementById("namaError");
  if (nama && nama.value.trim().length < 3) {
    if (namaError) namaError.textContent = "Nama minimal 3 karakter";
    isValid = false;
  }

  const email = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  if (email && !validateEmail(email.value.trim())) {
    if (emailError) emailError.textContent = "Format email tidak valid";
    isValid = false;
  }

  const noHp = document.getElementById("noHp");
  const noHpError = document.getElementById("noHpError");
  if (noHp && !validatePhone(noHp.value.trim())) {
    if (noHpError)
      noHpError.textContent = "Format nomor tidak valid (contoh: 08123456789)";
    isValid = false;
  }

  const deskripsi = document.getElementById("deskripsi");
  if (deskripsi && deskripsi.value.trim().length === 0) {
    alert("Deskripsi proyek wajib diisi");
    isValid = false;
  }

  return isValid;
}

// ===== ORDER FORM SUBMISSION =====

function initOrderForm() {
  const orderForm = document.getElementById("orderForm");

  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      showLoading();

      const nama = document.getElementById("nama").value.trim();
      const email = document.getElementById("email").value.trim();
      const noHp = document.getElementById("noHp").value.trim();
      const jenisDesain = document.getElementById("jenisDesain").value;
      const deskripsi = document.getElementById("deskripsi").value.trim();
      const deadlineEl = document.getElementById("deadline");
      const deadline = deadlineEl ? deadlineEl.value : "";
      const metode = "QRIS"; // Hardcode QRIS sebagai metode pembayaran
      const paket = document.getElementById("selectedPackage").textContent;
      const harga = document.getElementById("selectedPrice").textContent;

      orderData = {
        orderNumber: orderNumber,
        nama: nama,
        email: email,
        noHp: noHp,
        jenisDesain: jenisDesain,
        deskripsi: deskripsi,
        deadline: deadline || "Sesuai estimasi paket",
        metode: metode,
        paket: paket,
        harga: harga,
        timestamp: new Date().toISOString(),
        files: uploadedFiles.map(function (f) {
          return f.name;
        }),
      };

      saveOrderToLocalStorage();

      setTimeout(function () {
        hideLoading();
        closeOrderForm();

        setTimeout(function () {
          openPayment(metode);
        }, 300);
      }, 1500);
    });
  }
}

// ===== PAYMENT FUNCTIONS =====

function openPayment(method) {
  const paymentOverlay = document.getElementById("paymentOverlay");
  const paymentPackage = document.getElementById("paymentPackage");
  const paymentAmount = document.getElementById("paymentAmount");
  const paymentOrderNumber = document.getElementById("paymentOrderNumber");
  const paymentContent = document.getElementById("paymentContent");

  if (paymentPackage) paymentPackage.textContent = orderData.paket;
  if (paymentAmount) paymentAmount.textContent = "Rp " + orderData.harga;
  if (paymentOrderNumber)
    paymentOrderNumber.textContent = orderData.orderNumber;

  // Tampilkan QRIS langsung
  if (paymentContent) {
    paymentContent.innerHTML =
      '<div class="qris-container">' +
      "<h3>Scan QRIS untuk Membayar</h3>" +
      '<div class="qris-box">' +
      '<img src="img/Qris.jpeg" alt="QRIS Code" />' +
      '<p class="qris-note">Scan kode QR menggunakan aplikasi pembayaran Anda</p>' +
      "</div>" +
      "</div>";
  }

  if (paymentOverlay) paymentOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  startPaymentTimer(24 * 60 * 60);
}

function closePayment() {
  const paymentOverlay = document.getElementById("paymentOverlay");
  if (paymentOverlay) paymentOverlay.classList.remove("active");
  document.body.style.overflow = "";

  const paymentConfirm = document.getElementById("paymentConfirm");
  const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
  if (paymentConfirm) paymentConfirm.checked = false;
  if (confirmPaymentBtn) confirmPaymentBtn.disabled = true;

  if (paymentTimer) clearInterval(paymentTimer);
  paymentProofFile = null;

  const proofPreview = document.getElementById("proofPreview");
  if (proofPreview) proofPreview.innerHTML = "";
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function () {
      const notification = document.createElement("div");
      notification.style.cssText =
        "position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; " +
        "padding: 15px 25px; border-radius: 10px; z-index: 10005;";
      notification.innerHTML =
        '<i class="fa-solid fa-check"></i> Berhasil disalin!';
      document.body.appendChild(notification);

      setTimeout(function () {
        notification.remove();
      }, 2000);
    });
  }
}

function startPaymentTimer(seconds) {
  let remaining = seconds;
  const timerElement = document.getElementById("paymentTimer");

  if (!timerElement) return;

  function updateTimer() {
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;

    timerElement.textContent =
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0");

    if (remaining <= 0) {
      clearInterval(paymentTimer);
      timerElement.textContent = "EXPIRED";
      timerElement.style.color = "#ff0000";
    }

    remaining--;
  }

  updateTimer();
  paymentTimer = setInterval(updateTimer, 1000);
}

function initPaymentProofUpload() {
  const paymentProofInput = document.getElementById("paymentProof");
  if (paymentProofInput) {
    paymentProofInput.addEventListener("change", function (e) {
      const file = e.target.files[0];

      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 2MB.");
        e.target.value = "";
        return;
      }

      paymentProofFile = file;

      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById("proofPreview");
        if (preview) {
          preview.innerHTML =
            '<img src="' +
            e.target.result +
            '" alt="Payment Proof">' +
            '<button type="button" onclick="removePaymentProof()" style="margin-top: 10px; background: #ff0000; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">' +
            '<i class="fa-solid fa-trash"></i> Hapus' +
            "</button>";
        }
      };
      reader.readAsDataURL(file);
    });
  }
}

function removePaymentProof() {
  paymentProofFile = null;
  const paymentProofInput = document.getElementById("paymentProof");
  const proofPreview = document.getElementById("proofPreview");
  if (paymentProofInput) paymentProofInput.value = "";
  if (proofPreview) proofPreview.innerHTML = "";
}

function initPaymentConfirm() {
  const paymentConfirmCheckbox = document.getElementById("paymentConfirm");
  const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");

  if (paymentConfirmCheckbox && confirmPaymentBtn) {
    paymentConfirmCheckbox.addEventListener("change", function () {
      confirmPaymentBtn.disabled = !this.checked;
    });
  }
}

function confirmPayment() {
  if (!paymentProofFile) {
    alert("Mohon upload bukti pembayaran terlebih dahulu!");
    return;
  }

  showLoading();

  orderData.status = "Menunggu Verifikasi";
  orderData.paymentProof = paymentProofFile.name;
  orderData.paymentDate = new Date().toISOString();

  saveOrderToLocalStorage();

  // Kirim pesan ke WhatsApp dengan informasi bukti pembayaran
  sendToWhatsAppWithProof();

  setTimeout(function () {
    hideLoading();
    closePayment();
    showSuccess();
  }, 2000);
}

// ===== WHATSAPP INTEGRATION =====

function sendToWhatsApp(isPaid) {
  const orderNumber = orderData.orderNumber;
  const nama = orderData.nama;
  const email = orderData.email;
  const noHp = orderData.noHp;
  const jenisDesain = orderData.jenisDesain;
  const deskripsi = orderData.deskripsi;
  const deadline = orderData.deadline;
  const metode = orderData.metode;
  const paket = orderData.paket;
  const harga = orderData.harga;

  let message =
    "*FORM PEMESANAN DESAIN*%0A%0A" +
    "*No. Pesanan:* " +
    orderNumber +
    "%0A" +
    "*Paket:* " +
    paket +
    "%0A" +
    "*Harga:* Rp " +
    harga +
    "%0A%0A" +
    "*Data Pelanggan:*%0A" +
    "Nama: " +
    nama +
    "%0A" +
    "Email: " +
    email +
    "%0A" +
    "No. WhatsApp: " +
    noHp +
    "%0A%0A" +
    "*Detail Proyek:*%0A" +
    "Jenis Desain: " +
    jenisDesain +
    "%0A" +
    "Deskripsi: " +
    deskripsi +
    "%0A" +
    "Deadline: " +
    deadline +
    "%0A%0A" +
    "*Metode Pembayaran:* " +
    metode;

  if (isPaid) {
    message +=
      "%0A%0A*STATUS:* Pembayaran telah dilakukan dan bukti sudah diupload";
  }

  const whatsappURL = "https://wa.me/6285128039505?text=" + message;
  window.open(whatsappURL, "_blank");
}

function sendToWhatsAppWithProof() {
  const orderNumber = orderData.orderNumber;
  const nama = orderData.nama;
  const email = orderData.email;
  const noHp = orderData.noHp;
  const jenisDesain = orderData.jenisDesain;
  const deskripsi = orderData.deskripsi;
  const deadline = orderData.deadline;
  const metode = orderData.metode;
  const paket = orderData.paket;
  const harga = orderData.harga;

  let message =
    "*KONFIRMASI PEMBAYARAN*%0A%0A" +
    "*No. Pesanan:* " +
    orderNumber +
    "%0A" +
    "*Paket:* " +
    paket +
    "%0A" +
    "*Harga:* Rp " +
    harga +
    "%0A%0A" +
    "*Data Pelanggan:*%0A" +
    "Nama: " +
    nama +
    "%0A" +
    "Email: " +
    email +
    "%0A" +
    "No. WhatsApp: " +
    noHp +
    "%0A%0A" +
    "*Detail Proyek:*%0A" +
    "Jenis Desain: " +
    jenisDesain +
    "%0A" +
    "Deskripsi: " +
    deskripsi +
    "%0A" +
    "Deadline: " +
    deadline +
    "%0A%0A" +
    "*Metode Pembayaran:* " +
    metode +
    " (QRIS)%0A" +
    "*Status:* LUNAS - Bukti pembayaran sudah diupload%0A" +
    "*Nama File Bukti:* " +
    paymentProofFile.name +
    "%0A%0A" +
    "_Mohon untuk memverifikasi pembayaran. Bukti pembayaran akan saya kirim setelah pesan ini._";

  const whatsappURL = "https://wa.me/6285128039505?text=" + message;
  window.open(whatsappURL, "_blank");

  // Tampilkan instruksi untuk kirim bukti pembayaran manual
  setTimeout(function () {
    alert(
      "📱 LANGKAH SELANJUTNYA:\n\n" +
        "1. Setelah jendela WhatsApp terbuka, kirim pesan yang sudah disiapkan\n" +
        "2. Kemudian kirim FOTO BUKTI PEMBAYARAN yang sudah Anda upload tadi\n" +
        "3. Tim kami akan memverifikasi pembayaran Anda\n\n" +
        "⚠️ PENTING: Pastikan Anda mengirim foto bukti pembayaran setelah pesan otomatis!"
    );
  }, 1000);
}

// ===== SUCCESS MODAL =====

function showSuccess() {
  const successOverlay = document.getElementById("successOverlay");
  const successOrderNumber = document.getElementById("successOrderNumber");
  const successEmail = document.getElementById("successEmail");

  if (successOrderNumber)
    successOrderNumber.textContent = orderData.orderNumber;
  if (successEmail) successEmail.textContent = orderData.email;

  if (successOverlay) successOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSuccess() {
  const successOverlay = document.getElementById("successOverlay");
  if (successOverlay) successOverlay.classList.remove("active");
  document.body.style.overflow = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function trackOrder() {
  closeSuccess();
  alert(
    "Fitur tracking pesanan akan segera hadir!\n\nNo. Pesanan Anda: " +
      orderData.orderNumber +
      "\n\nSimpan nomor ini untuk melacak status pesanan."
  );
}

// ===== LOADING OVERLAY =====

function showLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) loadingOverlay.classList.add("active");
}

function hideLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) loadingOverlay.classList.remove("active");
}

// ===== LOCAL STORAGE =====

function saveOrderToLocalStorage() {
  try {
    let orders = JSON.parse(localStorage.getItem("templayOrders") || "[]");
    orders.push(orderData);
    localStorage.setItem("templayOrders", JSON.stringify(orders));
    console.log("Order saved:", orderData);
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

function getOrderByNumber(orderNumber) {
  try {
    const orders = JSON.parse(localStorage.getItem("templayOrders") || "[]");
    return orders.find(function (order) {
      return order.orderNumber === orderNumber;
    });
  } catch (e) {
    console.error("Error reading from localStorage:", e);
    return null;
  }
}

// ===== TERMS & PRIVACY MODALS =====

function showTerms(event) {
  event.preventDefault();
  alert(
    "Syarat & Ketentuan:\n\n1. Pembayaran dilakukan di muka\n2. Revisi sesuai paket yang dipilih\n3. Hak cipta desain sepenuhnya milik klien setelah pelunasan\n4. Waktu pengerjaan sesuai estimasi paket\n5. Pembatalan pesanan akan dikenakan biaya administrasi"
  );
}

function showPrivacy(event) {
  event.preventDefault();
  alert(
    "Kebijakan Privasi:\n\n1. Data pribadi Anda aman dan terenkripsi\n2. Kami tidak membagikan data ke pihak ketiga\n3. Data hanya digunakan untuk proses pemesanan\n4. Anda berhak meminta penghapusan data\n5. Kami mematuhi peraturan perlindungan data"
  );
}

// ===== EVENT LISTENERS =====

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  const navLinks = document.querySelectorAll(".nav-link ul li a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });

  const nav = document.querySelector("nav");
  const logo = document.querySelector("nav img");

  if (window.scrollY > 50) {
    if (nav) nav.classList.add("scrolled");
    if (logo) logo.src = "img/logo-dark.png";
  } else {
    if (nav) nav.classList.add("transparent");
    if (logo) logo.src = "img/logo.png";
  }

  checkVisibleElements();
  setMinDate();

  const referenceFile = document.getElementById("referenceFile");
  if (referenceFile) {
    referenceFile.addEventListener("change", handleFileUpload);
  }

  const popupOverlay = document.getElementById("popupOverlay");
  if (popupOverlay) {
    popupOverlay.addEventListener("click", function (e) {
      if (e.target === popupOverlay) {
        closeOrderForm();
      }
    });
  }

  const paymentOverlay = document.getElementById("paymentOverlay");
  if (paymentOverlay) {
    paymentOverlay.addEventListener("click", function (e) {
      if (e.target === paymentOverlay) {
        closePayment();
      }
    });
  }

  initOrderForm();
  initPaymentProofUpload();
  initPaymentConfirm();
});

const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      setTimeout(checkVisibleElements, 500);
    }
  });
});

window.addEventListener("load", function () {
  setTimeout(checkVisibleElements, 100);
});

window.addEventListener("hashchange", function () {
  setTimeout(checkVisibleElements, 300);
});
