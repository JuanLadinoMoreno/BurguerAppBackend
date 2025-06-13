import { z } from "zod";

export const updateSchema = z.object({
    firstName: z
        .string({
            required_error: "Nombre es requerido",
        }).optional(),
    lastName: z
        .string({
            required_error: "Apellido es requerido",
        }).optional(),
    phone: z
        .string({
            required_error: "Telefono es requerido",
            invalid_type_error: "Telefono es invalido"
        }).optional(),
    email: z
        .string({
            required_error: "Email es requerido ",
        })
        .email({
            message: "Email invalido",
        }).optional(),
})


export const idParamSchema = z.object({
  cid: z.string().min(1, "El ID es requerido").regex(/^[a-f\d]{24}$/i, {
    message: "El ID debe tener formato MongoDB (24 caracteres hex)",
  }),
});