import { z } from "zod";

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

const categoryValues = ['comida','bebida','snack']

const categorySchema = z.string({
    required_error: "Categoria es requerida",
    invalid_type_error: "Categoria debe ser un string",
}).refine((val) => categoryValues.includes(val), {
    message: "Categoria debe ser una categoría válida",
});


const tipoValues = [
    'burguerP', 'bagP', 'sandP', 'hotdogP', 'burgerpP',
    'burrP', 'bebidasF', 'bebidasC', 'snacksP'
]

const tipoSchema = z.string({
    required_error: "Tipo es requerido",
    invalid_type_error: "Tipo debe ser un string",
}).refine((val) => tipoValues.includes(val), {
    message: "Tipo debe ser una categoría válida",
});


export const updateProductSchema = z.object({
    aderesos: z.array(z.string()).optional(),
    nombre: z
        .string({
            required_error: "Nombre es requerido",
        }),
    preparacion: z
        .string()
        .optional(),
    ingrePrep: z
        .string()
        .optional(),
    pan: z
        .string()
        .optional(),
    precio: z
        .number({
            required_error: "Precio es requerido",
            message: "Precio debe ser número positivo"
        }),
    // categoria: categorySchema,
    tipo: tipoSchema,
    vegetales: z.array(z.string()).optional(),
    status: z.boolean(),
    stock: z.number({
        required_error: "Age is required",
        message: "Precio debe ser número positivo"
    }),
    tipoRevolcado: z.boolean().optional().default(false),
    ingredientesExtra: z.array(ingredienteExtraSchema)
        .optional()
        .default([]),
    ingredientesRevolcado: z.array(ingredienteRevolcadoSchema)
        .optional()
        .default([]),
    tamanos: z.array(sizeSchema)
        .optional()
        .default([]),
})

export const idParamSchema = z.object({
  id: z.string().min(1, "El ID es requerido").regex(/^[a-f\d]{24}$/i, {
    message: "El ID debe tener formato MongoDB (24 caracteres hex)",
  }),
});