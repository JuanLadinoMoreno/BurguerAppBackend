export const generateInvalidUserDataError = ({ firstName, lastName, age, email, password }) => {
    return `Invalid user data:
        * firstName : should be a non-empty String, received ${firstName} (${typeof firstName})
        * lastName  : should be a non-empty String, received ${lastName} (${typeof lastName})
        * age  : should be a non-empty Integer, received ${age} (${typeof age})
        * email  : should be a non-empty String, received ${email} (${typeof email})
        * password  : should be a non-empty String, received ${password} (${typeof password})
    
    `
}
export const generateInvalidUserLoginDataError = ({ email, password }) => {
    return `Invalid user data:
        * email  : should be a non-empty String, received ${email} (${typeof email})
        * password  : should be a non-empty String, received ${password} (${typeof password})
    
    `
}

export const generateFindUserDataError = () => {
    return `The user is already registered: `
}

export const generateNoFoundUserDataError = () => {
    return `The user is not registered: `
}
// export default generateInvalidUserDataError