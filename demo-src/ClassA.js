
class ClassA {
    static async hello({name}) {
        return {message: `this is a message from Api: got name [${name}]`}
    }
}

export default ClassA