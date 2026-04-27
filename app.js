import express from "express"
import { randomUUID } from "crypto"

const app = express()
const PORT = 3000

app.use(express.json())

let videojuegos = [
  {
    id: randomUUID(),
    titulo: "The Legend of Zelda: Breath of the Wild",
    genero: "aventura",
    plataforma: "Nintendo Switch",
    anio: 2017,
    desarrollador: "Nintendo",
    calificacion: 9.8
  },
  {
    id: randomUUID(),
    titulo: "God of War",
    genero: "accion",
    plataforma: "PlayStation 4",
    anio: 2018,
    desarrollador: "Santa Monica Studio",
    calificacion: 9.5
  },
  {
    id: randomUUID(),
    titulo: "Minecraft",
    genero: "sandbox",
    plataforma: "PC",
    anio: 2011,
    desarrollador: "Mojang",
    calificacion: 9.0
  },
  {
    id: randomUUID(),
    titulo: "Hollow Knight",
    genero: "aventura",
    plataforma: "PC",
    anio: 2017,
    desarrollador: "Team Cherry",
    calificacion: 9.3
  }
]

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    data: {
      nombre: "API de Videojuegos",
      version: "1.0.0",
      endpoints: {
        "GET /api/videojuegos":           "Listar todos (filtrar con ?genero=accion&plataforma=PC)",
        "GET /api/videojuegos/:id":       "Obtener uno por ID",
        "POST /api/videojuegos":          "Crear uno nuevo",
        "PUT /api/videojuegos/:id":       "Reemplazar completamente",
        "PATCH /api/videojuegos/:id":     "Actualizar campos específicos",
        "DELETE /api/videojuegos/:id":    "Eliminar"
      }
    }
  })
})

app.get("/api/videojuegos", (req, res) => {
  const { genero, plataforma, anio } = req.query

  let resultado = videojuegos

  if (genero) {
    resultado = resultado.filter(
      (j) => j.genero.toLowerCase() === genero.toLowerCase()
    )
  }

  if (plataforma) {
    resultado = resultado.filter(
      (j) => j.plataforma.toLowerCase() === plataforma.toLowerCase()
    )
  }

  if (anio) {
    resultado = resultado.filter((j) => j.anio === Number(anio))
  }

  res.status(200).json({
    ok: true,
    total: resultado.length,
    data: resultado
  })
})

app.get("/api/videojuegos/:id", (req, res) => {
  const juego = videojuegos.find((j) => j.id === req.params.id)

  if (!juego) {
    return res.status(404).json({
      ok: false,
      error: `No se encontró un videojuego con id: ${req.params.id}`
    })
  }

  res.status(200).json({ ok: true, data: juego })
})

app.post("/api/videojuegos", (req, res) => {
  const { titulo, genero, plataforma, anio, desarrollador, calificacion } = req.body

  // Validación: todos los campos son obligatorios
  const camposFaltantes = []
  if (!titulo)        camposFaltantes.push("titulo")
  if (!genero)        camposFaltantes.push("genero")
  if (!plataforma)    camposFaltantes.push("plataforma")
  if (!anio)          camposFaltantes.push("anio")
  if (!desarrollador) camposFaltantes.push("desarrollador")
  if (calificacion === undefined) camposFaltantes.push("calificacion")

  if (camposFaltantes.length > 0) {
    return res.status(400).json({
      ok: false,
      error: "Faltan campos obligatorios",
      camposFaltantes
    })
  }

  const nuevoJuego = {
    id: randomUUID(),
    titulo,
    genero,
    plataforma,
    anio: Number(anio),
    desarrollador,
    calificacion: Number(calificacion)
  }

  videojuegos.push(nuevoJuego)

  res.status(201).json({ ok: true, data: nuevoJuego })
})

app.put("/api/videojuegos/:id", (req, res) => {
  const index = videojuegos.findIndex((j) => j.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: `No se encontró un videojuego con id: ${req.params.id}`
    })
  }

  const { titulo, genero, plataforma, anio, desarrollador, calificacion } = req.body

  const camposFaltantes = []
  if (!titulo)        camposFaltantes.push("titulo")
  if (!genero)        camposFaltantes.push("genero")
  if (!plataforma)    camposFaltantes.push("plataforma")
  if (!anio)          camposFaltantes.push("anio")
  if (!desarrollador) camposFaltantes.push("desarrollador")
  if (calificacion === undefined) camposFaltantes.push("calificacion")

  if (camposFaltantes.length > 0) {
    return res.status(400).json({
      ok: false,
      error: "PUT requiere todos los campos para reemplazar el objeto completo",
      camposFaltantes
    })
  }

  videojuegos[index] = {
    id: req.params.id,
    titulo,
    genero,
    plataforma,
    anio: Number(anio),
    desarrollador,
    calificacion: Number(calificacion)
  }

  res.status(200).json({ ok: true, data: videojuegos[index] })
})

app.patch("/api/videojuegos/:id", (req, res) => {
  const index = videojuegos.findIndex((j) => j.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: `No se encontró un videojuego con id: ${req.params.id}`
    })
  }

  videojuegos[index] = {
    ...videojuegos[index],
    ...req.body,
    id: req.params.id // el id nunca se puede cambiar
  }

  res.status(200).json({ ok: true, data: videojuegos[index] })
})

app.delete("/api/videojuegos/:id", (req, res) => {
  const index = videojuegos.findIndex((j) => j.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: `No se encontró un videojuego con id: ${req.params.id}`
    })
  }

  const eliminado = videojuegos[index]
  videojuegos.splice(index, 1)

  res.status(200).json({
    ok: true,
    mensaje: "Videojuego eliminado correctamente",
    data: eliminado
  })
})

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Ruta no encontrada",
    ruta: req.url,
    metodo: req.method,
    sugerencia: "Visita / para ver los endpoints disponibles"
  })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})