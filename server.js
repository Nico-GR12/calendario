const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 Configuración de Aiven MySQL desde variables de entorno
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔹 Crear tabla si no existe
async function crearTabla() {
  try {
    console.log("🔄 Conectando a MySQL...");
    const connection = await pool.getConnection();
    console.log("✅ Conexión exitosa a MySQL");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reservas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre TEXT NOT NULL,
        fecha DATE NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL
      )
    `);
    connection.release();
    console.log("✅ Tabla 'reservas' lista");
  } catch (err) {
    console.error("❌ Error creando tabla:", err.message);
    console.error("Stack:", err.stack);
  }
}

// Crear tabla al iniciar
crearTabla();

// 🔹 Obtener reservas
app.get("/reservas", async (req, res) => {
  console.log("📥 Solicitud GET /reservas");
  try {
    console.log("🔄 Ejecutando consulta...");
    const [reservas] = await pool.query("SELECT * FROM reservas ORDER BY fecha, hora_inicio");
    console.log(`✅ Consulta exitosa: ${reservas.length} reservas encontradas`);
    res.json(reservas);
  } catch (err) {
    console.error("❌ Error en GET /reservas:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Validar datos de reserva
function validarReserva({ nombre, fecha, hora_inicio, hora_fin }) {
  const errores = [];
  if (!nombre || !nombre.trim()) errores.push("El nombre del instructor es obligatorio");
  if (!fecha) errores.push("La fecha es obligatoria");
  if (!hora_inicio) errores.push("La hora de inicio es obligatoria");
  if (!hora_fin) errores.push("La hora de fin es obligatoria");
  if (hora_inicio && hora_fin && hora_inicio >= hora_fin) errores.push("La hora de inicio debe ser menor a la hora de fin");
  return errores;
}

// 🔹 Verificar si hay reservas que se superpongan
async function haySuperposicion(pool, fecha, hora_inicio, hora_fin, excludeId = null) {
  let query = `
    SELECT id FROM reservas 
    WHERE fecha = ? 
      AND hora_inicio < ? 
      AND hora_fin > ?
  `;
  const params = [fecha, hora_fin, hora_inicio];
  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }
  const [rows] = await pool.query(query, params);
  return rows.length > 0;
}

// 🔹 Crear reserva
app.post("/reservas", async (req, res) => {
  console.log("📝 POST /reservas - Datos:", req.body);
  const { nombre, fecha, hora_inicio, hora_fin } = req.body;

  const errores = validarReserva({ nombre, fecha, hora_inicio, hora_fin });
  if (errores.length > 0) {
    return res.status(400).json({ error: errores.join(". ") });
  }

  try {
    const superpone = await haySuperposicion(pool, fecha, hora_inicio, hora_fin);
    if (superpone) {
      return res.status(409).json({ error: "Ya existe una reserva en ese horario" });
    }

    await pool.query(
      "INSERT INTO reservas(nombre, fecha, hora_inicio, hora_fin) VALUES(?, ?, ?, ?)",
      [nombre.trim(), fecha, hora_inicio, hora_fin]
    );
    console.log("✅ Reserva guardada correctamente");
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error guardando:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Actualizar
app.put("/reservas/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha, hora_inicio, hora_fin } = req.body;

  const errores = validarReserva({ nombre, fecha, hora_inicio, hora_fin });
  if (errores.length > 0) {
    return res.status(400).json({ error: errores.join(". ") });
  }

  try {
    const superpone = await haySuperposicion(pool, fecha, hora_inicio, hora_fin, id);
    if (superpone) {
      return res.status(409).json({ error: "Ya existe otra reserva en ese horario" });
    }

    const [result] = await pool.query(
      "UPDATE reservas SET nombre=?, fecha=?, hora_inicio=?, hora_fin=? WHERE id=?",
      [nombre.trim(), fecha, hora_inicio, hora_fin, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Eliminar
app.delete("/reservas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM reservas WHERE id=?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Servir archivos estáticos (después de las rutas de la API)
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log("📊 Base de datos: Aiven MySQL");
});