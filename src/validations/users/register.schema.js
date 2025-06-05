import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const registerSchema = z.object({
    firstName: z
        .string({
            required_error: "Username is required",
        }),
    lastName: z
        .string({
            required_error: "Lastname is required",
        }),
    age: z
        .number({
            required_error: "Age is required",
        }),
    email: z
        .string({
            required_error: "Email is required zod",
        })
        .email({
            message: "Invalid email zod",
        }),
    password: z
        .string({
            required_error: "Username is required zod"
        })
        .min(6, {
            message: "Password must be at least 6 characters zod",
        }),
    role: z.enum(['admin', 'user']),
    branch: z.string().regex(
        objectIdRegex, {
        message: "Branch should be ObjectId",
    })

})