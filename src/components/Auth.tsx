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

  // Get pet theme colors
  const getPetThemeColors = () => {
    if (!selectedPet) return { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' }
    
    switch (selectedPet.species) {
      case 'cat':
        return { bg: 'bg-orange-500', hover: 'hover:bg-orange-600' }
      case 'dog':
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
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          🎯 StudyBuddy Ready!
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          Your progress is saved locally. To sync across devices, set up Supabase authentication.
        </p>
        <div className="text-xs text-blue-600 dark:text-blue-400">
          <p>✅ All features work without sign-in</p>
          <p>✅ Progress saved in browser</p>
          <p>✅ Ready to study!</p>
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


  const handleEmailSignIn = async () => {
    const email = prompt('Enter your email for magic link sign-in:')
    if (email) {
      try {
        console.log('🔍 Attempting email sign-in with:', email)
        console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('🔍 Supabase Key (first 10):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10))
        
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}`,
          },
        })
        
        if (error) {
          console.error('❌ Supabase error:', error)
          alert(`Sign-in failed: ${error.message}`)
        } else {
          console.log('✅ Magic link sent successfully')
          alert('Check your email for the magic link!')
        }
      } catch (error) {
        console.error('❌ Email sign-in error:', error)
        alert(`Email sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
                onClick={handleEmailSignIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
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
