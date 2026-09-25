import { SocialAuthForm } from '@/features/social-auth'

type SignUpFormProps = {
  redirect?: string
}

export function SignUpForm({ redirect }: SignUpFormProps) {
  return <SocialAuthForm mode="sign-up" redirect={redirect} />
}
