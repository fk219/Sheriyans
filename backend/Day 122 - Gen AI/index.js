import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


rl.question("Whats is Your Name? ", (name) => {
    console.log(`Hello ${name}`)
    rl.close()
})


