export default class CustomError {

    static createError({
        name = 'Error',
        cause,
        message,
        code = 1
    }) {
        const error = new Error(message, {cause})
        error.cause = cause
        error.name = name
        error.message = message
        error.code = code
        // console.log(error);
        throw error
    }

}