

export  const templateHtmlCarrito = (carrito) => {
    const ordenNo = carrito._id.toString().substr(-4, 4)
    return `
    <p>Hola ${carrito.customer.firstName + ' ' + carrito.customer.lastName +'!'},</p>
    <p>🍔🍟 Gracias por tu confianza!, 🌭🥪</p>    
    <h3>Orden: ${ordenNo},</h3>
    <h2>Resumen de tu pedido</h2>
    <table border="1" cellspacing="0" cellpadding="5">
        <thead>
            <tr>
                <th>Cantidad</th>
                <th>Producto</th>
                <th>Extras</th>
                <th>Precio</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            ${carrito.products.map(producto => `
                <tr>
                    <td>${producto.quantity}</td>
                    <td>${producto.pid.nombre}</td>
                    <td>
                        ${producto.size ? `<p>Tamaño: ${producto.size.nombre} (+$${producto.size.precio})</p>` : ''}
                        ${producto.selectedRevolcado ? `<p>Sabor: ${producto.selectedRevolcado.nombre} (+$${producto.selectedRevolcado.precio})</p>` : ''}
                        ${producto.ingredientesExtra.length > 0 ? `<p>Ingredientes extra: ${producto.ingredientesExtra.map(ingre => `${ingre.nombre} (+$${ingre.precio})`).join(', ')}</p>` : ''}
                    </td>
                    <td>$${producto.pid.precio}</td>
                    <td>$${(
                        (producto.pid.precio) +
                        (producto.size ? producto.size.precio : 0) +
                        (producto.selectedRevolcado ? producto.selectedRevolcado.precio : 0) +
                        (producto.ingredientesExtra.length > 0 ? producto.ingredientesExtra.reduce((acc, ingre) => acc + ingre.precio, 0) : 0)
                    ) * producto.quantity}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <h3>Total: $ ${carrito.totalPrice} </h3>
    <img src='cid:logoP' style="width:120px; height:120px;"/>
    `;
};
