import { z } from 'zod'

export const waitlistEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type WaitlistEmailInput = z.infer<typeof waitlistEmailSchema>

