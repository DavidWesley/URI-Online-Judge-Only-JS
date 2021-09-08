const { readFileSync } = require("fs")
const cases = readFileSync("/dev/stdin", "utf8").split("\n")

const MAX_ACEPTABLE_INTEGER = 2147483647

const isALegallInteger = (num) => Number.isInteger(num) && num <= MAX_ACEPTABLE_INTEGER

function processInputIntoIntengers(inputInteger = "") {
	const processedNum = inputInteger
		.replaceAll(/[l]/, "1")
		.replaceAll(/[Oo]/, "0")
		.replaceAll(/[\,\s]/, "")

	return processedNum.replaceAll(/\D/, "") === processedNum
		? Number.parseInt(processedNum, 10)
		: NaN
}

function main() {
	const responses = []

	cases.forEach((input) => {
		const processedInteger = processInputIntoIntengers(input)

		responses.push(
			isALegallInteger(processedInteger) ? processedInteger : "error"
		)
	})


	const rest = responses.pop() //! bug

	console.log(`${responses.join("\n")}`)
}

main()
