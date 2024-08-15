import ErrorCodes from "../../services/errors/errorCodes.js";

/**
 * @type {import("express").ErrorRequestHandler}
 */

// export const errorHandler = (error, req, res, next) => {
//     switch (error.code) {
//         case ErrorCodes.INVALID_TYPES_ERROR:
//             res.status(400).send({ status: 'error', error: error.message })
//             break
//         case ErrorCodes.EXISTING_DATA:
//             res.status(409).send({ status: 'error', error: error.message })
//             break
//         case ErrorCodes.INVALID_CREDENTIALS:
//             res.status(400).send({ status: 'error', error: error.message })
//             break
//         default:
//             res.status(500).send({ status: 'error', error: 'Unknown' })
//     }
// }

export const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case ErrorCodes.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.MISSING_REQUIRED_FIELDS:
            res.status(400).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.INVALID_FORMAT:
            res.status(400).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.EXISTING_DATA:
            res.status(409).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.INVALID_CREDENTIALS:
            res.status(401).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.UNAUTHORIZED_ACCESS:
            res.status(403).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.NOT_FOUND:
            res.status(404).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.OUT_OF_STOCK:
            res.status(409).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.PAYMENT_FAILED:
            res.status(402).send({ status: 'error', error: error.message });
            break;
        default:
            res.status(500).send({ status: 'error', error: 'Unknown error' });
    }
};

