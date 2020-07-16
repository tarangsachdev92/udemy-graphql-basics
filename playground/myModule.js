// Named export - has a name. Have as many as needed 
// Default export - has np name. Have only one

const message = "some message from myModule.js"
const name = "tarang sachdev"
const location = "Jamanagar"


const getGreeting = (name) => {
    return `Welcome to the course ${name}`;
}

export { message, name, getGreeting, location as default }


