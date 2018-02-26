
class ClassA {
    static async hello({name,age,year,req}) {
        console.log(`otherParams:${JSON.stringify({name,age,year})}`)
        console.dir(req)
        return {message: `this is a message from Api: got name [${name}]`}
    }
}

export default ClassA