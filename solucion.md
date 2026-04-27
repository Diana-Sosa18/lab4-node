# Depuración del Servidor Roto

## Resumen

Se identificaron y corrigieron **6 errores** en el archivo `servidor_malo.js`.

---

### Error #1: Content-Type incorrecto en la ruta `/info`

**Ubicación:** Línea 13 del archivo original

**Tipo de error:** HTTP / Protocolo

**Qué estaba mal:**
```js
res.writeHead(200, { "Content-Type": "application-json" })
```
El valor `"application-json"` no es un MIME type válido. Le falta la barra diagonal.

**Cómo lo corregí:**
```js
// Antes:
res.writeHead(200, { "Content-Type": "application-json" })

// Después:
res.writeHead(200, { "Content-Type": "application/json" })
```

**Por qué funciona ahora:**
El MIME type correcto para JSON es `application/json` (con `/`). Sin esto, el cliente no puede interpretar correctamente el tipo de contenido de la respuesta, lo cual puede causar problemas en navegadores, Postman y otras herramientas.

---

### Error #2: Falta `await` al leer el archivo

**Ubicación:** Línea 19 del archivo original

**Tipo de error:** Asincronía

**Qué estaba mal:**
```js
const texto = fs.readFile(filePath, "utf-8")
```
`fs.readFile` de `fs/promises` es una función asíncrona que devuelve una **Promise**. Sin `await`, `texto` contiene el objeto Promise, no el contenido real del archivo.

**Cómo lo corregí:**
```js
// Antes:
const texto = fs.readFile(filePath, "utf-8")

// Después:
const texto = await fs.readFile(filePath, "utf-8")
```

**Por qué funciona ahora:**
Con `await` se espera a que la Promise se resuelva y `texto` recibe el contenido del archivo como string. Esto funciona porque el callback del servidor está declarado como `async`.

---

### Error #3: `JSON.stringify` aplicado sobre un string

**Ubicación:** Línea 21 del archivo original

**Tipo de error:** Lógica

**Qué estaba mal:**
```js
res.end(JSON.stringify(texto))
```
Después del fix del Error #2, `texto` ya es un string con el contenido JSON del archivo. Aplicar `JSON.stringify` sobre un string lo convierte en un string escapado (envuelve el JSON en comillas y escapa los caracteres especiales), enviando al cliente algo como `"{\"nombre\":\"..."` en lugar del JSON real.

**Cómo lo corregí:**
```js
// Antes:
res.end(JSON.stringify(texto))

// Después:
res.end(texto)
```

**Por qué funciona ahora:**
`fs.readFile` con `"utf-8"` ya devuelve el contenido del archivo como string. Si el archivo es JSON válido, ese string ya puede enviarse directamente en la respuesta. `JSON.stringify` es necesario cuando tienes un objeto JavaScript y quieres convertirlo a string JSON; no cuando ya tienes el string.

---

### Error #4: Código de estado 200 en ruta no encontrada

**Ubicación:** Línea 26 del archivo original

**Tipo de error:** HTTP / Protocolo

**Qué estaba mal:**
```js
res.writeHead(200, { "Content-Type": "text/plain" })
res.end("Ruta no encontrada")
```
Se respondía con código **200 OK** a rutas que no existen. Esto es semánticamente incorrecto y confunde a los clientes HTTP.

**Cómo lo corregí:**
```js
// Antes:
res.writeHead(200, { "Content-Type": "text/plain" })

// Después:
res.writeHead(404, { "Content-Type": "text/plain" })
```

**Por qué funciona ahora:**
El código HTTP **404 Not Found** es el estándar para indicar que el recurso solicitado no existe en el servidor. Los clientes HTTP (navegadores, Postman, fetch) interpretan correctamente este código para manejar el error.

---

### Error #5: Paréntesis de cierre faltante en `createServer`

**Ubicación:** Línea 27 del archivo original

**Tipo de error:** Sintaxis

**Qué estaba mal:**
```js
const server = http.createServer(async (req, res) => {
  // ...todo el cuerpo del callback...
  res.end("Ruta no encontrada")
}   // ← falta el ")" de cierre
```
El método `http.createServer()` recibe una función como argumento. La llave `}` cierra la función, pero faltaba el `)` para cerrar la llamada al método.

**Cómo lo corregí:**
```js
// Antes:
}

// Después:
})
```

**Por qué funciona ahora:**
Node.js lanza un `SyntaxError` al intentar parsear el archivo si los paréntesis no están balanceados. El `)` cierra correctamente la invocación de `http.createServer(callback)`.

---

### Error #6: Paréntesis de cierre faltante en `server.listen`

**Ubicación:** Línea 30 del archivo original

**Tipo de error:** Sintaxis

**Qué estaba mal:**
```js
server.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:3000")
}   // ← falta el ")" de cierre
```
Igual que el error anterior, faltaba el `)` para cerrar la llamada a `server.listen()`.

**Cómo lo corregí:**
```js
// Antes:
}

// Después:
})
```

**Por qué funciona ahora:**
`server.listen(port, callback)` recibe el puerto y una función de callback como argumentos. Sin el `)` de cierre, Node.js no puede parsear el archivo y lanza un `SyntaxError` antes de ejecutar ninguna línea.