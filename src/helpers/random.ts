// random number generator
export const rng = (min: number, max: number, decimal: number = 1) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimal)
    return parseFloat(str)
}

// random string generator
export const rsg = (length: number) => {
    let result = ''
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    let counter = 0
    while (counter < length) {
        result += char.charAt(Math.floor(Math.random() * char.length))
        counter += 1
    }

    return result
}
