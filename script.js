let step = 1;
const totalSteps = 5;

function toggleMenu() {
  const menu = document.getElementById("nav-menu");
  menu.classList.toggle("active");
}

function showHome() {
  document.getElementById("assistenza").style.display = "none";
  document.getElementById("overlay").style.display = "flex";
  resetForm();
  const menu = document.getElementById("nav-menu");
  if (menu.classList.contains("active")) toggleMenu();
}

function openForm() {
  document.getElementById("assistenza").style.display = "flex";
  document.getElementById("overlay").style.display = "none";
  step = 1;
  renderStep();
  const menu = document.getElementById("nav-menu");
  if (menu.classList.contains("active")) toggleMenu();
}

function resetForm() {
  const form = document.getElementById("myForm");
  form.reset();
  document.getElementById("imagePreview").innerHTML = "";
  step = 1;
}

function renderStep() {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  const currentStepElement = document.getElementById(`form-step-${step}`);
  if (currentStepElement) {
    currentStepElement.classList.add('active');
  }
  if (step === 5) {
    generateSummary();
  }
}

function nextStep() {
  if (validateStep() && step < totalSteps) {
    step++;
    renderStep();
  }
}

function prevStep() {
  if (step > 1) {
    step--;
    renderStep();
  }
}

function validateStep() {
  if (step === 1 && !document.getElementById('name').value.trim()) {
    alert("Inserisci il tuo nome");
    return false;
  }
  if (step === 2 && !document.getElementById('issue').value.trim()) {
    alert("Descrivi il problema");
    return false;
  }
  if (step === 4 && !document.getElementById('phone').value.trim()) {
    alert("Inserisci un numero di telefono");
    return false;
  }
  return true;
}

function generateSummary() {
  const name = document.getElementById('name').value;
  const issue = document.getElementById('issue').value;
  const phone = document.getElementById('phone').value;
  const photoFile = document.getElementById('photo').files[0];

  const summaryHtml = `
    <p><strong>Nome:</strong> ${name || 'Non inserito'}</p>
    <p><strong>Problema:</strong> ${issue || 'Non inserito'}</p>
    <p><strong>Telefono:</strong> ${phone || 'Non inserito'}</p>
    <p><strong>Allegato:</strong> ${photoFile ? photoFile.name : 'Nessuno'}</p>
  `;
  document.getElementById('summary').innerHTML = summaryHtml;
}

function previewImage(event) {
  const preview = document.getElementById("imagePreview");
  preview.innerHTML = "";
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = "200px";
    img.style.borderRadius = "0.5rem";
    preview.appendChild(img);
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('myForm');
  
  document.getElementById('assistenza').style.display = 'none';
  document.getElementById('loadingSpinner').style.display = 'flex';
  
  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
    });

    if (response.ok) {
      window.location.href = "https://edilkappa.netlify.app/thankyou.html";
    } else {
      throw new Error(`Invio fallito (status: ${response.status})`);
    }
  } catch (error) {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('assistenza').style.display = 'flex';
    alert('Si è verificato un errore durante l\'invio. Riprova.');
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderStep();
  showHome();
});