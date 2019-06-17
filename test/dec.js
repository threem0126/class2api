
const A = function (target, name, descriptor) {
    let oldValue = descriptor.value;
    descriptor.value = async function () {
        let result = await oldValue(...arguments);
        return result
    }
}
const B = function (target, name, descriptor) {
    let oldValue = descriptor.value;
    descriptor.value = async function () {
        let result = await oldValue(...arguments);
        return result
    }
}

class Class01{

    @A
    @B
    static hello(){
        return "hello";
    }
}

console.log(Class01.hello())
