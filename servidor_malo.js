import http from "http"
import fs from "fs/promises"
import path from "path"

const PORT = 3000

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Servidor activo")
    return
  }

  if (req.url === "/info") {
    // ERROR 1 CORREGIDO: "application-json" → "application/json"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end("Ruta de información")
    return
  }

  if (req.url === "/api/student") {
    const filePath = path.join(process.cwd(), "datos.json")
    // ERROR 2 CORREGIDO: faltaba await para esperar la promesa de fs.readFile
    const texto = await fs.readFile(filePath, "utf-8")
    res.writeHead(200, { "Content-Type": "application/json" })
    // ERROR 3 CORREGIDO: texto ya es string, no necesita JSON.stringify (eso serializaría el string, no el objeto)
    res.end(texto)
    return
  }

  // ERROR 4 CORREGIDO: ruta no encontrada debe responder 404, no 200
  res.writeHead(404, { "Content-Type": "text/plain" })
  res.end("Ruta no encontrada")
// ERROR 5 CORREGIDO: faltaba el ")" de cierre del callback de createServer
})

// ERROR 6 CORREGIDO: faltaba el ")" de cierre de server.listen
server.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:3000")
})