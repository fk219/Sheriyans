// Primitives & Reference


// ------------------- REFERENCE -----------------
// [] {} ()
// Jo datatype me brackets lage wo reference data type hai 
// Inme koi bhi changes hogi to parent me reflect hoga
// IN the below example 'b' ki koi value hi nhi hai wo sirf 'a' ki value ka reference hai

// Example
// let a = [1, 2, 3, 4, 5];
// let b = a;
// b.pop();
// console.log(a);

// Answer: [1,2,3,4]

// Primitive ko app directly copy kr skte ho a=b pr reference ko direct copy nhi krskte


// ----------------- PRIMITIVE -----------------
// STRINGS, NUMBERS, BOOLEAN are primitive datatypes

// ---------------- Defining Variable:
// var (dont use)
// let
// const

// -----------------Number:
// let a:number = 12

// ----------------- String
// let a:string = 'coding'

// Boolean
// let a:boolean = true


// -------------------- ARRAYS
// let arr: Number[] = [1,2,3]


// -------------------- TUPLES
// Tuples controlled array hota hai.
// Yaha pr pehle se hi hum define krte hai kitne elements honge aur unki type kya hogi array mai 
// Aisa array jiska size, aur konsa type ka element kis location me likha jaega us array ko tuple kehte hai
// let arr: [string, number] = ['furqan', 219]


// --------------------Enums (Enumerations)
// Similar to Objects with special powers
// Properties equal "=" se define hoti hai nahi colon se (object ki tarah) 
// Enumeratio predefined rules set krne ka kaam ata hai
// JS me enum ka function banta ha

// enum UserRoles{
//     ADMIN = "admin",
//     GUEST = "guest",
//     SUPER_ADMIN = "super_admin"
// }

// // Later values can be picker up easily
// UserRoles.SUPER_ADMIN


// -------------------- ANY
// Jab variable define krte aur tum uski type ko leke unsure ho/ ya uska type declare nhi karna hai to 'ANY' use hota h
// Jab koi variable ki type define nhi hoti to uski type 'ANY hoti hai
// As a developer make sure your variabe type SHOULD not be Any!!!
// ANY ke sath TS OFF ho jati hai - smjho

// let a;


// -------------------- UNKNOWN
// Jo bhi value assign krna hai karlo, pr jab value use karna hoga to "TYPE Narrowing (type check karna padega)" karna padega
// Below example be like, Pehle check karo ke wo string hai fir hi string ka method lagao

// let a: unknown;
// a = 12;
// a = 'code';

// if(typeof a === "string"){
//     a.toUpperCase()
// }


// -------------------- VOID
//  Agar function kuch return nhi karta hai to wo void fucntion hota hai
// Jab bhi fucntion banana hai to uska return type batana hai
// function code(): void {
//     console.log("Hello World")
// }

// Other Examples
// for Number
// function code(): number {
//     return 4 + 2
// }

// for String
// function code(): string {
//     return "Hello Furqan"
// }



// -------------------- NULL
// Intentional absence of a value

// Maan lo ek user apna form bhar raha hai:
// First Name: Furqan
// Middle Name: (Khali hai, kyunki middle name nahi hai)

// Code mein hum isko aise likhte hain:
// let middleName: string | null = null; 
// // Iska matlab ya toh string aayegi, ya fir 'null' (khali) rahegi

// Agar aap sirf string likhoge aur usme null daalne ki koshish karoge, toh TypeScript error de dega:

// let firstName: string = "Furqan";
// firstName = null; 
// // ❌ Error: String wali jagah par khali value nahi daal sakte!


// 2. Error se bachne ke 2 aasan tareeqe
// Jab value null ho sakti hai, toh direct dot (.) use karne par code crash ho sakta hai. Isse bachne ke tareeqe:

// Tarika A: if-check lagao (Safest)
// if (middleName !== null) {
//   console.log(middleName.toUpperCase()); // ✅ Ab TypeScript ko pata hai ki value null nahi hai
// }

// Tarika B: Question mark (?.) lagao (Optional Chaining)
// console.log(middleName?.toUpperCase()); // ✅ Agar null hoga toh code crash nahi hoga, bas 'undefined' return karega

// Tarika C: Default value do (?? Nullish Coalescing)
// let displayName = middleName ?? "N/A"; // Agar middleName null hai, toh "N/A" use karega


// -------------------- UNDEFINED
// undefined: Variable bana diya par usme kuch daala hi nahi (TypeScript/JS ka default state).
// Koi value nhi hai to 'undefined' hai


// -------------------- NEVER
// Never ending fuction ya "throw Error" fucntion me hi use hota hai mostly
// RARELY USED