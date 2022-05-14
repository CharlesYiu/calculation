# Calculation.ts
Evaluates calculations

# syntax
The syntax is like regular javascript with the exponent ('\**') be '^' instead
# generateTape(calculation: string): Tape
Original text: '1+(2-1)'  
Parsed text (Tape):
```JSON
[
  1,
  "+",
  [
    2,
    "-",
    1
  ]
]
```
# calculateTape(calculationTape: Tape): number
Tape (parsed text):
```JSON
[
  1,
  "+",
  [
    2,
    "-",
    1
  ]
]
```
Result: 2
# usage
You can use this by importing the script or running it with node (ts) like this:
```sh
$ ts-node calculation.ts '1+(2-1)'
[ 1, '+', [ 2, '-', 1 ] ]
2
```
