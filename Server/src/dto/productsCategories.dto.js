export class ProductsCategoriesDTO {

    constructor({
        _id, 
        ids, 
        nombre, 
        thumbnail
    }) {
        this.id = _id;
        this.ids = ids;
        this.nombre = nombre;
        this.thumbnail = thumbnail
    }
}