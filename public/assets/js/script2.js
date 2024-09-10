const registros = [];

function addRegister(register, method) {
  fetch("/", {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ register }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
      alert("Error al agregar el registro.");
    });
}

function saveForm() {
  const inputs = document.querySelectorAll(".data");
  const register = {};
  inputs.forEach((input) => {
    register[input.id] = input.value;
  });
  fetch(`/exist/${register.rut}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.exist && confirm("El registro existe, ¿deseeas reemplazarlo?")) {
        addRegister(register, "PUT");
      } else if (!data.exist) {
        addRegister(register, "POST");
      }
    });
}

function deleteRecord() {
  const rut = document.getElementById("delete").value;

  fetch(`/exist/${rut}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.exist) {
        fetch(`/delete/${rut}`, { method: "DELETE" })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            alert(data.message);
          });
      } else {
        alert("Registro no encontrado.");
      }
    });
}

function searchByLastName() {
  const last_name = document.getElementById("search").value;
  fetch(`/registers/${last_name}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      alert(data.message);
    });
}
