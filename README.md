# E-Commerce Backend API

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-green) ![JWT](https://img.shields.io/badge/JWT-Auth-orange)

## Descripción

Este es un backend completo para un e-commerce simple desarrollado en **Node.js** con **TypeScript**, como trabajo de cursada de la materia Metodologías y Desarrollo Web de la carrera Ingeniería en Sistemas Informáticos de la Universidad Abierta Interamericana en Rosario, Argentina. Incluye autenticación segura con JWT (access y refresh tokens persistidos en cookies HTTP-only), CRUD completo de productos, gestión de carrito de compras, y conexión a **MongoDB** como base de datos NoSQL. El proyecto está diseñado para ser desplegado en **Vercel** y soporta hasta 3 personas en colaboración.

**Objetivo**: Integrar conceptos de autenticación, seguridad, persistencia de datos y despliegue en la nube.

## Características

- **Autenticación**: Registro, login, logout y refresh de tokens con JWT.
- **Tokens Seguros**: Access token (expira en 15 min) y refresh token (expira en 7 días), almacenados en cookies HTTP-only.
- **CRUD de Productos**: Crear, leer, actualizar y eliminar productos (protección con middleware de auth para acciones de escritura).
- **Gestión de Carrito**: Añadir, actualizar y eliminar items, asociado al usuario autenticado.
- **Base de Datos**: MongoDB con Mongoose para modelos y relaciones.
- **Seguridad**: Hashing de contraseñas con bcrypt, validaciones en controladores.
- **Despliegue**: Listo para Vercel con scripts de build y start.

## Resumen y Documentación de la API

URL Base: `http://localhost:3000/api`.

URL de Vercel: [https://ecommerce-backend-mdw.vercel.app/](https://ecommerce-backend-mdw.vercel.app/api/docs/)

| Categoría | Endpoints Principales | Requiere Auth? |
|-----------|-----------------------|---------------|
| **Autenticación** | POST /auth/register, POST /auth/login, POST /auth/logout, POST /auth/refresh | No (excepto logout/refresh) |
| **Productos (CRUD)** | GET /products, GET /products/:id, POST /products, PUT /products/:id, DELETE /products/:id | Sí para POST/PUT/DELETE |
| **Carrito** | GET /cart, POST /cart/add, PUT /cart/update, DELETE /cart/remove/:productId | Sí |

Para detalles completos (schemas, ejemplos, errores), consulta la documentación interactiva en [/api/docs](https://ecommerce-backend-mdw.vercel.app/api/docs/).

## Contacto

Creado por Luciano Federico Pereira (ZaikoARG).  
Enlace al repositorio: [https://github.com/ZaikoARG/ecommerce-api-MDW/](https://github.com/ZaikoARG/ecommerce-api-MDW/).
