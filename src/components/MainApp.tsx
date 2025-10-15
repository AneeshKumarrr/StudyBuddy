'use client'

import { FocusTimer } from './FocusTimer'
import { PetDisplay } from './PetDisplay'
import { SessionStats } from './SessionStats'
import { Auth } from './Auth'
import { useState, useEffect } from 'react'

interface MainAppProps {
  selectedPet: {
    id: string
    name: string
    species: string
    emoji: string
    color: string
    gradient: string
  }
  onStartOnboarding?: () => void
}

export function MainApp({ selectedPet, onStartOnboarding }: MainAppProps) {
  const [showAuth, setShowAuth] = useState(false)

  const handlePetSelection = () => {
    // Set a flag to go to pet selection without clearing the pet
    localStorage.setItem('studybuddy_go_to_pet_selection', 'true')
    window.location.reload()
  }

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      setShowAuth(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              StudyBuddy
            </h1>
          </div>
          {showAuth && (
            <div className="absolute top-0 right-0">
              <Auth onStartOnboarding={onStartOnboarding} selectedPet={selectedPet} />
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Pet Display */}
          <div>
            <PetDisplay selectedPet={selectedPet} onStartOnboarding={onStartOnboarding} onPetSelection={handlePetSelection} />
          </div>

          {/* Focus Timer - Main Component */}
          <div>
            <FocusTimer selectedPet={selectedPet} />
          </div>
        </div>

        {/* Session Stats */}
        <div className="mt-8 max-w-6xl mx-auto">
          <SessionStats selectedPet={selectedPet} />
        </div>
      </div>
    </div>
  )
}
