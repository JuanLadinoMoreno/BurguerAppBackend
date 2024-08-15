# BurguerRoblesApp.web

En la barra de navegacio se encuentra un icono de un 

En el footer esta un logo y abajo dice Burguer Robles, ese es un link que manda al login, al acceder nos va a mandar a la seccion de la actividad, para poder entrar a la lista de productos debemos estar logeados, en caso de no tener una cuenta podra registrarse dando clic al final del formulario, al logearse en el sistema va a mostrar un listado de productos,(estos productos los manda a traer desde la base de datos), tambien aparece un menú de categorias (al igual las categorias se encuantran en la base de datos), al dar clic al imagen o en el boton de ordenar nos mandara a la pagina de detalles del producto usando el id de este, ahi podremos agregar la cantidad, en el boton en carrito podremos ver los productos agregados, al darclick en comprar ahora el carrito se guardara en la base de datos en carts.

Para el desarrollo, dentro de la carpeta burguerRoblesApp se encuentra la carpeta Pages, ahi se encuentra el archivo Menu, este tiene un componente hijo que es ItemListContainer (ubicado en components/Pages/Menu/ItemListContainer.jsx) el cual contiene la actividad, ahi se muestran los productos y se pueden ir eliminando, dentro de ItemDetailContaoner tiene el componente ItemCount el cual tiene la funcionalidad de agregar el producto al carrito(pid, quantity), en services/productServices.js se encuantran las llamadas al api, dentro de pages/cart.jsx, se encuentra la funcionalidad del carrito, para la creacion de productos no he puesto algun boton o algo que nos permita direcionar pero la ruta es la siguiente http://localhost:5173/menu/addproduct 

En la carpeta server se encuentra el servidor

Para la creacion de cookies estoy usando json web token, la cookie se almacena en el navegador y el backend verifica que sea correcta

Para ver los carritos creados solo se pueden visualizar en el endpoint http://localhost:8080/api/carts, en este endpoint tengo implementado pupulation(), me falta crear la interfaz

La base de datos que estoy ocupando es local, en el archivo BuerguerRobles.rar se encuentra una base de datos



