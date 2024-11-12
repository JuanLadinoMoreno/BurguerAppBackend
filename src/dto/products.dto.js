export class BurgerDTO {
    constructor({
        _id,
        aderesos,
        ingrePrep,
        nombre,
        pan,
        precio,
        preparacion,
        tipo,
        categoria,
        thumbnail,
        vegetales,
        status,
        stock,
        tipoRevolcado,
        ingredientesExtra,
        ingredientesRevolcado,
        tamanos,
        user,
        updatedAt,
    }) {
        this.id = _id;
        this.aderesos = aderesos;
        this.ingrePrep = ingrePrep;
        this.nombre = nombre;
        this.pan = pan;
        this.precio = precio;
        this.preparacion = preparacion;
        this.tipo = tipo;
        this.categoria = categoria;
        this.thumbnail = thumbnail;
        this.vegetales = vegetales;
        this.status = status;
        this.stock = stock;
        this.tipoRevolcado=tipoRevolcado;
        this.ingredientesExtra=ingredientesExtra;
        this.ingredientesRevolcado=ingredientesRevolcado;
        this.tamanos=tamanos;
        this.user = user;
        this.updatedAt = updatedAt;
    }
}