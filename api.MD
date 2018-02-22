# hello测试方法 #- 接口：http://127.0.0.1:3002/a/hello- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": "API方法未定义(/a/hello, 请确认类是否存在或类的名称是否有变更！)",
  "result": null
}```
# 方法getArticle #- 接口：http://127.0.0.1:3002/gkmodela/getArticle- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "getArticle.haungyong, user.uID = undefined, [object Promise]"
  }
}```
# 以别名方式请求 #- 接口：http://127.0.0.1:3002/a2/getArticle- post参数：```json{
  "name": 0.4042739313420809
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "getArticle.0.4042739313420809, user.uID = undefined, [object Promise]"
  }
}```
# 以别名方式请求 #- 接口：http://127.0.0.1:3002/a2/customResponseResultStruck- post参数：```json{}```- 请求结果：```json{
  "data": {
    "name": "huangyong"
  },
  "errorCode": 123
}```
# 编辑文章 #- 接口：http://127.0.0.1:3002/admin/editArticle- post参数：```json{
  "aID": 0.7104724865511804
}```- 请求结果：```json{
  "err": "API方法未定义(/admin/editArticle, 请确认类是否存在或类的名称是否有变更！)",
  "result": null
}```
# 删除文章 #- 接口：http://127.0.0.1:3002/admin/deleteArticle- post参数：```json{
  "aID": 0.4701445434004874
}```- 请求结果：```json{
  "err": "API方法未定义(/admin/deleteArticle, 请确认类是否存在或类的名称是否有变更！)",
  "result": null
}```