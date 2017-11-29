# 方法Hello #- 接口：http://127.0.0.1:3002/gkmodela/hello- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "hello.haungyong"
  }
}```
# 以别名方式请求 #- 接口：http://127.0.0.1:3002/a2/hello- post参数：```json{
  "name": 0.22277732227481217
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "hello.0.22277732227481217"
  }
}```
# 编辑文章 #- 接口：http://127.0.0.1:3002/a2/editArticle- post参数：```json{
  "aID": 0.7556808848883785
}```- 请求结果：```json{
  "err": null,
  "result": {
    "success": true
  }
}```
# 删除文章 #- 接口：http://127.0.0.1:3002/a2/deleteArticle- post参数：```json{
  "aID": 0.09857105384423259
}```- 请求结果：```json{
  "err": null,
  "result": {
    "success": true
  }
}```