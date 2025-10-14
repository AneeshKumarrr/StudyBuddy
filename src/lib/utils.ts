import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// XP and leveling calculations
export function calculateLevelFromXP(xp: number): number {
  // Level requirement: req(level) = round(50 * level^1.6)
  let level = 1
  while (calculateXPRequiredForLevel(level + 1) <= xp) {
    level++
  }
  return level
}

export function calculateXPRequiredForLevel(level: number): number {
  return Math.round(50 * Math.pow(level, 1.6))
}

export function calculateXPProgress(level: number, xp: number): { current: number; required: number; progress: number } {
  const currentLevelXP = calculateXPRequiredForLevel(level)
  const nextLevelXP = calculateXPRequiredForLevel(level + 1)
  const current = xp - currentLevelXP
  const required = nextLevelXP - currentLevelXP
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
