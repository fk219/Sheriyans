// ------------------- Interfaces
// Interface ka kaam hai object ka shape batana
// Object ki properties ke types define krte hai Interfaces me
// INterface === Shakal
//  In the below example "useProfile" ki shakal "User" jaisi hai

interface User {
    name: string,
    email: string
    age: number,
    isMale: boolean
}

function sample(userProfile: User): void{
    userProfile.age = 12,
    userProfile.email = "fk@fk.com",
    userProfile.name = 'Furqan'
}







// Types ka kaam hai User defined type banana