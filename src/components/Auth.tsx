'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'

interface AuthProps {
  onStartOnboarding?: () => void
  selectedPet?: { id: string; species: string; name: string }
}

export function Auth({ onStartOnboarding, selectedPet }: AuthProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Get pet theme colors
  const getPetThemeColors = () => {
    console.log('Auth - selectedPet:', selectedPet)
    if (!selectedPet) return { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' }
    
    switch (selectedPet.species) {
      case 'dog':
        return { bg: 'bg-orange-500', hover: 'hover:bg-orange-600' }
      case 'cat':
        return { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' }
      case 'rabbit':
        return { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' }
      default:
        return { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' }
    }
  }

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear all localStorage data
      localStorage.removeItem('studybuddy_selected_pet')
      localStorage.removeItem('studybuddy_sessions')
      localStorage.removeItem('studybuddy_study_minutes')
      localStorage.removeItem('studybuddy_coins')
      localStorage.removeItem('lastPetActivity')
      
      // Redirect to landing page by reloading
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Show configuration notice if Supabase isn't set up
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          🔧 Setup Required
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
          To enable authentication and data persistence, please set up your Supabase credentials.
        </p>
        <div className="text-xs text-yellow-600 dark:text-yellow-400">
          <p>1. Create a .env.local file</p>
          <p>2. Add your Supabase URL and keys</p>
          <p>3. Restart the development server</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <UserIcon className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    )
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
      
      // Close modal on successful redirect
      setShowSignInModal(false)
    } catch (error) {
      console.error('Error signing in with Google:', error)
      alert('Google sign-in failed. Please make sure Google OAuth is configured in your Supabase project.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleEmailSignIn = async () => {
    const email = prompt('Enter your email for magic link sign-in:')
    if (email) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}`,
          },
        })
        if (error) {
          alert(error.message)
        } else {
          alert('Check your email for the magic link!')
        }
      } catch (error) {
        console.error('Error with email sign-in:', error)
        alert('Email sign-in failed. Please try again.')
      }
    }
  }

  return (
    <>
      <button
        onClick={() => setShowSignInModal(true)}
        className={`flex items-center gap-2 px-4 py-2 ${getPetThemeColors().bg} ${getPetThemeColors().hover} text-white rounded-lg font-medium transition-colors`}
      >
        <LogIn className="w-4 h-4" />
        Sign in to save your progress
      </button>

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sign In
              </h2>
              <button
                onClick={() => setShowSignInModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl font-medium transition-colors"
              >
                {googleLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Continue with Google
                  </>
                )}
              </button>

              <button
                onClick={handleEmailSignIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                Continue with Email
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign in to save your progress and sync across devices
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
