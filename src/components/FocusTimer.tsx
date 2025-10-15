'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { formatTime } from '@/lib/utils'

type SessionType = 'pomodoro' | 'custom'
type TimerState = 'idle' | 'running' | 'paused' | 'completed'

interface FocusTimerProps {
  selectedPet?: {
    id: string
    name: string
    species: string
    emoji: string
    color: string
    gradient: string
  }
}

export function FocusTimer({ selectedPet }: FocusTimerProps) {
  const [sessionType, setSessionType] = useState<SessionType>('pomodoro')
  const [customMinutes, setCustomMinutes] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [state, setState] = useState<TimerState>('idle')
  const [isFocused, setIsFocused] = useState(true)
  const [studyMinutesElapsed, setStudyMinutesElapsed] = useState(0)

  // Get pet theme colors for buttons
  const getPetThemeColors = () => {
    console.log('FocusTimer - selectedPet:', selectedPet)
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

  // Calculate session duration based on type
  const sessionDuration = sessionType === 'pomodoro' ? 25 : customMinutes
  const sessionSeconds = sessionDuration * 60

  // Update timer and study minutes in real-time
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (state === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setState('completed')
            // Save session data when completed
            saveSessionData()
            return 0
          }
          return prev - 1
        })
        
        // Update study minutes and coins in real-time (1/60th of a minute per second)
        setStudyMinutesElapsed(prev => {
          const newMinutes = prev + (1/60)
          // Update localStorage in real-time
          const currentStudyMinutes = parseFloat(localStorage.getItem('studybuddy_study_minutes') || '0')
          localStorage.setItem('studybuddy_study_minutes', (currentStudyMinutes + (1/60)).toString())
          
          // Award 1 coin for every full minute of study
          const newTotalMinutes = currentStudyMinutes + (1/60)
          const fullMinutes = Math.floor(newTotalMinutes)
          const previousFullMinutes = Math.floor(currentStudyMinutes)
          
          if (fullMinutes > previousFullMinutes) {
            // We've completed another full minute, award 1 coin
            const currentCoins = parseInt(localStorage.getItem('studybuddy_coins') || '0')
            localStorage.setItem('studybuddy_coins', (currentCoins + 1).toString())
          }
          
          // Trigger custom event for real-time updates
          window.dispatchEvent(new Event('studybuddy-update'))
          return newMinutes
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state, timeLeft])

  // Simple focus tracking (no anti-cheat for now)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsFocused(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const startTimer = useCallback(() => {
    setState('running')
  }, [])

  const pauseTimer = useCallback(() => {
    setState('paused')
  }, [])

  const resetTimer = useCallback(() => {
    setState('idle')
    setTimeLeft(sessionSeconds)
    setIsFocused(true)
    setStudyMinutesElapsed(0)
  }, [sessionSeconds])

  const stopTimer = useCallback(() => {
    setState('idle')
    setTimeLeft(sessionSeconds)
    setIsFocused(true)
    setStudyMinutesElapsed(0)
  }, [sessionSeconds])

  // Save session data to localStorage and award coins
  const saveSessionData = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const sessionData = {
      date: today,
      sessionType,
      totalMinutes: sessionDuration,
      effectiveMinutes: sessionDuration,
      unfocusedMinutes: 0,
      completedAt: new Date().toISOString()
    }

    // Get existing sessions
    const existingSessions = JSON.parse(localStorage.getItem('studybuddy_sessions') || '[]')
    
    // Add new session
    existingSessions.push(sessionData)
    
    // Save back to localStorage
    localStorage.setItem('studybuddy_sessions', JSON.stringify(existingSessions))
    
    // Note: Coins and study minutes are already being tracked in real-time, so no need to add them here
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'))
  }, [sessionType, sessionDuration])

  // Calculate progress
  const progress = ((sessionSeconds - timeLeft) / sessionSeconds) * 100

  const getContainerBorderColor = () => {
    if (!selectedPet) return 'border-blue-500'
    
    switch (selectedPet.id) {
      case 'wuffy': return 'border-orange-500'
      case 'stuffy': return 'border-blue-500'
      case 'muffy': return 'border-purple-500'
      default: return 'border-blue-500'
    }
  }

  const getTimerColor = () => {
    if (!selectedPet) return '#3b82f6' // blue-500
    
    switch (selectedPet.id) {
      case 'wuffy': return '#f97316' // orange-500
      case 'stuffy': return '#3b82f6' // blue-500
      case 'muffy': return '#8b5cf6' // purple-500
      default: return '#3b82f6' // blue-500
    }
  }

  const getSessionButtonColors = () => {
    if (!selectedPet) return {
      background: 'bg-gray-100 dark:bg-gray-700',
      selected: 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white border-2 border-gray-500',
      unselected: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-2 border-transparent hover:border-gray-400'
    }
    
    switch (selectedPet.id) {
      case 'wuffy': return {
        background: 'bg-orange-100 dark:bg-orange-900/20',
        selected: 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-300 border-2 border-orange-500',
        unselected: 'text-orange-600 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 border-2 border-transparent hover:border-orange-400'
      }
      case 'stuffy': return {
        background: 'bg-blue-100 dark:bg-blue-900/20',
        selected: 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 border-2 border-blue-500',
        unselected: 'text-blue-600 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 border-2 border-transparent hover:border-blue-400'
      }
      case 'muffy': return {
        background: 'bg-purple-100 dark:bg-purple-900/20',
        selected: 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-300 border-2 border-purple-500',
        unselected: 'text-purple-600 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 border-2 border-transparent hover:border-purple-400'
      }
      default: return {
        background: 'bg-gray-100 dark:bg-gray-700',
        selected: 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white border-2 border-gray-500',
        unselected: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-2 border-transparent hover:border-gray-400'
      }
    }
  }

  return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 ${getContainerBorderColor()}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Focus Session
        </h2>

        {/* Session Type Selection */}
        <div className="flex justify-center mb-6">
          <div className={`${getSessionButtonColors().background} rounded-lg p-1`}>
            <button
              onClick={() => {
                setSessionType('pomodoro')
                setTimeLeft(25 * 60)
                setState('idle')
                setStudyMinutesElapsed(0)
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sessionType === 'pomodoro'
                  ? getSessionButtonColors().selected
                  : getSessionButtonColors().unselected
              }`}
            >
              Pomodoro (25m)
            </button>
            <button
              onClick={() => {
                setSessionType('custom')
                setTimeLeft(customMinutes * 60)
                setState('idle')
                setStudyMinutesElapsed(0)
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sessionType === 'custom'
                  ? getSessionButtonColors().selected
                  : getSessionButtonColors().unselected
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Custom Duration Input */}
        {sessionType === 'custom' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="180"
              value={customMinutes}
              onChange={(e) => {
                const minutes = Math.max(5, Math.min(180, parseInt(e.target.value) || 5))
                setCustomMinutes(minutes)
                if (state === 'idle') {
                  setTimeLeft(minutes * 60)
                }
              }}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
            />
          </div>
        )}

        {/* Timer Display */}
        <div className="mb-8">
          <div className="relative w-64 h-64 mx-auto mb-4">
            {/* Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Black background for the entire timer area */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="black"
              />
              {/* Black center circle for the timer text */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="black"
              />
              {/* Dynamic progress ring that fills the area between outer and inner rings */}
              <circle
                cx="50"
                cy="50"
                r="42.5"
                fill="none"
                stroke={getTimerColor()}
                strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 42.5}`}
                strokeDashoffset={`${2 * Math.PI * 42.5 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
              {/* Outer dynamic border */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={getTimerColor()}
                strokeWidth="2"
                fill="none"
              />
              {/* Inner dynamic border */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={getTimerColor()}
                strokeWidth="2"
                fill="none"
              />
            </svg>
            
            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Focus Status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${isFocused ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isFocused ? 'Focused' : 'Unfocused'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {state === 'idle' && (
            <button
              onClick={startTimer}
              className={`flex items-center gap-2 px-6 py-3 ${getPetThemeColors().bg} ${getPetThemeColors().hover} text-white rounded-lg font-medium transition-colors`}
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          )}

          {state === 'running' && (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}

          {state === 'paused' && (
            <button
              onClick={startTimer}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              Resume
            </button>
          )}

          {(state === 'running' || state === 'paused') && (
            <button
              onClick={stopTimer}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              <Square className="w-5 h-5" />
              Stop
            </button>
          )}

          {state === 'completed' && (
            <button
              onClick={resetTimer}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              New Session
            </button>
          )}
        </div>

        {/* Session Stats */}
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          <div>Session time: {formatTime(sessionSeconds - timeLeft)}</div>
        </div>
      </div>
    </div>
  )
}
