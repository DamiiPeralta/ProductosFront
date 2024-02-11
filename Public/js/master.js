$(document).ready(function() {

    // Manejar el envío del formulario de búsqueda
    $('#searchForm').submit(function(event) {
  
      // Evitar el envío del formulario por defecto
      event.preventDefault();
  
      // Obtener los valores de los campos de búsqueda
      var nombre = $('#nombre').val();
      var marca = $('#marca').val();
      var proveedor = $('#proveedor').val();
  
      // Realizar una solicitud AJAX al servidor con los datos de búsqueda
      $.ajax({
        url: '/search', // Ruta para la búsqueda de productos en el servidor
        method: 'GET',
        data: {
          nombre: nombre,
          marca: marca,
          proveedor: proveedor
        },
        dataType: 'json',
        success: function(response) {
          // Limpiar el contenedor de productos
          $('#productosContainer').empty();
  
          // Verificar si se encontraron productos
          if (response.productos && response.productos.length > 0) {
            // Iterar sobre los productos y agregarlos al contenedor
            response.productos.forEach(function(producto) {
              // Crear el HTML para cada producto
              var productoHtml = '<div class="card">';
              productoHtml += '<div class="card-body">';
              productoHtml += '<h5 class="card-title">' + producto.nombre + '</h5>';
              productoHtml += '<p class="card-text">Marca: ' + producto.marca + '</p>';
              productoHtml += '<p class="card-text">Proveedor: ' + producto.proveedor.nombre + '</p>';
              productoHtml += '<p class="card-text">Cantidad: ' + producto.cantidad + '</p>';
              // Agregar más información si es necesario
              productoHtml += '</div></div>';
  
              // Agregar el producto al contenedor
              $('#productosContainer').append(productoHtml);
            });
          } else {
            // Mostrar un mensaje si no se encontraron productos
            $('#productosContainer').html('<h1>No se encontraron productos</h1>');
          }
        },
        error: function(xhr, status, error) {
          // Mostrar un mensaje de error
          console.error('Error al buscar productos:', error);
          $('#productosContainer').html('<p>Error al buscar productos</p>');
        }
      });
    });
  });
  