# Laboratorio 4 — JavaScript API


## Descripción

Este laboratorio tiene dos partes:
1. Depuración de un servidor HTTP nativo con errores
2. Construcción de una API REST completa con Express

---

## Estructura del proyecto

```
laboratorio4/
├── servidor-malo.js   # Servidor original corregido (Parte 1)
├── SOLUCION.md        # Documentación de los 6 errores encontrados
├── datos.json         # Datos del estudiante (usado por servidor-malo.js)
├── app.js             # API REST con Express (Parte 2)
├── package.json
└── README.md
```

---

## Parte 1 — Servidor corregido

Para probar el servidor corregido:

```bash
node servidor-malo.js
```

Rutas disponibles:
- `GET /` → Texto plano: "Servidor activo"
- `GET /info` → Información de la ruta
- `GET /api/student` → Contenido del archivo `datos.json`

Los 6 errores encontrados están documentados en `SOLUCION.md`.

---

## Parte 2 — API REST de Videojuegos

### Instalación

```bash
npm install
```

### Ejecución

```bash
npm start
# o con auto-reload:
npm run dev
```

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Información de la API y endpoints disponibles |
| GET | `/api/videojuegos` | Listar todos los videojuegos |
| GET | `/api/videojuegos?genero=accion` | Filtrar por género |
| GET | `/api/videojuegos?plataforma=PC` | Filtrar por plataforma |
| GET | `/api/videojuegos?anio=2017` | Filtrar por año |
| GET | `/api/videojuegos/:id` | Obtener un videojuego por ID |
| POST | `/api/videojuegos` | Crear un nuevo videojuego |
| PUT | `/api/videojuegos/:id` | Reemplazar completamente un videojuego |
| PATCH | `/api/videojuegos/:id` | Actualizar campos específicos |
| DELETE | `/api/videojuegos/:id` | Eliminar un videojuego |

### Estructura de un videojuego

```json
{
  "id": "uuid-generado-automaticamente",
  "titulo": "The Legend of Zelda: Breath of the Wild",
  "genero": "aventura",
  "plataforma": "Nintendo Switch",
  "anio": 2017,
  "desarrollador": "Nintendo",
  "calificacion": 9.8
}
```

### Campos obligatorios para POST y PUT

- `titulo` (string)
- `genero` (string): accion, aventura, sandbox, rpg, deportes, etc.
- `plataforma` (string): PC, PlayStation 4, Nintendo Switch, Xbox, etc.
- `anio` (number)
- `desarrollador` (string)
- `calificacion` (number): de 0 a 10

### Ejemplos con curl

```bash
# Listar todos
curl http://localhost:3000/api/videojuegos

# Filtrar por género
curl "http://localhost:3000/api/videojuegos?genero=aventura"

# Crear un videojuego
curl -X POST http://localhost:3000/api/videojuegos \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Elden Ring","genero":"rpg","plataforma":"PC","anio":2022,"desarrollador":"FromSoftware","calificacion":9.7}'

# Actualizar un campo (PATCH)
curl -X PATCH http://localhost:3000/api/videojuegos/<ID> \
  -H "Content-Type: application/json" \
  -d '{"calificacion": 9.9}'

# Eliminar
curl -X DELETE http://localhost:3000/api/videojuegos/<ID>
```

### Códigos de respuesta

| Código | Situación |
|--------|-----------|
| 200 | Éxito (GET, PUT, PATCH, DELETE) |
| 201 | Creación exitosa (POST) |
| 400 | Datos inválidos o campos faltantes |
| 404 | Recurso o ruta no encontrada |
| 500 | Error interno del servidor |