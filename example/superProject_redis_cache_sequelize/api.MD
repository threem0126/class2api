# hello测试方法 #- 接口：http://127.0.0.1:3002/a2/hello- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "this is a message from Api: got name [haungyong]"
  }
}```
# 编辑文章 #- 接口：http://127.0.0.1:3002/admin/editArticle- post参数：```json{
  "aID": 0.6251429828096726
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
  "aID": 0.967419589295613
}```- 请求结果：```json{
  "err": null,
  "result": {
    "success": true
  }
}```