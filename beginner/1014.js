const { readFileSync } = require("fs")
const input = readFileSync("./dev/stdin", "utf8").split('\n')

const [x, y] = input.map(Number)

const consum = (d = 0, l = 1) => (d / l).toFixed(3)

function main() {
    const consumValue = consum(x, y)
    console.log(`${consumValue} km/l`)
}

main()