import {ModelSetting} from 'class2api/dbhelper';

export default (sequelize, DataTypes)=> {
//region
    const DemoUser = sequelize.define('demouser', {
        name: {
            type: DataTypes.STRING, allowNull: false, defaultValue: '', comment: `用户的姓名`
        },
        age: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, comment: `年龄`
        },
        ...ModelSetting.extendDateTimeVirtualFields(DataTypes, [])
    }, {
        ...ModelSetting.tabelOption,
        indexes: [],
        hooks: {},
        classMethods: {
            associate: function (DataModel, ass) {
                //DemoUser.belongsTo(DataModel.XXXXX)
            }
        },
        instanceMethods: {},
        defaultScope: {},
        scopes: {},
        comment: '备注'
    });
    return DemoUser;
//endregion
}
