import { padLeft } from './utils/string-utils.js'
import { required } from './utils/lang-utils.js'

export const SEASON_DURATION = 7 // days

/**
 * 
 * @param {Date} date 
 */
export function getSeasonStart(date = required()) {
    const result = dateFns.setISODay(date, 2)
    result.setUTCHours(16, 0, 0, 0)

    return result
}

/**
 * 
 * @param {Date} date 
 */
export function getSeasonEnd(date = required()) {
    const result = new Date(getSeasonStart(date))
    result.setDate(result.getUTCDate() + SEASON_DURATION)
    return result
}

/**
 * 
 * @param {Date} date 
 */
export function getSeasonTimeLeft(date = required()) {
    const hour = 1000 * 60 * 60
    const day = hour * 24

    const msLeft = getSeasonEnd(date) - date

    const days = Math.floor(msLeft / day)
    const hours = Math.floor((msLeft - (days * day)) / hour)

    return {
        days,
        hours,
        toString() {
            if (this.days > 0) {
                return `${this.days}D ${this.hours}H`
            } else {
                return `${this.hours}H`
            }
        }
    }
}

export const RESET_DURATION = 12 // hours

/**
 * 
 * @param {Date} date 
 */
export function getResetStart(date = required()) {
    const result = new Date(date)
    const hours = result.getUTCHours()

    if (hours < 12) {
        result.setUTCHours(0, 0, 0, 0)
    } else {
        result.setUTCHours(12, 0, 0, 0)
    }

    return result
}

/**
 * 
 * @param {Date} date 
 */
export function getResetEnd(date = required()) {
    const result = new Date(getResetStart(date))
    result.setUTCHours(result.getUTCHours() + RESET_DURATION)
    return result
}

/**
 * 
 * @param {Date} date 
 */
export function getResetTimeLeft(date = required()) {
    const minute = 1000 * 60
    const hour = minute * 60

    const msLeft = getResetEnd(date) - date

    const hours = Math.floor(msLeft / hour)
    const minutes = Math.floor((msLeft - (hours * hour)) / minute)

    return {
        hours,
        minutes,
        toString() {
            if (this.hours > 0) {
                return `${padLeft(this.hours, 2)}H ${padLeft(this.minutes, 2)}M`
            } else {
                return `${padLeft(this.minutes, 2)}M`
            }
        }
    }
}
