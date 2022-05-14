export enum Operator {
    exponent = "^",
    division = "/",
    multiplication = "*",
    addition = "+",
    subtraction = "-"
}
export type TapeElement = Operator | number | Tape
export type Tape = Array<TapeElement>
export function generateTape(calculation: string): Tape {
    let calculationTape: Tape = []
    let nestLevel: number = 0
    let nestStart: number = NaN
    let currentNumber: string = ""
    let wasOperator: boolean = false
    let wasNested: boolean = false
    const calculationArray = Array.from(calculation)
    for (let index = 0; index < calculationArray.length; index++) {
        const character = calculationArray[index]
        if (character === "(") {
            if (wasNested) throw Error("Some operators are missing.")
            if (nestLevel === 0) {
                nestStart = index
            }
            nestLevel += 1
        } else if (character === ")") {
            if (isNaN(nestStart)) throw Error("Some brackets are not opened.")
            if (nestLevel === 1) {
                calculationTape.push(generateTape(calculation.substring(nestStart + 1, index)))
                wasNested = true
            }
            nestLevel -= 1
        } else if (nestLevel === 0) {
            if (!isNaN(parseInt(character)) || character === ".") {
                if (character === "." && currentNumber.includes(".")) throw Error("Some numbers are invalid")
                currentNumber += character
                wasOperator = false
                wasNested = false
            }
            if ((Object.values(Operator).includes(character as Operator) || (index + 1) === calculationArray.length) && currentNumber !== "") {
                currentNumber = currentNumber.startsWith(".") ? "0" + currentNumber : currentNumber
                currentNumber = currentNumber.endsWith(".") ? currentNumber + "0" : currentNumber
                calculationTape.push(parseFloat(currentNumber))
                currentNumber = ""
            }
            if (Object.values(Operator).includes(character as Operator)) {
                calculationTape.push(character as Operator)
                if (wasOperator) throw Error("Some operators are not placed correctly.")
                wasOperator = true
                wasNested = false
            }
        }
    }
    function removeNestedCalculationTape(calculationTape: Tape): Tape {
        if (calculationTape.length > 1) return calculationTape
        if (calculationTape[0] === undefined) return [calculationTape]
        return removeNestedCalculationTape(calculationTape[0] as Array<Tape>)
    }
    calculationTape = removeNestedCalculationTape(calculationTape)
    if (Object.values(Operator).includes(calculationTape[calculationTape.length - 1] as Operator)) throw Error("Some operators are not placed correctly.")
    if (nestLevel !== 0) throw Error("Some brackets are not closed.")
    return calculationTape
}
export function calculateTape(calculationTape: Tape): number {
    function calculateOperator(operator: Operator, calculationTape: Tape): Tape {
        while (calculationTape.includes(operator)) {
            const index = calculationTape.indexOf(operator)
            if (index === -1) break
            const tapeElement = calculationTape[index]
            if (tapeElement === operator) {
                let firstNumber: number = NaN
                if ((typeof calculationTape[index - 1]) === "object") firstNumber = calculateTape(calculationTape[index - 1] as Array<Tape>)
                else if ((typeof calculationTape[index - 1]) === "number") firstNumber = calculationTape[index - 1] as number
                let lastNumber: number = NaN
                if ((typeof calculationTape[index + 1]) === "object") lastNumber = calculateTape(calculationTape[index + 1] as Array<Tape>)
                else if ((typeof calculationTape[index + 1]) === "number") lastNumber = calculationTape[index + 1] as number
                
                let calculation = NaN
                switch (tapeElement) {
                    case Operator.exponent:
                        calculation = firstNumber ** lastNumber
                        break
                    case Operator.division:
                        calculation = firstNumber / lastNumber
                        break
                    case Operator.multiplication:
                        calculation = firstNumber * lastNumber
                        break
                    case Operator.addition:
                        calculation = firstNumber + lastNumber
                        break
                    case Operator.subtraction:
                        calculation = firstNumber - lastNumber
                        break
                    default:
                        break
                }
                let newCalculationTape: Tape = calculationTape.splice(0, index - 1)
                newCalculationTape.push(calculation)
                newCalculationTape = newCalculationTape.concat(calculationTape.splice(index + 2, calculationTape.length))
                calculationTape = newCalculationTape
            }
        }
        return calculationTape
    }
    calculationTape = calculateOperator(Operator.exponent, calculationTape)
    calculationTape = calculateOperator(Operator.division, calculationTape)
    calculationTape = calculateOperator(Operator.multiplication, calculationTape)
    calculationTape = calculateOperator(Operator.addition, calculationTape)
    calculationTape = calculateOperator(Operator.subtraction, calculationTape)
    if (calculationTape.length > 1) return NaN
    return calculationTape[0] as number
}
process.argv.slice(2).forEach((calculation: string) => {
    const calculationTape: Tape = generateTape(calculation)
    console.log(calculationTape)
    console.log(calculateTape(calculationTape))
})