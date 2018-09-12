# hello测试方法 #- 接口：undefined- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json"{\"err\":null,\"result\":{\"message\":\"this is a message from Api: got name [haungyong]\"}}"```
# hello测试方法 #- 接口：undefined- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "this is a message from Api: got name [haungyong]"
  }
}```
# 方法getArticle #- 接口：undefined- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": {
    "name": "SequelizeAccessDeniedError",
    "message": "ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost' (using password: NO)",
    "parent": {
      "code": "ER_ACCESS_DENIED_ERROR",
      "errno": 1045,
      "sqlMessage": "Access denied for user 'root'@'localhost' (using password: NO)",
      "sqlState": "28000",
      "fatal": true
    },
    "original": {
      "code": "ER_ACCESS_DENIED_ERROR",
      "errno": 1045,
      "sqlMessage": "Access denied for user 'root'@'localhost' (using password: NO)",
      "sqlState": "28000",
      "fatal": true
    }
  },
  "result": null
}```