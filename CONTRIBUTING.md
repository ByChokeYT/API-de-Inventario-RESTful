# 🤝 Guía de Colaboración (Contributing Guide)

¡Gracias por tu interés en colaborar en el **Sistema de Control de Inventario (Stockify)**! Este es un proyecto de código abierto y agradecemos enormemente las contribuciones de la comunidad en GitHub, ya sea reportando errores, mejorando la documentación o escribiendo código.

Para garantizar una colaboración fluida y ordenada, por favor lee las siguientes pautas antes de comenzar.

---

## 🧭 ¿Cómo puedo colaborar?

Puedes contribuir al proyecto de tres maneras principales:

1. **Reportar Errores (Bugs):** Si encuentras algo que no funciona como debería, por favor abre un [Issue](https://github.com/ByChokeYT/API-de-Inventario-RESTful/issues) describiendo detalladamente el problema, los pasos para reproducirlo y el comportamiento esperado.
2. **Sugerir Características:** Si tienes una idea para mejorar la API o el dashboard, abre un Issue etiquetándolo como una solicitud de nueva funcionalidad (*feature request*).
3. **Enviar Código (Pull Requests):** Si deseas resolver un bug o implementar una nueva característica tú mismo, sigue los pasos a continuación.

---

## 🛠️ Proceso para Enviar Código (Pull Request)

Para realizar contribuciones de código en este repositorio, por favor sigue este flujo de trabajo:

### Paso 1: Crear un Fork y Clonar
Realiza un Fork de este repositorio a tu propia cuenta de GitHub y clónalo localmente:
```bash
git clone https://github.com/tu-usuario/API-de-Inventario-RESTful.git
cd API-de-Inventario-RESTful
```

### Paso 2: Crear una Rama de Trabajo (Branch)
Crea una rama con un nombre descriptivo partiendo de la rama `main`. Usa los siguientes prefijos recomendados:
* `feature/` para nuevas funcionalidades (Ej: `feature/alerta-stock-email`)
* `bugfix/` para la corrección de errores (Ej: `bugfix/token-jwt-expirado`)
* `docs/` para mejoras de documentación (Ej: `docs/corregir-README`)

```bash
git checkout -b feature/nombre-de-tu-caracteristica
```

### Paso 3: Realizar Cambios y Testear
Escribe tu código respetando las pautas de estilo del proyecto (ver más abajo) y verifica que el servidor arranque correctamente en tu entorno local mediante `npm run dev`.

### Paso 4: Confirmar Cambios (Commits)
Realiza commits con mensajes claros, descriptivos y en español/inglés usando la convención de Git convencional (*Conventional Commits*):
```bash
git commit -m "feat: agregar endpoint para reporte PDF de inventario"
```

### Paso 5: Subir Cambios y Abrir Pull Request
Sube tu rama a tu repositorio clonado en GitHub y abre un Pull Request hacia la rama `main` del repositorio original.
```bash
git push origin feature/nombre-de-tu-caracteristica
```

---

## 📏 Pautas de Estilo de Código

Para mantener la consistencia en el codebase, te solicitamos cumplir con los siguientes estándares:

* **Sintaxis Moderna:** Usamos JavaScript moderno con **ES Modules** (`import/export` en lugar de `require`).
* **Nombrado:**
  * Variables, funciones y carpetas en `camelCase` (Ej. `productController.js`).
  * Modelos y clases de Sequelize en `PascalCase` (Ej. `User.js`, `Category.js`).
  * Rutas HTTP en minúsculas y plural (Ej. `/api/v1/products`).
* **Gestión Asíncrona:** Utilizar la estructura `async/await` en conjunto con bloques `try/catch` para manejar promesas en los controladores, delegando los errores al manejador global mediante `next(error)`.

---

## 📄 Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente respetuoso, inclusivo y libre de acoso para todos los miembros y colaboradores de la comunidad.
