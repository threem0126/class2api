# 方法getArticle #- 接口：http://127.0.0.1:3002/gkmodela/getArticle- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "getArticle.haungyong，from user. 12345678",
    "__fromCache": true
  }
}```
# 以别名方式请求 #- 接口：http://127.0.0.1:3002/a2/getArticle- post参数：```json{
  "name": 0.9876689663931373
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "getArticle.0.9876689663931373，from user. 12345678"
  }
}```
# 编辑文章 #- 接口：http://127.0.0.1:3002/admin/editArticle- post参数：```json{
  "aID": 0.28993485900729743
}```- 请求结果：```json{
  "err": {
    "_gankao": 1,
    "code": -6,
    "message": "无访问权限（{\n  \"resean\": \"访问被拒绝（功能：[文章系统/编辑文章]，代码:[GKModelA.editArticle]，原因：未授权）\"\n}）",
    "more": "{\n  \"resean\": \"访问被拒绝（功能：[文章系统/编辑文章]，代码:[GKModelA.editArticle]，原因：未授权）\"\n}"
  },
  "result": null
}```
# 删除文章 #- 接口：http://127.0.0.1:3002/admin/deleteArticle- post参数：```json{
  "aID": 0.650235328867657
}```- 请求结果：```json{
  "err": null,
  "result": {
    "success": true
  }
}```