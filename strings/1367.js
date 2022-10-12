//// READING FILE | STREAMS ////
const { createReadStream } = require("node:fs")
const { createInterface } = require("node:readline")

class LineReader {
	/**
	 * @param {import("node:fs").PathLike} path
	 * @param {BufferEncoding} encoding
	 * @return {import("node:readline").ReadLine}
	 */
	static createReadLineInterface(path, encoding = "utf8") {
		const readStreamOptions = {
			encoding: encoding,
			flags: "r",
			emitClose: true,
			autoClose: true
		}

		return createInterface({
			input: createReadStream(path, readStreamOptions),
			crlfDelay: Infinity,
			terminal: false
		})
	}

	/**
	 * @param {import("node:fs").PathLike} path
	 * @param {BufferEncoding} encoding
	 */
	static create(path, encoding) {
		const RLI = LineReader.createReadLineInterface(path, encoding)

		let EOF = false

		const nextLineGenerator = (async function* () {
			for await (const line of RLI)
				yield line
		})()

		RLI.once("close", () => { EOF = true })

		return {
			hasNextLine: () => !EOF,
			nextLine: async (/** @type {unknown} */ fn) => {
				const { value } = (await nextLineGenerator.next())
				return (typeof fn === "function") ? fn(value) : value
			},
			close: () => RLI.close()
		}

	}
}


async function main() {
	const output = []

	const PATH = "/dev/stdin"
	const ENCODING = "utf8"

	const lineReader = LineReader.create(PATH, ENCODING)

	while (lineReader.hasNextLine()) {
		const submissionsMap = new Map()
		const submissionsQuantity = Number.parseInt(await lineReader.nextLine(), 10)

		if (submissionsQuantity === 0) break

		for (let s = 0; s < submissionsQuantity; s += 1) {
			const [identifier, time, judgment] = (await lineReader.nextLine()).split(" ", 3)

			if (submissionsMap.has(identifier)) {
				const submission = submissionsMap.get(identifier)

				submission.tries += 1
				submission.status = judgment
				submission.time = Number.parseInt(time, 10)
			} else {
				submissionsMap.set(identifier, {
					status: judgment,
					tries: 1,
					time: Number.parseInt(time, 10)
				})
			}
		}

		const correctsList = Array
			.from(submissionsMap.values())
			.filter(problem => problem.status === "correct")

		const ponctuation = correctsList.reduce((sum, problem) => sum + problem.time + 20 * (problem.tries - 1), 0)

		output.push(`${correctsList.length} ${ponctuation}`)
	}

	console.log(output.join("\n"))
}

main()
