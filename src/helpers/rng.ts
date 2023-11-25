// random number generator
const rng = (min: number, max: number, decimal: number = 1) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimal)
    return parseFloat(str)
}

export default rng
