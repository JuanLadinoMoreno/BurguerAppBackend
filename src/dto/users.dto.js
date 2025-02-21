export class usersDto {
    constructor({ _id, firstName, lastName, age, email, password, role, lastConnection, branch }) {
        this.id = _id
        this.firstName = firstName
        this.lastName = lastName
        this.age = age
        this.email = email
        this.password = password
        this.role = role
        this.lastConnection = lastConnection
        this.branch = branch 
            ? { 
                id: branch._id, 
                name: branch.name 
            }
            : null;
    }
}
