// ------------------- Interfaces
// Interface ka kaam hai object ka shape batana
// Object ki properties ke types define krte hai Interfaces me
// INterface === Shakal
//  In the below example "useProfile" ki shakal "User" jaisi hai

// interface User {
//     name: string,
//     email: string
//     age: number,
//     isMale: boolean
//     gender?: string
// }

// function sample(userProfile: User): void{
//     userProfile.age = 12,
//     userProfile.email = "fk@fk.com",
//     userProfile.name = 'Furqan'
// }



// 2 interfaces of same number will be merged automaticaly
// interface abc {
//     email: string
// }

// interface abc {
//     phone: number
// }



// --------------------EXTENDING INTERFACE
// Admin ke paas user ki saari properties hogi with an extra prop. admin: bolean

// interface User {
//     name: string,
//     age: number,
//     gender?: string,
//     isMale: boolean
// }

// interface Admin extends User {
//     admin: boolean
// }



// ----------------------------- TYPE ALIASES ----------------------------
// Types ka kaam hai User defined type banana
// Apne man chahe naam ka type bana sakte ho
// Khudke ka type banake ghoshit kr skte ho

// Example
// type sankhya = number;
// let a: sankhya

// Actual usecase
// type value = string | number | null
// let a: value



// ---------------------Union & Intersection Types

// Union "|" (Ya to stroing ya to null)
// let a: string | null

// INtersection '&'

type User = {
    email: string,
    name: string
}

type Admin = User & {
    getDetails(user: string): void
}


// Diff between type and interface
//  In types below example will throw an error, interface me merge kr rha tha 
// type abc = string
// type abc = number

