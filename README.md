# 📦 Sistema de Control de Inventario & API RESTful

Backend robusto de nivel empresarial para el control de inventarios, desarrollado bajo el patrón **MVC (Model-View-Controller)** con **Node.js**, **Express**, **PostgreSQL** y **Sequelize ORM**. Cuenta con autenticación segura por portador (**JWT**), control de acceso basado en roles (**RBAC**), documentación interactiva auto-generada con **Swagger (OpenAPI 3.0)** y configuración optimizada para despliegue serverless en **Netlify**.

Adicionalmente, incorpora un **Dashboard de Administración (SPA)** de diseño moderno en el frontend que permite interactuar con la base de datos o correr en un modo demostrativo local (*Local Storage*).

---

<p align="center">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white" alt="Sequelize ORM" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
  <img src="https://img.shields.io/badge/-Swagger-%23C0E800?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/Netlify-%2300C7B7.svg?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
</p>

---

## 🧭 Tabla de Contenidos
- [✨ Características Principales](#-características-principales)
- [📂 Estructura del Proyecto (MVC)](#-estructura-del-proyecto-mvc)
- [⚙️ Especificaciones de la API (Endpoints)](#️-especificaciones-de-la-api-endpoints)
- [🚀 Instalación y Uso Local](#-instalación-y-uso-local)
- [💾 Siembra de Datos de Prueba (Seed)](#-siembra-de-datos-de-prueba-seed)
- [☁️ Despliegue Serverless en Netlify](#️-despliegue-serverless-en-netlify)

---

## ✨ Características Principales

1. **Arquitectura MVC Limpia:** Separación óptima entre lógica de negocio (Controladores), definición de esquemas (Modelos), transporte (Rutas) y middlewares de validación.
2. **Control de Acceso Basado en Roles (RBAC):**
   * 🛡️ **`admin`**: Acceso total. Puede crear, modificar y eliminar categorías y productos.
   * 👤 **`staff`**: Personal de almacén. Puede ver el catálogo y registrar transacciones manuales de entrada/salida de stock.
3. **Autenticación JWT:** Seguridad de endpoints usando tokens de portador firmados digitalmente.
4. **Manejo Centralizado y Robusto de Errores:** Filtro global que detecta errores operacionales e intercepta excepciones específicas de Sequelize (datos duplicados, SKU existentes, restricciones de claves foráneas) para responder con JSON amigable.
5. **Dashboard Administrativo SPA:** Interfaz web premium con diseño en modo oscuro incorporada en `/`. Soporta:
   * **Modo Demo (Local Storage):** Permite a reclutadores jugar con el inventario sin requerir servidores externos.
   * **Modo Live:** Se conecta en tiempo real a la API y sincroniza datos reales con PostgreSQL.

---

## 📂 Estructura del Proyecto (MVC)

```text
├── config/             # Configuración de base de datos PostgreSQL con Sequelize
├── controllers/        # Controladores (Lógica de operaciones JSON y respuestas HTTP)
├── middlewares/        # Middlewares (Verificación JWT, validación de roles, error handler)
├── models/             # Esquemas de modelos Sequelize y definición de relaciones
├── routes/             # Enrutadores de Express (Mapeo de endpoints y JSDoc)
├── public/             # Dashboard administrativo (SPA estática moderna en HTML/CSS/JS)
├── netlify/            # Punto de entrada para funciones serverless en Netlify
├── swagger/            # Inicialización y configuraciones de Swagger UI / OpenAPI 3.0
├── .env                # Variables de entorno de desarrollo
├── docker-compose.yml  # Configuración rápida de PostgreSQL local en Docker
├── seed.js             # Script para inicializar tablas e insertar datos de prueba
└── server.js           # Archivo de arranque principal del servidor HTTP Express
```

---

## ⚙️ Especificaciones de la API (Endpoints)

### 🔑 Módulo de Autenticación (`/api/v1/auth`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Público | Registra un nuevo usuario y retorna un token JWT. |
| `POST` | `/auth/login` | Público | Valida credenciales y devuelve un token JWT válido por 7 días. |
| `GET` | `/auth/me` | Autenticado | Retorna el perfil y rol del usuario firmado por el token. |

### 📁 Módulo de Categorías (`/api/v1/categories`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Autenticado | Obtiene el listado de categorías con sus productos embebidos. |
| `GET` | `/categories/:id` | Autenticado | Detalle de una categoría por su ID. |
| `POST` | `/categories` | `admin` | Crea una categoría. Impide nombres duplicados. |
| `PUT` | `/categories/:id` | `admin` | Edita el nombre o descripción de una categoría. |
| `DELETE` | `/categories/:id` | `admin` | Borra una categoría (bloqueado si tiene productos asignados). |

### 📦 Módulo de Productos (`/api/v1/products`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Autenticado | Lista productos. Filtros soportados: `search` (nombre/SKU), `categoryId` y `lowStock` (≤ 5). |
| `GET` | `/products/:id` | Autenticado | Obtiene la ficha de un producto. |
| `POST` | `/products` | `admin` | Crea un producto validando SKU único, precio/stock no negativos y categoría existente. |
| `PUT` | `/products/:id` | `admin` | Modifica datos del producto. |
| `DELETE` | `/products/:id` | `admin` | Elimina permanentemente un producto. |
| `POST` | `/products/:id/adjust-stock` | `admin` / `staff` | Registra entradas (`quantity` positivo) o salidas (`quantity` negativo) en el stock. |

---

## 🚀 Instalación y Uso Local

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/ByChokeYT/API-de-Inventario-RESTful.git
cd API-de-Inventario-RESTful
npm install
```

### 2. Configurar la base de datos
Si utilizas **Docker**, puedes levantar una instancia de PostgreSQL lista en segundos:
```bash
docker compose up -d
```
Si usas PostgreSQL local, asegúrate de crear una base de datos llamada `inventario_db` y configura tu archivo `.env` en la raíz con tus credenciales:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=inventario_db
JWT_SECRET=secreto_seguro_jwt
JWT_EXPIRES_IN=7d
```

### 3. Ejecutar inicialización y siembra
Crea la estructura de tablas e inserta los registros de prueba automáticamente:
```bash
npm run seed
```

### 4. Arrancar el servidor
```bash
npm run dev
```
* **Dashboard Administrativo:** [http://localhost:3000](http://localhost:3000)
* **Documentación Interactiva Swagger:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 💾 Siembra de Datos de Prueba (Seed)

La siembra inicial crea por defecto dos cuentas para probar el control de roles:

| Rol | Correo Electrónico | Contraseña | Capacidades |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@inventario.com` | `adminpassword123` | Control total del inventario |
| **Personal (Staff)** | `empleado@inventario.com` | `empleadopassword123` | Solo visualización y ajuste de stock |

---

## ☁️ Despliegue Serverless en Netlify

Este repositorio viene preconfigurado para ejecutarse en la infraestructura de Netlify mediante funciones Lambda (Serverless):

1. **Base de Datos:** Crea una base de datos en la nube usando proveedores gratuitos como **Neon.tech**, **Supabase** o **Render**.
2. **Conexión en Netlify:** Importa tu repositorio desde GitHub a Netlify.
3. **Variables de Entorno:** Configura los secretos en *Site Settings > Environment Variables* en Netlify con las credenciales de tu base de datos cloud y tu `JWT_SECRET`.
4. El archivo `netlify.toml` redirigirá todas las peticiones a la función serverless de Express de manera invisible para el cliente.
