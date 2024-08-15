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
        thumbnail,
        vegetales,
        status,
        stock,
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
        this.thumbnail = thumbnail;
        this.vegetales = vegetales;
        this.status = status;
        this.stock = stock;
        this.user = user;
        this.updatedAt = updatedAt;
    }
}