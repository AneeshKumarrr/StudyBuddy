'use client'

import { useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'

interface Pet {
  id: string
  name: string
  species: string
  emoji: string
  description: string
  personality: string
  color: string
  gradient: string
}

interface PetSelectionProps {
  onBack: () => void
  onSelect: (pet: Pet) => void
}

export function PetSelection({ onBack, onSelect }: PetSelectionProps) {
  const [selectedPet, setSelectedPet] = useState<string | null>(null)

  const getPetDesign = (petId: string): React.ReactElement => {
    const petDesigns: Record<string, React.ReactElement> = {
      wuffy: (
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Wuffy - Bouncy Energy Creature */}
          <div className="relative">
            {/* Main body - round and bouncy */}
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full relative shadow-lg border-2 border-black">
              {/* Energy sparks around body */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse"></div>
              <div className="absolute top-1 -left-2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
              
              {/* Head */}
              <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full absolute -top-1 left-2 border-2 border-black">
                {/* Big cute eyes */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>
                {/* Eye shine for cuteness */}
                <div className="absolute top-2.5 left-2.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                <div className="absolute top-2.5 right-2.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                {/* Cute rosy cheeks */}
                <div className="absolute top-3 left-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                <div className="absolute top-3 right-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                {/* Big happy smile - curved upward */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-5 h-2 border-2 border-black" style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 50% 50%'}}></div>
              </div>
              
              {/* Bouncy legs */}
              <div className="absolute bottom-0 left-2 w-3 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-black"></div>
              <div className="absolute bottom-0 right-2 w-3 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-black"></div>
              
              {/* Energy tail */}
              <div className="absolute -right-1 top-3 w-4 h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full transform rotate-12 border-2 border-black"></div>
            </div>
          </div>
        </div>
      ),
      stuffy: (
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Stuffy - Focused Determined Creature */}
          <div className="relative">
            {/* Main body - angular and focused */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg relative shadow-lg transform rotate-12 border-2 border-black">
              {/* Focus lines */}
              <div className="absolute top-1 left-1 w-0.5 h-12 bg-blue-200"></div>
              <div className="absolute top-1 right-1 w-0.5 h-12 bg-blue-200"></div>
              
              {/* Head */}
              <div className="w-12 h-8 bg-gradient-to-br from-blue-300 to-indigo-500 rounded-lg absolute -top-1 left-2 transform -rotate-12 border-2 border-black">
                {/* Cute focused eyes */}
                <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                {/* Eye shine for cuteness */}
                <div className="absolute top-1.5 left-1.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                <div className="absolute top-1.5 right-1.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                {/* Cute rosy cheeks */}
                <div className="absolute top-2 left-0.5 w-1 h-1 bg-pink-300 rounded-full"></div>
                <div className="absolute top-2 right-0.5 w-1 h-1 bg-pink-300 rounded-full"></div>
                {/* Happy determined smile - curved upward */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-2 border-2 border-black" style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 50% 50%'}}></div>
                {/* Cute focus symbol on forehead */}
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-100 rounded-full"></div>
              </div>
              
              {/* Strong legs */}
              <div className="absolute bottom-0 left-1.5 w-4 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg border-2 border-black"></div>
              <div className="absolute bottom-0 right-1.5 w-4 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg border-2 border-black"></div>
              
              {/* Power tail */}
              <div className="absolute -right-2 top-2 w-3 h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg transform rotate-45 border-2 border-black"></div>
            </div>
          </div>
        </div>
      ),
      muffy: (
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Muffy - Gentle Flowing Creature */}
          <div className="relative">
            {/* Main body - soft and flowing */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full relative shadow-lg border-2 border-black">
              {/* Gentle aura */}
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-30 animate-pulse"></div>
              
              {/* Head */}
              <div className="w-12 h-10 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full absolute -top-1 left-2 border-2 border-black">
                {/* Cute gentle eyes */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                {/* Eye shine for cuteness */}
                <div className="absolute top-2.5 left-2.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                <div className="absolute top-2.5 right-2.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                {/* Cute rosy cheeks */}
                <div className="absolute top-3 left-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                <div className="absolute top-3 right-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                {/* Sweet gentle smile - curved upward */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-2 border-2 border-black" style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 50% 50%'}}></div>
                {/* Cute wisdom mark */}
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-purple-400 rounded-full"></div>
              </div>
              
              {/* Flowing limbs */}
              <div className="absolute bottom-0 left-1.5 w-2 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform rotate-12 border-2 border-black"></div>
              <div className="absolute bottom-0 right-1.5 w-2 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform -rotate-12 border-2 border-black"></div>
              
              {/* Flowing tail */}
              <div className="absolute -right-1 top-3 w-4 h-4 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full transform rotate-12 border-2 border-black"></div>
              
              {/* Gentle sparkles */}
              <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-purple-200 rounded-full animate-pulse"></div>
              <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-pink-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )
    }
    
    return petDesigns[petId] || petDesigns.wuffy
  }

  const pets: Pet[] = [
    {
      id: 'wuffy',
      name: 'Wuffy',
      species: 'cat',
      emoji: '🐱',
      description: 'A fluffy, energetic companion who loves to play and explore. Perfect for keeping you motivated during long study sessions!',
      personality: 'Playful & Energetic',
      color: 'orange',
      gradient: 'from-orange-400 to-pink-400'
    },
    {
      id: 'stuffy',
      name: 'Stuffy',
      species: 'dog',
      emoji: '🐶',
      description: 'A loyal and focused friend who takes studying seriously. Stuffy will help you stay disciplined and on track.',
      personality: 'Loyal & Focused',
      color: 'blue',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'muffy',
      name: 'Muffy',
      species: 'rabbit',
      emoji: '🐰',
      description: 'A gentle and wise companion who brings calm to your study environment. Muffy helps you find your zen.',
      personality: 'Gentle & Wise',
      color: 'purple',
      gradient: 'from-purple-400 to-pink-400'
    }
  ]

  const handleSelect = (pet: Pet) => {
    setSelectedPet(pet.id)
    setTimeout(() => {
      onSelect(pet)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Choose Your Study Buddy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Pick the perfect companion for your study journey
            </p>
          </div>
        </div>

        {/* Pet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {pets.map((pet) => (
            <div
              key={pet.id}
              onClick={() => handleSelect(pet)}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedPet === pet.id ? 'ring-4 ring-purple-500 scale-105' : ''
              }`}
            >
              {/* Selection Indicator */}
              {selectedPet === pet.id && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Pet Avatar */}
              <div className="text-center mb-6">
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${pet.gradient} flex items-center justify-center shadow-lg mb-4`}>
                  {getPetDesign(pet.id)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {pet.name}
                </h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  pet.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                  pet.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }`}>
                  {pet.personality}
                </div>
              </div>

              {/* Description */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {pet.description}
                </p>
              </div>

              {/* Select Button */}
              <div className="mt-6">
                <button
                  onClick={() => handleSelect(pet)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    selectedPet === pet.id
                      ? 'bg-green-500 text-white'
                      : `bg-gradient-to-r ${pet.gradient} text-white hover:shadow-lg`
                  }`}
                >
                  {selectedPet === pet.id ? 'Selected!' : `Choose ${pet.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="text-center text-gray-600 dark:text-gray-300">
          <p>Don't worry, you can always change your buddy later!</p>
        </div>
      </div>
    </div>
  )
}
