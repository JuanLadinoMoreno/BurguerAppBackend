# BurguerRoblesApp 🍔🍟

_Backend para la admimistración de comandas para pequeños restaurantes de comida rapida o cafeterías._

## Acciones 
_- Administración de usuarios, clientes, productos y sucursales desde un panel de gestión._
_- Implementación de autenticación segura con JWT y sistema de roles para gestionar permisos._
_- Gestión de comandas para pedidos en mesa o para llevar._
_- Generación de tickets, con opción de impresión o envío por correo electrónico._
_- Dashboard con reportes filtrables por sucursal, año y categoría._
_- Funcionalidad para exportar datos en Excel, facilitando el análisis de ventas y la toma de decisiones._

### Pre-requisitos 📋

_Que cosas necesitas para instalar el software_

```
Node.js en su version v16.18.0
MongoDB (local o en la nube, como MongoDB Atlas)

```

### Instalación 🔧

_Descargar el repositorio, despues descomprimir el archivo zip y en seguida abrirlo con visual studio code_

_En una nueva terminal ejecutar el comando npm install_

```
npm install

```
_Crea un archivo .env en la raiz del proyecto y añade las siguientes variables_

```
PORT=8080
NOTES_APP_MONGODB_HOST=user:password (local)
NOTES_APP_MONGODB_DATABASE=DataBaseName (local)

URL_MONGO_DBATLAS=mongodb+srv://<usuario>:<password>@cluster.mongodb..net
TOKEN_SECRET=clave_secreta
GMAIL_ACCOUNT=tu_correo@gmail.com
GMAIL_PASSWORD=tu_contraseña

```

## Construido con 🛠️

_Tecnologias utilizadas_

*  Node.js
*  Express
*  MongoDb & Mongoose
*  JWT
*  Nodemailer (envio de correos)

## Autores ✒️

_Personas que ayudaron a levantar el proyecto desde sus inicios_

* **Juan Simón Ladino Moreno** - *Trabajo Inicial* 

---
⌨️ con ❤️ por [S@YM0N] 😊
