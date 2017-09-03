export function number(value, options) {
    const formatter = new Intl.NumberFormat(undefined, options)
    return formatter.format(value)
}