$(function () {
    /* layui模块入口 */
    layui.use(['layer', 'form'], function () {
        //弹出层
        var layer = layui.layer;

        //表单模块
        var form = layui.form;

        //获取连接中的项目id并填充到表单
        var pid = getRequestData("pid");
        form.val("connectionForm", {
            "pId": pid,
            "pIsPublish": "0",
            "status": "-1"
        });
        //初始化查询数据
        var data = form.val("connectionForm");
        connectionInfoSave($.param(data), 0);

        //监听提交 //data.field 数据json
        form.on('submit(connectionForm)', function (data) {
            // console.log(data.field);
            connectionInfoSave($.param(data.field), 1);
        });

        /* 更新数据到后台 opeType -1删除 0查询 1更新/添加 */
        function connectionInfoSave(connectionInfoData, opeType) {
            console.log(connectionInfoData);
            let type;
            if (opeType === 1) {
                type = "POST"
            } else if (opeType === 0) {
                type = "GET"
            }
            $.ajax({
                url: "/project/connectionInfo",
                type: type,
                data: connectionInfoData,
                // contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    if (res.code === "200") {
                        //查询的结果
                        if (opeType === 0) {
                            //初始化给表单赋值
                            console.log(res.data)
                            if (res.data.Length > 0) {
                                let data = res.data.connectionInfo[0];
                                form.val("connectionForm", {
                                    "id": data.id
                                    , "pId": data.pid
                                    , "pcName": data.pcName
                                    , "pcInfo": data.pcInfo
                                    , "pcPhone": data.pcPhone
                                    , "pcCall": data.pcCall
                                    , "pcAccount": data.pcAccount
                                    , "pcAccountName": data.pcAccountName
                                });
                            }
                        } else if (opeType === 1) {
                            //更新的结果
                            let pp = getRequestData("pp") + ",3";
                            let pid = getRequestData("pid");
                            layer.msg('保存成功,跳转中..', {
                                icon: 6,
                                time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
                            }, function () {
                                window.location.href = "/publishProject5" + "?pp=" + pp + "&pid=" + pid;
                            })
                        }
                    }
                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })

        }

        /* layui */
    })


})
