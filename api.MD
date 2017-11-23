# 方法Hello #- 接口：http://127.0.0.1:3002/gkmodela/hello- post参数：```json{
  "name": "haungyong"
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "hello.haungyong"
  }
}```
# 以别名方式请求 #- 接口：http://127.0.0.1:3002/a2/hello- post参数：```json{
  "name": 0.9672531362884891
}```- 请求结果：```json{
  "err": null,
  "result": {
    "message": "hello.0.9672531362884891"
  }
}```