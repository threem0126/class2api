
class Base {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    static async TestInside({name}) {
        return {message: `hello ${name}`}
    }
}

export default Base;


















