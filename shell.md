source /opt/bin/common/tool.sh  // 执行脚本 

pod // 查看所有进程

pod|grep h3c // 查看关于h3c的进程

kubectl logs h3c-seccloud-web-rc-rwql7 -f // 查看web进程执行时的打印日志

h3c-seccloud-web-rc-rwql7是web的进程


pod|grep redis // 列出关于redis的进程

kubectl exec -it redis-core-rc-jtsbm bash // 进入redis bash控制台

redis-cli -h 182.9.5.146 -p 6379 -a cloudops // 输入ip地址:端口和密码进入redis bash
