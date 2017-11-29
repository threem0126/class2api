# 方法Hello #- 接口：http://127.0.0.1:3002/gkmodela/hello- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "hello.haungyong"
  }
}```
# 以别名方式请求 #- 接口：http://127.0.0.1:3002/a2/hello- post参数：```json{
  "name": 0.44016344618545067
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "hello.0.44016344618545067"
  }
}```
# 编辑文章 #- 接口：http://127.0.0.1:3002/a2/editArticle- post参数：```json{
  "aID": 0.7484546167558073
}```- 请求结果：```json{
  "err": {
    "_gankao": 1,
    "code": -6,
    "message": "无访问权限（{\n  \"resean\": \"访问被拒绝（功能：[文章系统/编辑文章]，代码:[GKModelA.editArticle]，原因：系统未授权）\"\n}）",
    "more": "{\n  \"resean\": \"访问被拒绝（功能：[文章系统/编辑文章]，代码:[GKModelA.editArticle]，原因：系统未授权）\"\n}"
  },
  "result": null
}```
# 删除文章 #- 接口：http://127.0.0.1:3002/a2/deleteArticle- post参数：```json{
  "aID": 0.5028343576614922
}```- 请求结果：```json{
  "err": null,
  "result": {
    "success": true
  }
}```