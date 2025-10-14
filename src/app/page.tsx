'use client'

import { useState, useEffect } from 'react'
import { LandingPage } from '@/components/LandingPage'
import { PetSelection } from '@/components/PetSelection'
import { MainApp } from '@/components/MainApp'

type AppState = 'landing' | 'pet-selection' | 'main'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing')
  const [selectedPet, setSelectedPet] = useState<{
    id: string
    name: string
    species: string
    emoji: string
    color: string
    gradient: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user has already selected a pet
  useEffect(() => {
    const savedPet = localStorage.getItem('studybuddy_selected_pet')
    if (savedPet) {
      setSelectedPet(JSON.parse(savedPet))
      setAppState('main')
    }
    setIsLoading(false)
  }, [])

  const handleStart = () => {
    setAppState('pet-selection')
  }

  const handleBackToLanding = () => {
    setAppState('landing')
  }

  const handlePetSelect = (pet: {
    id: string
    name: string
    species: string
    emoji: string
    color: string
    gradient: string
  }) => {
    setSelectedPet(pet)
    localStorage.setItem('studybuddy_selected_pet', JSON.stringify(pet))
    setAppState('main')
  }

  // const handleReset = () => {
  //   localStorage.removeItem('studybuddy_selected_pet')
  //   setSelectedPet(null)
  //   setAppState('landing')
  // }

  // Show loading state while checking for saved pet
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading StudyBuddy...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {appState === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}
      
      {appState === 'pet-selection' && (
        <PetSelection 
          onBack={handleBackToLanding}
          onSelect={handlePetSelect}
        />
      )}
      
      {appState === 'main' && selectedPet && (
        <MainApp 
          selectedPet={selectedPet} 
          onStartOnboarding={() => setAppState('landing')}
        />
      )}
    </>
  )
}
