import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const sizeSchema = z.object({
    nombre: z.string({
        required_error: "Debes incluir nombre del tamaño",
    }),
    precio: z.number({
        required_error: "Debes incluir el precio del producto",
        invalid_type_error: "El precio del tamaño debe ser un número",
    }),
});

const ingredienteExtraSchema = z.object({
    nombre: z.string({
        required_error: "Debes incluir nombre de ingrediente extra",
    }),
    precio: z.number({
        required_error: "Debes incluir el precio del ingrediente extra",
        invalid_type_error: "El precio de ingrediente extra debe ser un número",
    }),
});

const ingredienteRevolcadoSchema = z.object({
    nombre: z.string({
        required_error: "Debes incluir nombre de ingrediente revolcado",
    }),
    precio: z.number({
        required_error: "Debes incluir el precio del ingrediente revolcado",
        invalid_type_error: "El precio de ingrediente revolcado debe ser un número",
    }),
});
const productCartSchema = z.object({
    pid: z.string({ required_error: "Id del producto es requerido" }).regex(
        objectIdRegex, {
        message: "El ID debe tener formato MongoDB (24 caracteres hex)",
    }),
    quantity: z.number({
        required_error: "Cantidad es requerida",
        invalid_type_error: "Cantidad debe ser un numero",
    }).min(1, "Cantidad mínima: 1"),
    ingredientesExtra: z.array(ingredienteExtraSchema).optional(),

    selectedRevolcado: ingredienteRevolcadoSchema
        .optional()
        .or(z.literal(null))
        .transform(val => val === null ? {} : val),

    size: sizeSchema.optional().or(z.literal(null)).transform(val => val === null ? {} : val)
});

// Esquema principal
export const updateCartsSchema = z.object({
    products: z.array(productCartSchema).default([]),

    customer: z.union([
        z.string().regex(objectIdRegex),
        z.null(),
        z.literal("")
    ]).optional().transform(v => v === "" ? null : v),

    totalPrice: z.number({
        required_error: "Precio total es requerida",
        invalid_type_error: "Precio total debe ser un numero",
    }),

    branch: z.string({
        required_error: "Id de sucursal es requerido",
    }).regex(
        objectIdRegex, {
        message: "El ID debe tener formato MongoDB (24 caracteres hex)",
    }).optional(),

    tableNumber: z.number({
        required_error: "Numero de mesa es requerida",
        invalid_type_error: "Numero de mesa debe ser un numero",
    }),

    orderType: z.string({
        required_error: "Tipo de orden es requerida",
        invalid_type_error: "Tipo de orden debe ser un string",
    })
})

export const idParamSchema = z.object({
  cid: z.string().min(1, "El ID es requerido").regex(objectIdRegex, {
    message: "El ID debe tener formato MongoDB (24 caracteres hex)",
  }),
});