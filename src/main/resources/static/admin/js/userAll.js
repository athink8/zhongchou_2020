$(function () {
    layui.use(['table', 'form', 'layer'], function () {
        var table = layui.table;
        var form = layui.form;
        var layer = layui.layer;

        //动态生成表格，并且生成自定义的分页器
        fenYeInit2("/user/info", "", "#userTable");

        /*发布项目监听列裡工具按鈕*/
        table.on('tool(userTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            //用户删除
            if (layEvent === 'delete') {
                layer.confirm('确定删除该用户吗?', function (index) {
                    dataSave1("/user/info", JSON.stringify(obj.data), -1)
                    layer.close(index);
                });
            } else if (layEvent === 'Lock') {
                layer.confirm('确定锁定该用户吗?', function (index) {
                    obj.data.ulock = "1";
                    dataSave1("/user/info", JSON.stringify(obj.data), 1)
                    layer.close(index);
                });
            } else if (layEvent === 'noLock') {
                layer.confirm('确定解锁该用户吗?', function (index) {
                    obj.data.ulock = "0";
                    dataSave1("/user/info", JSON.stringify(obj.data), 1)
                    layer.close(index);
                });
            } else if (layEvent === 'update') {
                $(".upassword").attr("disabled"," ").addClass("rm1");
                layer.open({
                    type: 1,
                    title: "..",
                    anim: 2,
                    area: ['700px', '490px'],
                    content: $(".userInfoDiv"),
                    success: function (layero, index) {
                        form.val("userInfoForm", {
                            "id": obj.data.id
                            , "uusername": obj.data.uusername
                            , "upassword": obj.data.upassword
                            , "uphone": obj.data.uphone
                            , "uemail": obj.data.uemail
                            , "ulock": obj.data.ulock
                            , "status": obj.data.status
                        });
                    },
                    yes: function () {
                    }
                });
            }
        });

        //监听提交
        form.on('submit(userInfoForm)', function (data) {
            //data.field json对象
            // JSON.stringify(data.field) 字符串化json
            layer.load(1);
            console.log(data.field)
            dataSave1("/user/info", JSON.stringify(data.field), 1);
            return false;
        });

        /*用户后台操作*/
        function dataSave1(url, urlData, type) {
            if (type === 1) {
                type = "POST"
            } else if (type === -1) {
                type = "Delete"
            } else if (type === 0) {
                type = "GET"
            }
            $.ajax({
                url: url,
                type: type,
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    if (res.code === "200") {
                        if (type === "GET") {
                            if (res.data.Length > 0) { //未查询到重复的用户
                                layer.msg("当前用户已存在，请重新输入!", {time: 1000});
                                $('.uusername').focus();
                            }
                        } else {
                            layer.closeAll();
                            layer.msg(res.msg);
                            //重新渲染表格
                            fenYeInit2("/user/info", "", "#userTable");
                        }
                    } else {
                        layer.closeAll();
                        layer.msg("服务器发生未知错误，请检查..")
                    }
                },
                error: function () {
                    layer.closeAll();
                    layer.msg("服务器错误")
                }
            })
        }

        /*监听点击添加用户*/
        $(".addUser").on("click", function () {
            layer.open({
                type: 1,
                title: "..",
                anim: 2,
                area: ['700px', '490px'],
                content: $(".userInfoDiv"),
                success: function (layero, index) {
                    $(".upassword").removeAttr("disabled").removeClass("rm1");
                    form.val("userInfoForm", {
                        "id": ""
                        , "uusername": ""
                        , "upassword": ""
                        , "uphone": ""
                        , "uemail": ""
                        , "ulock": "0"
                        , "status": "1"
                    });
                },
                yes: function () {
                }
            });
        })

        /*监听用户名填写完毕后台检查*/
        $('.uusername').on("focusout", function () {
            var urlData = "uUsername=" + $('.uusername').val();
            dataSave1("/user/info", urlData, 0);
        });
    })
})