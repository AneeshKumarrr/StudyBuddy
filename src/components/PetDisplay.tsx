'use client'

import { useState, useEffect } from 'react'
import { Heart, Star, Coins, Zap, ShoppingBag, RefreshCw } from 'lucide-react'
import { calculateLevelFromStudyMinutes, calculateStudyProgress } from '@/lib/utils'
import { Shop } from './Shop'

interface Pet {
  id: string
  species: string
  level: number
  studyMinutes: number
  coins: number
  cosmetics: unknown[]
}

interface PetDisplayProps {
  selectedPet?: {
    id: string
    name: string
    species: string
    emoji: string
    color: string
    gradient: string
  }
  onStartOnboarding?: () => void
}

export function PetDisplay({ selectedPet, onStartOnboarding }: PetDisplayProps) {
  // Mock pet data - in real app, this would come from Supabase
  const [pet, setPet] = useState<Pet>({
    id: selectedPet?.id || '1',
    species: selectedPet?.species || 'cat',
    level: 1,
    studyMinutes: 0,
    coins: 0,
    cosmetics: []
  })

  const [mood, setMood] = useState<'happy' | 'excited' | 'focused' | 'sleepy'>('happy')
  const [animation, setAnimation] = useState<'idle' | 'eat' | 'sleep' | 'levelup'>('idle')
  const [showShop, setShowShop] = useState(false)

  // Load pet data from localStorage
  useEffect(() => {
    const savedStudyMinutes = parseInt(localStorage.getItem('studybuddy_study_minutes') || '0')
    const savedCoins = parseInt(localStorage.getItem('studybuddy_coins') || '0')
    const currentLevel = calculateLevelFromStudyMinutes(savedStudyMinutes)
    
    setPet(prev => ({
      ...prev,
      studyMinutes: savedStudyMinutes,
      coins: savedCoins,
      level: currentLevel
    }))
  }, [])

  // Listen for storage changes (when new sessions are completed)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedStudyMinutes = parseInt(localStorage.getItem('studybuddy_study_minutes') || '0')
      const savedCoins = parseInt(localStorage.getItem('studybuddy_coins') || '0')
      const currentLevel = calculateLevelFromStudyMinutes(savedStudyMinutes)
      
      setPet(prev => {
        const newPet = {
          ...prev,
          studyMinutes: savedStudyMinutes,
          coins: savedCoins,
          level: currentLevel
        }
        
        // Trigger level up animation if level increased
        if (currentLevel > prev.level) {
          setAnimation('levelup')
          setTimeout(() => setAnimation('idle'), 2000)
        }
        
        return newPet
      })
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Calculate level and progress
  const currentLevel = calculateLevelFromStudyMinutes(pet.studyMinutes)
  const progress = calculateStudyProgress(currentLevel, pet.studyMinutes)

  // Pet mood based on recent activity and progress
  useEffect(() => {
    const now = Date.now()
    const lastActivity = localStorage.getItem('lastPetActivity')
    
    if (!lastActivity) {
      setMood('happy') // Default to happy for new pets
    } else {
      const timeSinceActivity = now - parseInt(lastActivity)
      if (timeSinceActivity < 5 * 60 * 1000) { // 5 minutes
        setMood('excited') // Recently active
      } else if (timeSinceActivity < 30 * 60 * 1000) { // 30 minutes
        setMood('focused') // Ready to study
      } else if (timeSinceActivity < 24 * 60 * 60 * 1000) { // 24 hours
        setMood('happy') // Normal state
      } else {
        setMood('sleepy') // Needs attention
      }
    }
  }, [pet.studyMinutes, pet.level])

  const feedPet = () => {
    if (pet.coins >= 10) {
      const newCoins = pet.coins - 10
      setPet(prev => ({ ...prev, coins: newCoins }))
      localStorage.setItem('studybuddy_coins', newCoins.toString())
      setAnimation('eat')
      setTimeout(() => setAnimation('idle'), 1500)
      localStorage.setItem('lastPetActivity', Date.now().toString())
    }
  }

  const handlePurchase = (item: { 
    id: string
    sku: string
    type: 'food' | 'cosmetic'
    name: string
    description: string
    cost: number
    meta: Record<string, unknown>
  }) => {
    if (pet.coins >= item.cost) {
      const newCoins = pet.coins - item.cost
      setPet(prev => ({ ...prev, coins: newCoins }))
      localStorage.setItem('studybuddy_coins', newCoins.toString())
      
      if (item.type === 'food') {
        setAnimation('eat')
        setTimeout(() => setAnimation('idle'), 1500)
      }
    }
  }

  const getPetDesign = (): React.ReactElement | null => {
    if (!selectedPet) return null
    
    const petDesigns: Record<string, React.ReactElement> = {
      wuffy: (
        <div className="relative w-28 h-24 flex items-center justify-center">
          {/* Wuffy - Bouncy Energy Creature */}
          <div className="relative">
            {/* Main body - round and bouncy */}
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full relative shadow-lg border-2 border-black">
              {/* Energy sparks around body */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-200 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
              <div className="absolute top-2 -left-3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              
              {/* Head */}
              <div className="w-16 h-14 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full absolute -top-2 left-2 border-2 border-black">
                {/* Big cute eyes */}
                <div className="absolute top-3 left-3 w-3 h-3 bg-black rounded-full"></div>
                <div className="absolute top-3 right-3 w-3 h-3 bg-black rounded-full"></div>
                {/* Eye shine for cuteness */}
                <div className="absolute top-3.5 left-3.5 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-3.5 right-3.5 w-1 h-1 bg-white rounded-full"></div>
                {/* Cute rosy cheeks */}
                <div className="absolute top-4 left-1 w-2 h-2 bg-pink-300 rounded-full"></div>
                <div className="absolute top-4 right-1 w-2 h-2 bg-pink-300 rounded-full"></div>
                {/* Big happy smile - curved upward */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-3 border-2 border-black" style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 50% 50%'}}></div>
              </div>
              
              {/* Bouncy legs */}
              <div className="absolute bottom-0 left-3 w-4 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-black"></div>
              <div className="absolute bottom-0 right-3 w-4 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-black"></div>
              
              {/* Energy tail */}
              <div className="absolute -right-2 top-4 w-6 h-4 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full transform rotate-12 border-2 border-black"></div>
            </div>
          </div>
        </div>
      ),
      stuffy: (
        <div className="relative w-28 h-24 flex items-center justify-center">
          {/* Stuffy - Focused Determined Creature */}
          <div className="relative">
            {/* Main body - angular and focused */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg relative shadow-lg transform rotate-12 border-2 border-black">
              {/* Focus lines */}
              <div className="absolute top-1 left-1 w-1 h-16 bg-blue-200"></div>
              <div className="absolute top-1 right-1 w-1 h-16 bg-blue-200"></div>
              
              {/* Head */}
              <div className="w-16 h-12 bg-gradient-to-br from-blue-300 to-indigo-500 rounded-lg absolute -top-2 left-2 transform -rotate-12 border-2 border-black">
                {/* Cute focused eyes */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>
                {/* Eye shine for cuteness */}
                <div className="absolute top-2.5 left-2.5 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-2.5 right-2.5 w-1 h-1 bg-white rounded-full"></div>
                {/* Cute rosy cheeks */}
                <div className="absolute top-3 left-1 w-2 h-2 bg-pink-300 rounded-full"></div>
                <div className="absolute top-3 right-1 w-2 h-2 bg-pink-300 rounded-full"></div>
                {/* Happy determined smile - curved upward */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-5 h-2 border-2 border-black" style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 50% 50%'}}></div>
                {/* Cute focus symbol on forehead */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-100 rounded-full"></div>
              </div>
              
              {/* Strong legs */}
              <div className="absolute bottom-0 left-2 w-5 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg border-2 border-black"></div>
              <div className="absolute bottom-0 right-2 w-5 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg border-2 border-black"></div>
              
              {/* Power tail */}
              <div className="absolute -right-3 top-3 w-4 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg transform rotate-45 border-2 border-black"></div>
            </div>
          </div>
        </div>
      ),
      muffy: (
        <div className="relative w-28 h-24 flex items-center justify-center">
          {/* Muffy - Gentle Flowing Creature */}
          <div className="relative">
            {/* Main body - soft and flowing */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full relative shadow-lg border-2 border-black">
              {/* Gentle aura */}
              <div className="absolute -inset-2 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-30 animate-pulse"></div>
              
              {/* Head */}
              <div className="w-16 h-14 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full absolute -top-2 left-2 border-2 border-black">
                {/* Cute gentle eyes */}
                <div className="absolute top-3 left-3 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full"></div>
                {/* Eye shine for cuteness */}
                <div className="absolute top-3.5 left-3.5 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-3.5 right-3.5 w-1 h-1 bg-white rounded-full"></div>
                {/* Cute rosy cheeks */}
                <div className="absolute top-4 left-1 w-2 h-2 bg-pink-300 rounded-full"></div>
                <div className="absolute top-4 right-1 w-2 h-2 bg-pink-300 rounded-full"></div>
                {/* Sweet gentle smile - curved upward */}
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-5 h-2 border-2 border-black" style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 50% 50%'}}></div>
                {/* Cute wisdom mark */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>
              </div>
              
              {/* Flowing limbs */}
              <div className="absolute bottom-0 left-2 w-3 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform rotate-12 border-2 border-black"></div>
              <div className="absolute bottom-0 right-2 w-3 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform -rotate-12 border-2 border-black"></div>
              
              {/* Flowing tail */}
              <div className="absolute -right-2 top-4 w-5 h-6 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full transform rotate-12 border-2 border-black"></div>
              
              {/* Gentle sparkles */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-purple-200 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-pink-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )
    }
    
    return petDesigns[selectedPet.id] || petDesigns.wuffy
  }

  const getMoodColor = () => {
    switch (mood) {
      case 'happy': return 'text-green-500'
      case 'excited': return 'text-yellow-500'
      case 'focused': return 'text-blue-500'
      case 'sleepy': return 'text-purple-500'
      default: return 'text-gray-500'
    }
  }

  const getPetBackground = () => {
    if (!selectedPet) return null
    
    const backgrounds: Record<string, React.ReactElement> = {
      wuffy: (
        <>
          {/* Wuffy's Energetic Playground */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-orange-100 to-yellow-300 dark:from-yellow-800 dark:via-orange-900 dark:to-yellow-700"></div>
          
          {/* Subtle energy sparks */}
          <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-6 w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute top-12 left-8 w-0.5 h-0.5 bg-yellow-500 rounded-full animate-pulse"></div>
        </>
      ),
      stuffy: (
        <>
          {/* Stuffy's Focused Study Room */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-indigo-100 to-blue-300 dark:from-blue-800 dark:via-indigo-900 dark:to-blue-700"></div>
          
          {/* Subtle focus lines */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-400"></div>
          <div className="absolute top-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-blue-500"></div>
          
          {/* Subtle concentration aura */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20 dark:from-blue-200/10 dark:via-transparent dark:to-indigo-200/10"></div>
        </>
      ),
      muffy: (
        <>
          {/* Muffy's Gentle Zen Garden */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300 dark:from-purple-800 dark:via-pink-900 dark:to-purple-700"></div>
          
          {/* Subtle flowing elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent dark:via-purple-400 opacity-30"></div>
          <div className="absolute top-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-200 to-transparent dark:via-pink-400 opacity-20"></div>
          
          {/* Gentle sparkles */}
          <div className="absolute top-3 left-6 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse"></div>
          <div className="absolute top-5 right-6 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse"></div>
          
          {/* Subtle flowing aura */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-pink-100/20 dark:from-purple-200/10 dark:via-transparent dark:to-pink-200/10"></div>
        </>
      )
    }
    
    return backgrounds[selectedPet.id] || backgrounds.wuffy
  }

  const getContainerBorderColor = () => {
    if (!selectedPet) return 'border-blue-500'
    
    switch (selectedPet.id) {
      case 'wuffy': return 'border-orange-500'
      case 'stuffy': return 'border-blue-500'
      case 'muffy': return 'border-purple-500'
      default: return 'border-blue-500'
    }
  }

  const getPetDisplayBorderColor = () => {
    if (!selectedPet) return 'border-black'
    
    switch (selectedPet.id) {
      case 'wuffy': return 'border-orange-500'
      case 'stuffy': return 'border-blue-500'
      case 'muffy': return 'border-purple-500'
      default: return 'border-black'
    }
  }

  const getProgressBarGradient = () => {
    if (!selectedPet) return 'bg-gradient-to-r from-blue-500 to-purple-500'
    
    switch (selectedPet.id) {
      case 'wuffy': return 'bg-gradient-to-r from-orange-400 to-red-500'
      case 'stuffy': return 'bg-gradient-to-r from-blue-400 to-indigo-500'
      case 'muffy': return 'bg-gradient-to-r from-purple-400 to-pink-500'
      default: return 'bg-gradient-to-r from-blue-500 to-purple-500'
    }
  }

  const getButtonColors = () => {
    if (!selectedPet) return {
      primary: 'bg-blue-600 hover:bg-blue-700',
      secondary: 'bg-blue-500 hover:bg-blue-600',
      disabled: 'bg-blue-400'
    }
    
    switch (selectedPet.id) {
      case 'wuffy': return {
        primary: 'bg-orange-600 hover:bg-orange-700',
        secondary: 'bg-orange-500 hover:bg-orange-600',
        disabled: 'bg-orange-400'
      }
      case 'stuffy': return {
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-blue-500 hover:bg-blue-600',
        disabled: 'bg-blue-400'
      }
      case 'muffy': return {
        primary: 'bg-purple-600 hover:bg-purple-700',
        secondary: 'bg-purple-500 hover:bg-purple-600',
        disabled: 'bg-purple-400'
      }
      default: return {
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-blue-500 hover:bg-blue-600',
        disabled: 'bg-blue-400'
      }
    }
  }

  return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 ${getContainerBorderColor()}`}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        {selectedPet?.name || 'Pet'}: Lvl {pet.level}
      </h3>

      {/* Pet Display */}
      <div className="text-center mb-6">
        <div className={`relative w-full h-48 mx-auto mb-4 rounded-lg flex items-center justify-center border-2 ${getPetDisplayBorderColor()} shadow-lg overflow-hidden`}>
          {/* Custom pet-specific background */}
          {getPetBackground()}
          
          {/* Pet in the center */}
          <div className="relative z-10 animate-bounce">
            {getPetDesign()}
          </div>
          

        </div>

        {/* Mood Text */}
        <div className={`text-sm font-medium ${getMoodColor()} mt-1`}>
          Mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </div>
      </div>

      {/* Study Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
          <span>Level {currentLevel}</span>
          <span>{progress.current}/{progress.required} minutes of study</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`${getProgressBarGradient()} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
            <Coins className="w-4 h-4" />
            <span className="font-semibold">{pet.coins}</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Study Coins</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">{pet.studyMinutes}</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Study Minutes</div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={feedPet}
          disabled={pet.coins < 10}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${getButtonColors().primary} disabled:${getButtonColors().disabled} disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors`}
        >
          <Heart className="w-4 h-4" />
          Feed Pet (10 study coins)
        </button>

        <button
          onClick={() => setAnimation('sleep')}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${getButtonColors().secondary} text-white rounded-lg font-medium transition-colors`}
        >
          <Star className="w-4 h-4" />
          Rest
        </button>

        <button
          onClick={() => setShowShop(!showShop)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${getButtonColors().primary} text-white rounded-lg font-medium transition-colors`}
        >
          <ShoppingBag className="w-4 h-4" />
          Shop
        </button>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to change your pet? This will reset your progress.')) {
              localStorage.removeItem('studybuddy_selected_pet')
              if (onStartOnboarding) {
                onStartOnboarding()
              } else {
                window.location.reload()
              }
            }
          }}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${getButtonColors().secondary} text-white rounded-lg font-medium transition-colors`}
        >
          <RefreshCw className="w-4 h-4" />
          Change Pet
        </button>
      </div>

      {/* Pet Animation Status */}
      {animation !== 'idle' && (
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          {animation === 'eat' && '🍽️ Eating...'}
          {animation === 'sleep' && '😴 Sleeping...'}
          {animation === 'levelup' && '🎉 Level Up!'}
        </div>
      )}

      {/* Shop Modal */}
      {showShop && (
        <div className="mt-6">
          <Shop 
            userCoins={pet.coins} 
            onPurchase={handlePurchase}
          />
        </div>
      )}
    </div>
  )
}
