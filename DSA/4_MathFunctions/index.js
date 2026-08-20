// Math functions are ready-made tools that help us work with numbers.
// Run this file with: node index.js

console.log("========== BASIC MATH FUNCTIONS ==========");

// 1. Math.abs()
// Returns the distance from zero. A negative number becomes positive.
console.log("Math.abs(-21):", Math.abs(-21)); // 21
console.log("Math.abs(21):", Math.abs(21));   // 21

// 2. Math.ceil()
// Moves a decimal number up to the next whole number.
console.log("Math.ceil(21.1):", Math.ceil(21.1)); // 22
console.log("Math.ceil(21.9):", Math.ceil(21.9)); // 22

// 3. Math.floor()
// Moves a decimal number down to the previous whole number.
console.log("Math.floor(21.1):", Math.floor(21.1)); // 21
console.log("Math.floor(21.9):", Math.floor(21.9)); // 21

// 4. Math.round()
// Rounds to the nearest whole number.
// Decimal part below 0.5 goes down; 0.5 or above goes up.
console.log("Math.round(21.4):", Math.round(21.4)); // 21
console.log("Math.round(21.5):", Math.round(21.5)); // 22

// 5. Math.trunc()
// Removes the decimal part. It does not round the number.
console.log("Math.trunc(21.9255):", Math.trunc(21.9255)); // 21
console.log("Math.trunc(-21.9255):", Math.trunc(-21.9255)); // -21

// 6. Math.pow()
// Accepts two values: the base number and its power.
console.log("Math.pow(10, 3):", Math.pow(10, 3)); // 1000

// The ** operator does the same thing in modern JavaScript.
console.log("10 ** 3:", 10 ** 3); // 1000

// 7. Math.max()
// Returns the greatest value from the given numbers.
console.log("Math.max():", Math.max(32, 21, 33, 23, 67, 32, 69)); // 69

// 8. Math.min()
// Returns the smallest value from the given numbers.
console.log("Math.min():", Math.min(32, 21, 33, 23, 67, 32, 69)); // 21

// 9. Math.random()
// Returns a random decimal from 0 (included) up to 1 (not included).
console.log("Math.random():", Math.random());

// Random integer from 1 to 10:
// Math.random() * 10 gives a value from 0 to less than 10.
// Math.floor() changes it to an integer from 0 to 9.
// Adding 1 changes the range to 1 to 10.
const randomNumber = Math.floor(Math.random() * 10) + 1;
console.log("Random number from 1 to 10:", randomNumber);

// 10. toFixed()
// toFixed() is a Number method, not a Math method.
// It keeps the requested number of digits after the decimal point.
// Important: toFixed() returns a string.
const price = 99.4567;
const formattedPrice = price.toFixed(2);
console.log("Price with 2 decimals:", formattedPrice); // "99.46"
console.log("Type of formatted price:", typeof formattedPrice); // string

// Convert the result back to a number when needed.
console.log("Formatted price as a number:", Number(formattedPrice)); // 99.46

console.log("\n========== USEFUL EXTRA FUNCTIONS ==========");

// 11. Math.sqrt()
// Returns the square root of a number.
console.log("Math.sqrt(25):", Math.sqrt(25)); // 5

// 12. Math.cbrt()
// Returns the cube root of a number.
console.log("Math.cbrt(27):", Math.cbrt(27)); // 3

// 13. Math.sign()
// Tells us whether a number is negative, positive, or zero.
console.log("Math.sign(-10):", Math.sign(-10)); // -1
console.log("Math.sign(0):", Math.sign(0));     // 0
console.log("Math.sign(10):", Math.sign(10));   // 1

// 14. Math.hypot()
// Returns the length of the hypotenuse using numbers as sides.
console.log("Math.hypot(3, 4):", Math.hypot(3, 4)); // 5