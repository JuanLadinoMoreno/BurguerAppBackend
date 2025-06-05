import { z } from "zod";

export const loginSchema = z.object({
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
        })
})