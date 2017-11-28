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
  "name": 0.7924305197142607
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "hello.0.7924305197142607"
  }
}```
# 删除文章 #- 接口：http://127.0.0.1:3002/a2/editArticle- post参数：```json{
  "aID": 0.4042273471923148
}```- 请求结果：```json{
  "err": {
    "_gankao": 1,
    "code": -6,
    "message": "无访问权限（{\n  \"resean\": \"访问被拒绝（目标：[GKModelA.editArticle对应API接口的权限，原因：）\"\n}）",
    "more": "{\n  \"resean\": \"访问被拒绝（目标：[GKModelA.editArticle对应API接口的权限，原因：）\"\n}"
  },
  "result": null
}```