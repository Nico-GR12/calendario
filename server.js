require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// GET todas las reservas
app.get('/api/reservas', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM reservas ORDER BY fecha, hora_inicio');
  res.json(rows);
});

// POST crear reserva
app.post('/api/reservas', async (req, res) => {
  const { nombre, fecha, hora_inicio, hora_fin } = req.body;
  const [result] = await db.query(
    'INSERT INTO reservas (nombre, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)',
    [nombre, fecha, hora_inicio, hora_fin]
  );
  res.json({ id: result.insertId, nombre, fecha, hora_inicio, hora_fin });
});

// PUT actualizar
app.put('/api/reservas/:id', async (req, res) => {
  const { nombre, fecha, hora_inicio, hora_fin } = req.body;
  await db.query(
    'UPDATE reservas SET nombre=?, fecha=?, hora_inicio=?, hora_fin=? WHERE id=?',
    [nombre, fecha, hora_inicio, hora_fin, req.params.id]
  );
  res.json({ ok: true });
});

// DELETE eliminar
app.delete('/api/reservas/:id', async (req, res) => {
  await db.query('DELETE FROM reservas WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));