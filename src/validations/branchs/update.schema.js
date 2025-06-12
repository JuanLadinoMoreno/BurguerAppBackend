import { z } from "zod";

export const updateBranchSchema = z.object({
    name: z.string({
        required_error: "Debes incluir nombre de sucursal",
    }),
    address: z.string().optional(),
    phone: z
        .string()
        .regex(/^\d{3}-\d{3}-\d{4}$/, {
            message: "El formato debe ser 000-000-0000",
        })
        .optional(),
    status: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
});
