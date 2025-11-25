ChatGPT dijo:

Aquí tienes el README FINAL, limpio, directo y listo para pegar en GitHub:

📦 Proyecto — Comercializadora de Productos Médicos
IS-601 — Base de Datos II
Tercer Periodo 2025
Proyecto Final — Grupo #1

Integrantes:

20212020267 — Alex Rivera

20172030733 — Darwin Hernández

20181006066 — Kathy Sierra

20191001199 — Kimberly Ávila

20181002779 — Krewin José Murillo

📁 Estructura del Proyecto
Proyecto/
│── BackEnd/        → API en .NET 8
│── FrontEnd/       → Aplicación React JS
└── BD/             → Scripts SQL (tablas, SP, datos)

🚀 Tecnologías Utilizadas

Backend: .NET 8, Entity Framework Core, SQL Server, Stored Procedures
Frontend: React JS, JavaScript, Fetch API, Toasts de notificación
Base de Datos: SQL Server + SP para CRUD + eliminación lógica

⚙️ Configuración del Backend

Ubicarse en la carpeta BackEnd

Configurar la conexión en appsettings.json:

"ConnectionStrings": {
  "DefaultConnection": "Server=DESKTOP-U7AG6Q1;Database=ProyectoBD2;Trusted_Connection=True;TrustServerCertificate=True;"
}


Ejecutar:

dotnet restore
dotnet run


Swagger disponible en:
➡️ https://localhost:7132/swagger

🌐 Configuración del FrontEnd

Ir a la carpeta FrontEnd

Instalar dependencias:

npm install
npm start


Abrirá en:
➡️ http://localhost:3000

🗄️ Base de Datos

En la carpeta BD ejecutar:

Script de tablas

Stored Procedures

Datos iniciales

🧪 Endpoints Principales
Operación	Método	Endpoint
Obtener productos	GET	/api/Product/GetAll
Insertar producto	POST	/api/Product/Insert
Actualizar producto	PUT	/api/Product/Update
Eliminar producto (lógico)	DELETE	/api/Product/Delete
✔️ Funcionalidades Principales

CRUD completo de productos

Eliminación lógica

Notificaciones con toasts

UI en React moderna y funcional

Validación básica de campos

API conectada a SQL Server usando Stored Procedures