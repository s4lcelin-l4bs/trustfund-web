import { z } from 'zod'

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(9, 'Numero trop court')
    .max(15, 'Numero trop long')
    .regex(/^[0-9+]+$/, 'Numero invalide'),
  password: z
    .string()
    .min(6, 'Mot de passe minimum 6 caracteres'),
})

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nom trop court')
    .max(100, 'Nom trop long'),
  phoneNumber: z
    .string()
    .min(9, 'Numero trop court')
    .max(15, 'Numero trop long')
    .regex(/^[0-9+]+$/, 'Numero invalide'),
  password: z
    .string()
    .min(6, 'Mot de passe minimum 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
