'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react'

interface SessionData {
  date: string
  effectiveMinutes: number
  totalMinutes: number
  sessions: number
}

interface SessionStatsProps {
  selectedPet?: {
    id: string
    name: string
    species: string
    emoji: string
    color: string
    gradient: string
  }
}

export function SessionStats({ selectedPet }: SessionStatsProps) {
  const [stats, setStats] = useState({
    todayMinutes: 0,
    weekMinutes: 0,
    streak: 0,
    totalSessions: 0
  })

  const [weeklyData, setWeeklyData] = useState<SessionData[]>([])

  // Load real user data from localStorage
  useEffect(() => {
    const loadUserStats = () => {
      // Get today's date for filtering
      const today = new Date().toISOString().split('T')[0]
      
      // Load session data from localStorage
      const sessionData = JSON.parse(localStorage.getItem('studybuddy_sessions') || '[]')
      
      // Generate weekly data from stored sessions
      const weeklyData: SessionData[] = []
      const todayDate = new Date()
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(todayDate)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        // Find sessions for this date
        const daySessions = sessionData.filter((session: any) => 
          session.date === dateStr
        )
        
        const effectiveMinutes = daySessions.reduce((sum: number, session: any) => 
          sum + (session.effectiveMinutes || 0), 0
        )
        
        const totalMinutes = daySessions.reduce((sum: number, session: any) => 
          sum + (session.totalMinutes || 0), 0
        )
        
        weeklyData.push({
          date: dateStr,
          effectiveMinutes,
          totalMinutes,
          sessions: daySessions.length
        })
      }

      setWeeklyData(weeklyData)
      
      // Calculate stats from real data
      const todayData = weeklyData[weeklyData.length - 1]
      const weekTotal = weeklyData.reduce((sum, day) => sum + day.effectiveMinutes, 0)
      
      // Calculate streak
      let streak = 0
      for (let i = weeklyData.length - 1; i >= 0; i--) {
        if (weeklyData[i].effectiveMinutes > 0) {
          streak++
        } else {
          break
        }
      }
      
      setStats({
        todayMinutes: todayData.effectiveMinutes,
        weekMinutes: weekTotal,
        streak,
        totalSessions: weeklyData.reduce((sum, day) => sum + day.sessions, 0)
      })
    }

    loadUserStats()
    
    // Listen for session updates
    const handleStorageChange = () => {
      loadUserStats()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check for updates every 30 seconds
    const interval = setInterval(loadUserStats, 30000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return 'text-red-500'
    if (streak >= 3) return 'text-orange-500'
    return 'text-green-500'
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

  return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 ${getContainerBorderColor()}`}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Your Progress
      </h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 ${getContainerBorderColor()}`}>
          <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatDuration(stats.todayMinutes)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Today</div>
        </div>

        <div className={`text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 ${getContainerBorderColor()}`}>
          <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatDuration(stats.weekMinutes)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">This Week</div>
        </div>

        <div className={`text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 ${getContainerBorderColor()}`}>
          <Target className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <div className={`text-2xl font-bold ${getStreakColor(stats.streak)}`}>
            {stats.streak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Day Streak</div>
        </div>

        <div className={`text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 ${getContainerBorderColor()}`}>
          <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalSessions}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Sessions</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Focus Time
        </h4>
        
        <div className="space-y-3">
          {weeklyData.map((day, index) => {
            const date = new Date(day.date)
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
            const isToday = index === weeklyData.length - 1
            
            return (
              <div key={day.date} className="flex items-center gap-4">
                <div className="w-12 text-sm text-gray-600 dark:text-gray-300">
                  {dayName}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-900 dark:text-white">
                      {isToday ? 'Today' : day.date}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {formatDuration(day.effectiveMinutes)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, (day.effectiveMinutes / 120) * 100)}%` 
                      }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {day.sessions} session{day.sessions !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Goals */}
      <div className={`mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 ${getContainerBorderColor()}`}>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Daily Goals
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Focus Time</span>
            <span className="text-gray-900 dark:text-white">
              {stats.todayMinutes}/120 minutes
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (stats.todayMinutes / 120) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
