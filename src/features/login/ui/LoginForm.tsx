import { SocialAuthForm } from '@/features/social-auth'

type LoginFormProps = {
  redirect?: string
}

export function LoginForm({ redirect }: LoginFormProps) {
  return <SocialAuthForm mode="login" redirect={redirect} />
}
