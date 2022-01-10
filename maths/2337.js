const { readFileSync } = require("fs")
const input = readFileSync("/dev/stdin", "utf8").split("\n")

const MyMath = Object.create(Math, {
	gcd: {
		/**
		 * @param {number} x
		 * @param {number} y
		 */
		value: function gcd(x, y) {
			if (isNaN(x) || isNaN(y)) return Number.NaN
			x = Math.abs(x), y = Math.abs(y)
			while (y) [x, y] = [y, x % y]
			return x
		},
		configurable: false,
		enumerable: false,
		writable: false
	}
})

function binetFormule(nth) {
	if (nth < 0) return 0
	const sqrt5 = Math.sqrt(5)
	const nthPower = (equation) => Math.pow(equation / 2, nth) / sqrt5

	return Math.round(nthPower(1 + sqrt5) - nthPower(1 - sqrt5))
}

function main() {
	const responses = []

	for (const coins of input) {
		if (coins == "") break // EOFile Condition

		if (+coins < 2) {
			responses.push("1/1")
			continue
		}

		const num = binetFormule(+coins + 2)
		const den = 2 ** +coins
		const mdc = MyMath.gcd(num, den)

		responses.push(`${num / mdc}/${den / mdc}`)
	}

	console.log(`${responses.join("\n")}`)
}

main()