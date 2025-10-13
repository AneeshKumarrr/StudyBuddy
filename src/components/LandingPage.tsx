'use client'

import { useState } from 'react'
import { ArrowRight, Heart, Star, Zap } from 'lucide-react'

interface LandingPageProps {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  const getPetDesign = (petId: string): React.ReactElement => {
    const petDesigns: Record<string, React.ReactElement> = {
      wuffy: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Wuffy - Bouncy Energy Creature */}
          <div className="relative">
            {/* Main body - round and bouncy */}
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full relative shadow-lg border-2 border-black">
              {/* Energy sparks around body */}
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-orange-300 rounded-full animate-pulse"></div>
              <div className="absolute top-1 -left-1.5 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
              
              {/* Head */}
              <div className="w-8 h-6 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full absolute -top-1 left-1.5 border-2 border-black">
                {/* Big cute eyes */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full"></div>
                {/* Eye shine for cuteness */}
                <div className="absolute top-1.5 left-1.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                <div className="absolute top-1.5 right-1.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                {/* Cute rosy cheeks */}
                <div className="absolute top-2 left-0.5 w-0.5 h-0.5 bg-pink-300 rounded-full"></div>
                <div className="absolute top-2 right-0.5 w-0.5 h-0.5 bg-pink-300 rounded-full"></div>
                {/* Big happy smile - curved upward */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-3 h-1.5 border-2 border-black" style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 50% 50%'}}></div>
              </div>
              
              {/* Bouncy legs */}
              <div className="absolute bottom-0 left-1.5 w-2 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-black"></div>
              <div className="absolute bottom-0 right-1.5 w-2 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-black"></div>
              
              {/* Energy tail */}
              <div className="absolute -right-1 top-2 w-3 h-2 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full transform rotate-12 border-2 border-black"></div>
            </div>
          </div>
        </div>
      ),
      stuffy: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Stuffy - Focused Determined Creature */}
          <div className="relative">
            {/* Main body - angular and focused */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg relative shadow-lg transform rotate-12 border-2 border-black">
              {/* Focus lines */}
              <div className="absolute top-1 left-1 w-0.5 h-8 bg-blue-200"></div>
              <div className="absolute top-1 right-1 w-0.5 h-8 bg-blue-200"></div>
              
              {/* Head */}
              <div className="w-8 h-6 bg-gradient-to-br from-blue-300 to-indigo-500 rounded-lg absolute -top-1 left-1.5 transform -rotate-12 border-2 border-black">
                {/* Cute focused eyes */}
                <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full"></div>
                {/* Eye shine for cuteness */}
                <div className="absolute top-1.5 left-1 w-0.5 h-0.5 bg-white rounded-full"></div>
                <div className="absolute top-1.5 right-1 w-0.5 h-0.5 bg-white rounded-full"></div>
                {/* Cute rosy cheeks */}
                <div className="absolute top-1.5 left-0.5 w-0.5 h-0.5 bg-pink-300 rounded-full"></div>
                <div className="absolute top-1.5 right-0.5 w-0.5 h-0.5 bg-pink-300 rounded-full"></div>
                {/* Happy determined smile - curved upward */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2.5 h-1 border-2 border-black" style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 50% 50%'}}></div>
                {/* Cute focus symbol on forehead */}
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-blue-100 rounded-full"></div>
              </div>
              
              {/* Strong legs */}
              <div className="absolute bottom-0 left-1 w-3 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg border-2 border-black"></div>
              <div className="absolute bottom-0 right-1 w-3 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg border-2 border-black"></div>
              
              {/* Power tail */}
              <div className="absolute -right-1 top-1.5 w-2 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg transform rotate-45 border-2 border-black"></div>
            </div>
          </div>
        </div>
      ),
      muffy: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Muffy - Gentle Flowing Creature */}
          <div className="relative">
            {/* Main body - soft and flowing */}
            <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full relative shadow-lg border-2 border-black">
              {/* Gentle aura */}
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-30 animate-pulse"></div>
              
              {/* Head */}
              <div className="w-8 h-6 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full absolute -top-1 left-1.5 border-2 border-black">
                {/* Cute gentle eyes */}
                <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full"></div>
                {/* Eye shine for cuteness */}
                <div className="absolute top-1.5 left-1 w-0.5 h-0.5 bg-white rounded-full"></div>
                <div className="absolute top-1.5 right-1 w-0.5 h-0.5 bg-white rounded-full"></div>
                {/* Cute rosy cheeks */}
                <div className="absolute top-2 left-0.5 w-0.5 h-0.5 bg-pink-300 rounded-full"></div>
                <div className="absolute top-2 right-0.5 w-0.5 h-0.5 bg-pink-300 rounded-full"></div>
                {/* Sweet gentle smile - curved upward */}
                <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-2.5 h-1 border-2 border-black" style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0 0 50% 50%'}}></div>
                {/* Cute wisdom mark */}
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-purple-400 rounded-full"></div>
              </div>
              
              {/* Flowing limbs */}
              <div className="absolute bottom-0 left-1 w-1.5 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform rotate-12 border-2 border-black"></div>
              <div className="absolute bottom-0 right-1 w-1.5 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform -rotate-12 border-2 border-black"></div>
              
              {/* Flowing tail */}
              <div className="absolute -right-1 top-2 w-3 h-3 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full transform rotate-12 border-2 border-black"></div>
              
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex justify-center items-center gap-8 mb-6">
            {getPetDesign('wuffy')}
            {getPetDesign('stuffy')}
            {getPetDesign('muffy')}
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to StudyBuddy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Turn your study sessions into an adventure! Level up your virtual pet while you focus, 
            earn XP, and build healthy study habits.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-purple-500">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Focus Timer
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Pomodoro and custom sessions with anti-cheat protection
            </p>
          </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-purple-500">
            <div className="text-4xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Virtual Pet
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose your study companion and watch them grow with you
            </p>
          </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-purple-500">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Progress Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track your focus time, streaks, and achievements
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xl font-semibold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Start Your Journey
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">25min</div>
            <div className="text-gray-600 dark:text-gray-300">Focus Sessions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">∞</div>
            <div className="text-gray-600 dark:text-gray-300">XP to Earn</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">100%</div>
            <div className="text-gray-600 dark:text-gray-300">Free to Use</div>
          </div>
        </div>
      </div>
    </div>
  )
}
