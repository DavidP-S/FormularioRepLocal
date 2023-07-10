// Función para mostrar la pestaña seleccionada
function openTab(evt, tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabName).style.display = 'block';
  //console.log(document.location.pathname);
  if(window.location.pathname==="/visualizar.html"){
    visualización(tabName);
  }
}

// Inicia la función para generar el archivo JSON y descargarlo directamente
/*function downloadJSON(data, filename) {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}*/

//Validación del DOM
function validateFormData(formData) {
  const emailTest = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;
  const cedulaTest = /^[0-9]{10}/;
  if (!formData.nombre.trim()) {
    alert('Por favor, ingrese un nombre válido.');
    return false;
  }
  if (!formData.apellido.trim()) {
    alert('Por favor, ingrese un apellido válido.');
    return false;
  }
  if (!cedulaTest.test(formData.cedula.trim())) {
    alert('Por favor, ingrese un número de cédula válido.');
    return false;
  }
  if (!emailTest.test(formData.correo.trim())) {
    alert('Por favor, ingrese un correo electrónico válido.');
    return false;
  }
  if (formData.formType === 'doctor') {
    if (!formData.consultorio.trim()) {
      alert('Por favor, ingrese un número de consultorio válido.');
      return false;
    }
  } else if (formData.formType === 'paciente') {
    if (!formData.telefono.trim()) {
      alert('Por favor, ingrese un número de teléfono válido.');
      return false;
    }
    if (!formData.edad.trim() || isNaN(formData.edad) || formData.edad <=0) {
      alert('Por favor, ingrese una edad válida.');
      return false;
    }
  }

  return true;
}


// Inicio de la función Submit que hace envio del formulario
function submitForm(formType) {
  let form;
  if (formType === 'doctor') {
    form = document.getElementById('doctorForm');
  } else if (formType === 'paciente') {
    form = document.getElementById('pacienteForm');
  }
  
  //Formato para el JSON
  const formData = {
    formType: formType,
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    cedula: form.cedula.value,
    correo: form.correo.value,
    especialidad: form.especialidad.value,
  };

  if (formType === 'doctor') {
    formData.consultorio = form.consultorio.value;
  } else if (formType === 'paciente') {
    formData.telefono = form.telefono.value;
    formData.edad = form.edad.value;
  }

  if (!validateFormData(formData)) {
    return; // Detener el envío del formulario si hay errores de validación
  }

  const fileName = formType + '.json';

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/saveJSON', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log('Archivo JSON guardado en el servidor.');
      } else {
        console.error('Error al guardar el archivo JSON en el servidor.');
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}


function visualización(tabName){
  if (tabName === 'paciente') {
    fetch('/getFiles')
      .then(response => response.json())
      .then(files => {
        const paciente = files.filter(file => file.formType === 'paciente');
        const pacienteTableBody = document.getElementById('pacienteTable').getElementsByTagName('tbody')[0];

        // Limpiar la tabla antes de agregar nuevos datos
        pacienteTableBody.innerHTML = '';

        paciente.forEach(paciente => {
          Object.entries(paciente).forEach(([dato, valor]) => {
            if (dato !== 'formType') {
              const row = pacienteTableBody.insertRow();
              const datoCell = row.insertCell();
              const valorCell = row.insertCell();

              datoCell.textContent = dato.charAt(0).toUpperCase() + dato.slice(1);
              valorCell.textContent = valor;
            }
          });
        });
      })
      .catch(error => console.error(error));
  } else if (tabName === 'doctor') {
    fetch('/getFiles')
      .then(response => response.json())
      .then(files => {
        const doctor = files.filter(file => file.formType === 'doctor');
        const doctorTableBody = document.getElementById('doctorTable').getElementsByTagName('tbody')[0];

        // Limpiar la tabla antes de agregar nuevos datos
        doctorTableBody.innerHTML = '';

        doctor.forEach(doctor => {
          Object.entries(doctor).forEach(([dato, valor]) => {
            if (dato !== 'formType') {
              const row = doctorTableBody.insertRow();
              const datoCell = row.insertCell();
              
              const valorCell = row.insertCell();

              datoCell.textContent = dato.charAt(0).toUpperCase() + dato.slice(1);
              valorCell.textContent = valor;
            }
          });
        });
      })
      .catch(error => console.error(error));
  }
}

//Mostrar json como elemento pre
/*document.addEventListener('DOMContentLoaded', () => {
  const dataContainer = document.getElementById('dataContainer');

  // Realizar una petición AJAX al servidor para obtener los archivos JSON guardados
  fetch('/getFiles')
    .then(response => response.json())
    .then(files => {
      files.forEach(file => {
        // Crear un elemento <pre> para mostrar cada archivo JSON
        const fileElement = document.createElement('pre');
        fileElement.textContent = JSON.stringify(file, null, 2);

        dataContainer.appendChild(fileElement);
      });
    })
    .catch(error => console.error(error));
})*/