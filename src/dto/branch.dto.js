export class BranchsDTO {

    constructor({
        _id,
        name,
        address,
        phone,
        updatedAt,
    }) {
        this.id = _id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.updatedAt = updatedAt;
    }

}