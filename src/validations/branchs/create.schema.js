import { z } from "zod";


export const createBranchSchema = z.object({
    name: z
        .string({
            required_error: "Nombre es requerido",
        }),
    address: z
        .string({
            required_error: "Direccion es requerida",
        }),
    phone: z
        .string({
        required_error: "El número es requerido",
        invalid_type_error: "Estatus es formato invalido"
    }).regex(/^\d{3}-\d{3}-\d{4}$/, {
        message: "El formato debe ser 000-000-0000",
    }),
    status: z.boolean(
        {
            required_error: "Estatus es requerido",
            invalid_type_error: "Estatus es formato invalido"
        }),

})