import { z } from "zod";

export const updateBranchSchema = z.object({
    name: z.string({
        invalid_type_error: "El nombre debe ser string",
        required_error: "Debes incluir nombre de sucursal",
    }).optional(),
    address: z.string({invalid_type_error: "Verifique el valor de direccion"}).optional(),
    phone: z
        .string({invalid_type_error: "Verifique el valor de telefono"})
        .regex(/^\d{3}-\d{3}-\d{4}$/, {
            message: "El formato debe ser 000-000-0000",
        })
        .optional(),
    status: z.boolean({invalid_type_error: "Verifique el valor de estatus",}).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
});


export const idParamSchema = z.object({
  bid: z.string().min(1, "El ID es requerido").regex(/^[a-f\d]{24}$/i, {
    message: "El ID debe tener formato MongoDB (24 caracteres hex)",
  }),
});