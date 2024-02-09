// index.js

const express = require('express');
const sql = require('mssql');

const app = express();
const port = 3000;

// Configuración de conexión a SQL Server
const config = {
  user: 'Tienda',
  password: '123456',
  server: '192.168.1.37', // Puede ser una dirección IP o nombre de host
  database: 'Tienda',
  port: 1433,
  options: {
    encrypt: true, // Usar si estás en Azure
    trustServerCertificate: true // Usar si estás en Azure
  }
};
// Conectar a la base de datos
sql.connect(config, (err) => {
  if (err) {
    console.error('Error al conectar a SQL Server:', err);
  } else {
    console.log('Conexión a SQL Server establecida');
  }
});

// Configurar la carpeta de archivos estáticos
app.use(express.static('public'));

// Establecer el motor de plantillas EJS
app.set('view engine', 'ejs');

// Ruta principal
app.get('/', (req, res) => {
  // Realizar una consulta de ejemplo a la tabla Producto
  const request = new sql.Request();
  request.query('SELECT * FROM Producto', (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en la consulta a la base de datos');
    } else {
      // Renderizar la página con los resultados de la consulta
      res.render('index', { productos: result.recordset });
    }
  });
});
app.get('/', (req, res) => {
  // Realizar una consulta de ejemplo
  const request = new sql.Request();
  request.query('SELECT * FROM Producto', (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en la consulta a la base de datos');
    } else {
      // Renderizar la página con los resultados de la consulta
      res.render('index', { data: result.recordset });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});
