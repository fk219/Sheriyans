// ### COMPOUND INTEREST
// Compound Interest = P × (1 + r / 100)^t − P

const calculateCompoundInterest = (
  principalAmount,
  rateOfInterest,
  tenure
) => {
  const amount = principalAmount * Math.pow(1 + rateOfInterest / 100, tenure);
  return amount - principalAmount;
};
// console.log(calculateCompoundInterest(10000, 5, 3));


// ### Generate OTP

const generateOTP = () => {
  const otp = Math.floor((Math.random() * 9000) + 1000)
  return otp
}
// console.log(generateOTP())


// ### Area of a triangle by Heron’s Formula
// Area Of triangle = Square Roote of (s(s - a)(s - b)(s - c))
//  S = (a+b+c)/2

const areaOfTriangle = (a, b, c) => {
  const semiPerimeter = (a + b + c)/2

  const area = NUmber((Math.sqrt(semiPerimeter * ((semiPerimeter - a) * (semiPerimeter - b) * (semiPerimeter -c)))).toFixed(2))

  return area
}
// console.log(areaOfTriangle(10.2, 7.5, 5.9))
// console.log(typeof(areaOfTriangle(10.2, 7.5, 5.9)))


// ### Circumference of Cirlce

const circumferenceOfCircle = (radius) => {
  const circumference = 2 * Math.PI * radius

  return Number(circumference.toFixed(2))
}

console.log(circumferenceOfCircle(2))