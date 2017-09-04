const TUESDAY = 2

/**
 * 
 * @param {Date} date 
 */
export function getLastTuesday(date) {
    const result = new Date(date)
    const dow = result.getUTCDay()
    let diff = dow - TUESDAY
    if (diff < 0) {
        diff += 7
    }

    result.setUTCDate(result.getUTCDate() - diff)
    return result
}
