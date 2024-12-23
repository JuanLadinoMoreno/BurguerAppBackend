export class BranchsDTO {

    constructor({
        _id,
        name,
        address,
        phone,
        status,
        updatedAt,
    }) {
        this.id = _id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.status = status;
        this.updatedAt = updatedAt;
    }

}