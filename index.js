const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 3000;
app.use(express.static('public'));

// Configuración de conexión a SQL Server
const sequelize = new Sequelize('Tienda', 'Tienda', '123456', {
  host: '192.168.1.37',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true, // Usar si estás en Azure
      trustServerCertificate: true // Usar si estás en Azure
    }
  }
});

// Definir modelos utilizando Sequelize
const Producto = sequelize.define('Producto', {
  id_producto: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  marca: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  cantidad: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  id_proveedor: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  calidad: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  url_imagen: {
    type: Sequelize.STRING(500),
    allowNull: true
  },
  descripcion: {
    type: Sequelize.STRING(1000),
    allowNull: true
  },
  precio_compra: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  freezeTableName: true // Esto evita que Sequelize pluralice el nombre de la tabla
});

const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  direccion: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  contacto: {
    type: Sequelize.STRING(50),
    allowNull: true
  },
  telefono: {
    type: Sequelize.STRING(15),
    allowNull: true
  }
}, {
  freezeTableName: true // Esto evita que Sequelize pluralice el nombre de la tabla
});

// Asociación entre modelos
Producto.belongsTo(Proveedor, {
  foreignKey: 'id_proveedor',
  as: 'proveedor'
});

// Configuración de EJS como motor de vistas
app.set('view engine', 'ejs');

// Ruta principal
app.get('/', async (req, res) => {
  try {
    // Obtener todos los productos con sus proveedores
    const productos = await Producto.findAll({
      attributes: ['id_producto', 'nombre', 'marca', 'cantidad', 'calidad', 'url_imagen', 'descripcion', 'precio_compra'],
      include: [{ model: Proveedor, as: 'proveedor', attributes: ['id_proveedor', 'nombre', 'direccion', 'contacto', 'telefono'] }]
    });
    
    res.render('index', { productos });
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error al obtener productos');
  }
});

// Ruta para mostrar la página de búsqueda
app.get('/search', (req, res) => {
  res.render('search');
});

// Ruta para manejar la búsqueda de productos
app.get('/search', async (req, res) => {
  const { nombre, marca, proveedor } = req.query;

  try {
    let whereClause = {};

    // Construir la cláusula WHERE según los parámetros proporcionados
    if (nombre) {
      whereClause.nombre = { [Sequelize.Op.like]: `%${nombre}%` };
    }
    if (marca) {
      whereClause.marca = { [Sequelize.Op.like]: `%${marca}%` };
    }
    if (proveedor) {
      whereClause['$proveedor.nombre$'] = { [Sequelize.Op.like]: `%${proveedor}%` };
    }

    // Buscar productos según los criterios proporcionados
    const productos = await Producto.findAll({
      attributes: ['id_producto', 'nombre', 'marca', 'cantidad', 'calidad', 'url_imagen', 'descripcion', 'precio_compra'],
      include: [{ model: Proveedor, as: 'proveedor', attributes: ['id_proveedor', 'nombre', 'direccion', 'contacto', 'telefono'] }],
      where: whereClause
    });

    // Si la solicitud es AJAX, devolver los datos como JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({ productos });
    } else {
      // Si no es AJAX, renderizar la página de búsqueda
      res.render('search', { productos });
    }
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ error: 'Error al buscar productos' }); // Devolver error como JSON
  }
});


// Iniciar servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a SQL Server establecida');
    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a SQL Server:', err);
  });
