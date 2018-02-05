

export default (DemoUser)=> {
    let Older = DemoUser.scope("Older")
    Older.associate = function (DataModel,ass) {
    }
    return Older;
}


