const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");
const { runInNewContext } = require("vm");

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto: ${PORT}`));

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
function read() {
  return JSON.parse(fs.readFileSync("data.json", "utf8"));
}
function write(data) {
  fs.writeFileSync("data.json", JSON.stringify({ data: data }));
}
app.get("/exist/:rut", (req, res) => {
  const rut = req.params.rut;
  const data = read().data;
  const exist = data.find((reg) => reg.rut === rut);
  res.json({ exist: !!exist });
});

app.post("/", (req, res) => {
  const { register } = req.body;
  const data = read().data;
  data.push(register);
  write(data);
  res.json({
    status: 201,
    message: "Registro agregado correctamente.",
  });
});

app.put("/", (req, res) => {
  const { register } = req.body;
  const data = read().data;
  const new_data = data.map((reg) =>
    reg.rut === register.rut ? register : reg
  );
  write(new_data);
  res.json({
    status: 201,
    message: "Registro actualizado correctamente.",
  });
});

app.get("/registers/:last_name", (req, res) => {
  const last_name = req.params.last_name;
  const data = read().data;
  const exist = data.find(
    (reg) => reg.last_name.toLowerCase() === last_name.toLowerCase()
  );
  const message = exist
    ? `Registro encontrado!\nRUT: ${exist.rut}\nNombres: ${exist.name}\nApellidos: ${exist.last_name}`
    : "Registro no encontrado";

  res.json({
    result: !!exist,
    message,
  });
});

app.delete("/delete/:rut", (req, res) => {
  const rut = req.params.rut;
  const data = read().data;
  const new_data = data.filter((reg) => reg.rut !== rut);
  write(new_data);
  res.json({ status: 200, message: "Registro eliminado." });
});

app.get("/all", (req, res) => {
  const data = read().data;
  res.json({ data });
});
