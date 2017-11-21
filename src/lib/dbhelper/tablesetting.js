
/**
 * @return formatedDateString
 * @param _date 时间对象
 * @param _fmt 格式string
 * @usage formatDate(new Date(), 'yy年MM月dd日hh时mm分')//17年04月05日10时11分
 */
export const formatDate = (_date, _fmt) => {
    if(!_date)
        return "未知"
    if((typeof _date === "string") || (typeof _date === "number"))
        _date = new Date(_date)
    let o = {
        'M+': _date.getMonth() + 1, // 月份
        'd+': _date.getDate(), // 日
        'h+': _date.getHours(), // 小时
        'm+': _date.getMinutes(), // 分
        's+': _date.getSeconds(), // 秒
        'q+': Math.floor((_date.getMonth() + 3) / 3), // 季度
        'S': _date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(_fmt)) _fmt = _fmt.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(_fmt)) _fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return _fmt
}


export const tabelOption = {
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
}

/**
 * 扩展表Model的虚拟字段，包括：created_at_display、update_at_display
 * @param DataTypes         sequelize内建的数据类型
 * @param othersDateTimeFields  需扩展时间显示虚拟字段的原生字段
 * @returns {{created_at_display: {type: VIRTUAL, get: get}, update_at_display: {type: VIRTUAL, get: get}}}
 */
export const extendDateTimeVirtualFields = (DataTypes,othersDateTimeFields)=> {
    if(!DataTypes){
        throw 'extendDateTimeVirtualFields属性生成器的DataTypes参数没有定义'
    }
    let retValue = {
        created_at_display: {
            type: DataTypes.VIRTUAL,
            get: function () {
                return formatDate(this.get("created_at"), 'MM月dd日 hh:mm')
            }
        },
        update_at_display: {
            type: DataTypes.VIRTUAL,
            get: function () {
                return formatDate(this.get("updated_at"), 'MM月dd日 hh:mm')
            }
        }
    }
    if(othersDateTimeFields && othersDateTimeFields.length>0) {
        othersDateTimeFields.forEach((fieldName, index) => {
            retValue[`${fieldName}_display`] = {
                type: DataTypes.VIRTUAL,
                get: function () {
                    let _fieldName = fieldName
                    let orgValue = this.get(_fieldName)
                    if (!orgValue)
                        return `display修饰的目标字段${_fieldName}并不存在`
                    return formatDate(orgValue, 'MM月dd日 hh:mm')
                }
            }
        })
    }
    return retValue
}

//表分区的支持，暂未实现
// const part_index = []
// if(part_index.length==0) {
//     let letters = []
//     for (let a = 48; a < 58; a++) {
//         letters.push(String.fromCharCode(a))
//     }
//     for (let a = 97; a < 123; a++) {
//         letters.push(String.fromCharCode(a))
//     }
//     letters.map(item => {
//         letters.map(item2 => {
//             part_index.push(`${item}${item2}`)
//         })
//     })
// }
// console.log(`init MyQuestionAnswer.part_index.enum => ${part_index} `)

// export const partiForAccount_enum = part_index