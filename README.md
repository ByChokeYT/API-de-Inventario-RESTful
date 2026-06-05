# API de Inventario RESTful (Node.js + Express + PostgreSQL + JWT + Swagger)

Este es un backend robusto de nivel de producción para la gestión de inventarios, desarrollado bajo el patrón de arquitectura **MVC (Modelo-Vista-Controlador)**. Incluye control de accesos basado en roles (RBAC), autenticación con tokens **JWT**, base de datos relacional **PostgreSQL** mediante **Sequelize ORM**, documentación interactiva con **Swagger** y soporte para despliegue **serverless en Netlify**.

Además, cuenta con una interfaz web administrativa (SPA) moderna integrada, que soporta tanto interacción directa con la API como un modo demostrativo local (*Local Storage*) para portfolios.

---

## 🛠️ Tecnologías Utilizadas

* **Runtime:** Node.js (ES Modules)
* **Framework Web:** Express.js
* **Base de Datos:** PostgreSQL
* **ORM:** Sequelize
* **Seguridad y Autenticación:** JSON Web Tokens (JWT) & Bcrypt.js (cifrado)
* **Documentación:** Swagger UI & Swagger JSDoc (OpenAPI 3.0)
* **Contenedores/Despliegue:** Docker Compose, Netlify Serverless Functions & Serverless HTTP

---

## ✨ Características Principales

1. **Arquitectura MVC Limpia:** Separación estricta de responsabilidades (Modelos para persistencia, Rutas para transporte, Controladores para lógica de negocio y Middlewares para seguridad/validación).
2. **Control de Acceso Basado en Roles (RBAC):**
   * `admin`: Permisos de administración total (Crear, editar, y borrar productos y categorías).
   * `staff`: Permisos de lectura de inventario y registro manual de movimientos de stock (entradas/salidas).
3. **Manejo Centralizado de Errores:** Control de errores operacionales, formateo amigable de excepciones de Sequelize (validaciones e integridad de claves foráneas) y logs de servidor.
4. **Documentación Swagger Interactiva:** Acceso directo a endpoints documentados visualmente en `/api-docs` para pruebas rápidas de peticiones.
5. **Dashboard Administrativo Integrado:** Interfaz web premium con diseño oscuro para visualización del valor total del inventario, alertas de stock bajo y operaciones CRUD.
6. **Listo para Serverless:** Configuración out-of-the-box para despliegue serverless en Netlify Functions.

---

## 📂 Estructura del Proyecto

```text
├── config/             # Configuración de base de datos PostgreSQL
├── controllers/        # Controladores (Lógica de negocio y procesamiento JSON)
├── middlewares/        # Middlewares (Autenticación JWT, roles, errores)
├── models/             # Modelos de base de datos y asociaciones (Sequelize)
├── routes/             # Enrutadores Express (Rutas documentadas con JSDoc)
├── public/             # Interfaz web estática (Dashboard interactivo SPA)
├── netlify/            # Adaptadores para despliegue serverless
├── swagger/            # Configuración general de Swagger/OpenAPI
├── .env                # Variables de entorno de configuración
├── docker-compose.yml  # Configuración para levantar base de datos en Docker
├── seed.js             # Script de siembra para base de datos de prueba
└── server.js           # Punto de arranque principal del servidor Express
```

---

## 🚀 Guía de Instalación y Uso Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/api-inventario-restful.git
cd api-inventario-restful
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto basándote en las siguientes variables:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres
DB_NAME=inventario_db
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=7d
```

### 4. Inicializar y Sembrar la Base de Datos
Si usas **Docker**, puedes arrancar la base de datos PostgreSQL ejecutando:
```bash
docker compose up -d
```
Luego ejecuta el script utilitario para crear la base de datos en Postgres y sembrar los datos iniciales de prueba:
```bash
npm run seed
```
Este comando creará automáticamente los siguientes usuarios de demostración:
* **Administrador:** `admin@inventario.com` / `adminpassword123`
* **Personal (Staff):** `empleado@inventario.com` / `empleadopassword123`

### 5. Iniciar el servidor
```bash
npm run dev
```
* Acceso a la interfaz web: [http://localhost:3000](http://localhost:3000)
* Acceso a la documentación Swagger: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## ☁️ Despliegue en Netlify

El proyecto ya incluye la configuración lista en `netlify.toml` y `netlify/functions/api.js`.

1. Conecta tu repositorio Git a **Netlify**.
2. Hospeda tu base de datos PostgreSQL en un proveedor cloud como **Neon.tech** (Recomendado y gratuito), **Supabase** o **Render**.
3. Configura tus variables de entorno en el panel de Netlify (*Site Settings > Environment Variables*) apuntando a tu base de datos en la nube.
4. Define el directorio de publicación en Netlify como `public` y la carpeta de funciones como `netlify/functions` (se lee automáticamente del `netlify.toml`).
