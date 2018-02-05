import {TableSetting} from 'class2api/dbhelper';

export default (sequelize, DataTypes)=> {
//region
    const DemoUser = sequelize.define('demouser', {
        name: {
            type: DataTypes.STRING, allowNull: false, defaultValue: '', comment: `用户的姓名`
        },
        age: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, comment: `年龄`
        },
        ...TableSetting.extendDateTimeVirtualFields(DataTypes, [])
    }, {
        ...TableSetting.tabelOption,
        indexes: [],
        hooks: {},
        classMethods: {
            associate: function (DataModel, ass) {
                //DemoUser.belongsTo(DataModel.XXXXX)
            }
        },
        instanceMethods: {},
        defaultScope: {},
        scopes: {
            Older: {where: {age:{$gt:18}}},
        },
        comment: '备注'
    });
    return DemoUser;
//endregion
}
