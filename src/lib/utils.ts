import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Study minutes and leveling calculations
export function calculateLevelFromStudyMinutes(studyMinutes: number): number {
  // Level 1: 0-9 minutes, Level 2: 10-24 minutes, Level 3: 25-44 minutes, etc.
  // Level requirement: 10 + (level-2)*5 for level >= 2
  let level = 1
  while (calculateStudyMinutesRequiredForLevel(level + 1) <= studyMinutes) {
    level++
  }
  return level
}

export function calculateStudyMinutesRequiredForLevel(level: number): number {
  if (level <= 1) return 0
  if (level === 2) return 10
  // Level 3 needs 25 (10+15), Level 4 needs 45 (25+20), Level 5 needs 70 (45+25), etc.
  return 10 + ((level - 2) * (level + 3)) / 2
}

export function calculateStudyProgress(level: number, studyMinutes: number): { current: number; required: number; progress: number } {
  const currentLevelMinutes = calculateStudyMinutesRequiredForLevel(level)
  const nextLevelMinutes = calculateStudyMinutesRequiredForLevel(level + 1)
  const current = studyMinutes - currentLevelMinutes
  const required = nextLevelMinutes - currentLevelMinutes
  const progress = required > 0 ? (current / required) * 100 : 100
  
  return { current, required, progress }
}

export function calculateSessionXP(effectiveMinutes: number, streakDays: number = 0): number {
  const baseXP = effectiveMinutes * 5 // 5 XP per effective minute
  const streakBonus = Math.min(streakDays * 0.1, 0.5) // +10% per day, capped at +50%
  return Math.round(baseXP * (1 + streakBonus))
}

export function calculateCoinsFromLevel(level: number): number {
  return 10 * level
}

// Session validation
export function validateSession(effectiveMinutes: number, plannedMinutes: number): boolean {
  // Cap XP per minute and require reasonable session length
  // const maxXPPerMinute = 10
  const minSessionMinutes = 5
  const maxSessionMinutes = 180 // 3 hours
  
  return (
    effectiveMinutes >= minSessionMinutes &&
    effectiveMinutes <= maxSessionMinutes &&
    effectiveMinutes <= plannedMinutes * 1.2 && // Allow 20% over planned
    (effectiveMinutes / plannedMinutes) >= 0.5 // At least 50% of planned time
  )
}

// Format time utilities
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}
