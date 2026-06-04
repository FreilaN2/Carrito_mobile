# Carrito Mobile 🛒

Una aplicación móvil moderna de comercio electrónico (estilo Farmatodo) construida con React Native (Expo) en el frontend y Node.js (Express + PostgreSQL) en el backend.

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu computadora:

- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- [PostgreSQL](https://www.postgresql.org/) (Corriendo en el puerto 5432)
- La aplicación **Expo Go** instalada en tu teléfono móvil (iOS o Android)

---

## 🛠️ Instalación y Configuración

El proyecto está dividido en dos partes principales: la aplicación móvil (raíz) y el servidor (`/backend`).

### 1. Configurar el Backend (Servidor)

1. Abre una terminal y navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias del servidor:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Duplica el archivo `.env.example` y renómbralo a `.env`
   - Abre el nuevo `.env` y configura tus credenciales de PostgreSQL y una contraseña secreta para el JWT. Debería verse algo así:
     ```env
     PORT=3000
     DB_NAME=carrito_db
     DB_USER=postgres
     DB_PASSWORD=tu_contraseña_aqui
     DB_HOST=localhost
     DB_PORT=5432
     JWT_SECRET=tu_secreto_super_seguro
     ```
4. Asegúrate de crear la base de datos `carrito_db` en tu PostgreSQL.
5. Regresa a la carpeta principal del proyecto:
   ```bash
   cd ..
   ```

### 2. Configurar el Frontend (App Móvil)

1. Estando en la carpeta principal (`Carrito_mobile`), instala las dependencias de la app:
   ```bash
   npm install
   ```
2. **¡Paso Crucial para el Móvil!**
   Abre el archivo `services/api.ts` y asegúrate de cambiar la constante `BASE_URL` por la **dirección IP real de tu computadora** en tu red Wi-Fi local. 
   Por ejemplo:
   ```typescript
   const BASE_URL = 'http://192.168.0.X:3000/api'; 
   ```
   *(Si usas `localhost`, el emulador funcionará, pero tu teléfono real no podrá conectarse al servidor de tu PC).*

---

## 🏃‍♂️ Cómo Ejecutar el Proyecto

Este proyecto cuenta con un script automatizado que te permite iniciar tanto el servidor backend como la aplicación de Expo **al mismo tiempo** con un solo comando.

1. Abre tu terminal en la carpeta principal (`Carrito_mobile`).
2. Ejecuta:
   ```bash
   npm run dev
   ```

Verás que la terminal se divide en colores:
- **[BACKEND]** te indicará que el servidor Node.js está corriendo en el puerto 3000 y conectado a la BD.
- **[EXPO]** te mostrará un código QR.

3. Abre la app **Expo Go** en tu celular y escanea el código QR para abrir la aplicación.

### (Opcional) Sembrar Productos de Prueba
Si quieres ver la app con datos reales desde el principio, puedes inyectar los productos de prueba ejecutando este comando en otra terminal (estando en la carpeta `backend`):
```bash
node src/seedProducts.js
```

---

## 📦 Estructura del Proyecto

- `/app` - Pantallas de la aplicación usando el enrutador basado en archivos (Expo Router).
- `/backend` - Todo el código del servidor (Controladores, Modelos de Sequelize, Rutas).
- `/components` - Componentes reutilizables de React Native.
- `/constants` - Paleta de colores y estilos globales de la aplicación.
- `/store` - Estado global (Zustand) para manejar el Carrito y la Sesión de Usuario.
- `/services` - Configuración de Axios para comunicarse con el Backend.

## 📱 Compilar para Producción

Cuando la aplicación esté lista para publicarse en las tiendas (APK / AAB), utiliza **EAS (Expo Application Services)**:

1. Instala el CLI de EAS globalmente: `npm install -g eas-cli`
2. Inicia sesión: `eas login`
3. Configura el proyecto: `eas build:configure`
4. Compila para Android: `eas build -p android --profile preview` (APK) o `production` (AAB).
*(Recuerda cambiar la IP local en `api.ts` por el dominio real de tu backend antes de compilar).*
