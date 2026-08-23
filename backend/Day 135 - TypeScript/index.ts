// TOPIC TO COVER
// String, Array, Tuple, Boolean, Array, Object, Diff between void & never, any, unknown, keyword: type.

// STRING
// const a: string = "Web Development"
// console.log(a)

// NUMBER
// const b: number = 123
// console.log(b)

// ARRAY
// Usually stores multiple values of the same type.
// Length can change.
// Order is not strictly defined by position.

// const a: Array<number> =[1, 2]
// OR
// let numbers: number[] = [1, 2, 3];

// numbers.push(4); // valid

// Tuple
// Stores a fixed number of values.
// Each position can have a specific type.
// Order and length are defined.
// let user: [string, number] = ["Furqan", 25];

// user[0] = "Ali"; // valid
// user[1] = 30;    // valid
// user[0] = 30; // error


// VOID Fucntion: Function which do not return anything
// const greet = (name: string):void => {
//     console.log("Hello", name)
// }
// greet("Furqan")

// const greet = (name: string):string => {
//     return "Hello " + name
// }
// console.log(greet("Furqan"))


// NEVER funtion: Which wont be ending
// Can be used in Infinite Loops 
// function error(name: String):never{
//     throw Error("Something went wrong!")
// }
// error("Furqan")


// Example 
// type USER = {name: string, age: number, isMale: boolean}

// const user:USER = {
//     name: "Furqan",
//     age: 26,
//     isMale: true
// }

// const greet = (data: USER):void => {
//     console.log("Your name is " + data.name + ". Your age is " + data.age)
// }

// greet(user)

// ANY
//  Koi bhi data type ho skta hai
// let a:any
// a = "hello"

// console.log(a.toUpperCase())

// In above example the issue will be compile time error spooted in js not in ts
// Above issues ko solve "Unknown" krta hai


// UNKNOW

