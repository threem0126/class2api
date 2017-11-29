
export const gkRuleValidator =({jwtoken, funPath, ruleName, ruleDescript})=> {
    if(ruleName==='删除文章'){
        return {canAccess: true, resean: ''}
    }else{
        return {canAccess: false, resean: '系统未授权'}
    }
}



