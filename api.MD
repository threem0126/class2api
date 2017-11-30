# 方法Hello #- 接口：http://127.0.0.1:3002/gkmodela/hello- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "hello.haungyong",
    "__fromCache": true
  }
}```
# 以别名方式请求 #- 接口：http://127.0.0.1:3002/a2/hello- post参数：```json{
  "name": 0.17396548669644774
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "hello.0.17396548669644774"
  }
}```
# 编辑文章 #- 接口：http://127.0.0.1:3002/a2/editArticle- post参数：```json{
  "aID": 0.049042694128691666
}```- 请求结果：```json{
  "err": {},
  "result": null
}```