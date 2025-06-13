import { z } from "zod";

export const createSchema = z.object({
    firstName: z
        .string({
            required_error: "Nombre es requerido",
        }),
    lastName: z
        .string({
            required_error: "Apellido es requerido",
        }),
    phone: z
        .string({
            required_error: "Telefono es requerido",
            invalid_type_error: "Telefono debe ser un string",
        }),
    email: z
        .string({
            required_error: "Email es requerido ",
        })
        .email({
            message: "Email invalido",
        })
})