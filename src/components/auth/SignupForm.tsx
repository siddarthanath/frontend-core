"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/auth/client"
import { GoogleButton, MicrosoftButton } from "@/components/auth/OAuthButton"
import { PasswordChecklist } from "@/components/auth/PasswordChecklist"
import { FieldError } from "@/components/shared/FeedbackStates/FieldError"
import { validatePassword } from "@/lib/auth/password"

const schema = z.object({
  first_name: z.string().min(1, "Enter your first name"),
  last_name: z.string().min(1, "Enter your last name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().superRefine((val, ctx) => {
    const error = validatePassword(val)
    if (error) ctx.addIssue({ code: z.ZodIssueCode.custom, message: error })
  }),
})

type FormData = z.infer<typeof schema>

interface SignupFormProps {
  redirectTo: string
}

export function SignupForm({ redirectTo }: SignupFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch("password", "")

  async function onSubmit(data: FormData) {
    // Account linking: if this email already exists via Google/Microsoft OAuth, Supabase will
    // create a duplicate account unless "Allow users to link multiple OAuth accounts" is enabled
    // in Supabase dashboard → Authentication → Settings. Enable it — users forget how they signed up.
    const supabase = createClient()
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        data: { first_name: data.first_name, last_name: data.last_name },
      },
    })
    if (error) {
      toast.error(error.message)
      return
    }
    // Session present = email confirmation is disabled; redirect immediately.
    // No session = confirmation email sent; prompt user to check inbox.
    if (authData.session) {
      router.push(redirectTo)
    } else {
      toast.success("Check your email to confirm your account.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="first_name">First name</Label>
          <Input id="first_name" type="text" autoComplete="given-name" {...register("first_name")} />
          <FieldError message={errors.first_name?.message ?? null} />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="last_name">Last name</Label>
          <Input id="last_name" type="text" autoComplete="family-name" {...register("last_name")} />
          <FieldError message={errors.last_name?.message ?? null} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        <FieldError message={errors.email?.message ?? null} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        <PasswordChecklist password={passwordValue} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
      <div className="relative flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-fg-3">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-col gap-2">
        <GoogleButton redirectTo={redirectTo} />
        <MicrosoftButton redirectTo={redirectTo} />
      </div>
    </form>
  )
}
