import Link from 'next/link'
import SignInForm from '@/app/components/auth/SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Se connecter
          </h2>
        </div>
        
        <SignInForm />
        
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              S'inscrire gratuitement
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}