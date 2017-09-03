export function padLeft(str, length = str.length, char = ' ') {
    let pad = ''
    for (let i = 1; i <= length - str.toString().length; i++) {
        pad += char
    }

    return pad + str
}