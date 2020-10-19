$(function () {
    layui.use(['table', 'form', 'layer'], function () {
        var table = layui.table;
        var form = layui.form;
        var layer = layui.layer;

        //动态生成表格，并且生成自定义的分页器
        fenYeInit7("/user/role", {}, "#roleTable");
        fenYeInit8("/user/userRole", {}, "#userRoleTable");

        /*权限类型裡工具按鈕*/
        table.on('tool(roleTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            //用户删除
            if (layEvent === 'delete') {
                if (obj.data.id === 1) {
                    layer.msg("管理员权限就别删除啦~")
                } else {
                    layer.confirm("请勿乱删除，删除将导致系统出错！<br>....确定删除该角色吗?", function (index) {
                        dataSave1("/user/role", JSON.stringify(obj.data), -1)
                        layer.close(index);
                    });
                }
            } else if (layEvent === 'update') {
                layer.open({
                    type: 1,
                    title: "..",
                    anim: 2,
                    area: ['500px', '300px'],
                    content: $(".roleDiv"),
                    success: function (layero, index) {
                        form.val("roleForm", {
                            "id": obj.data.id
                            , "rroleName": obj.data.rroleName
                            , "roperate": obj.data.roperate
                        });
                    },
                    yes: function () {
                    }
                });
            }
        });

        /*用户权限裡工具按鈕*/
        table.on('tool(userRoleTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            if (layEvent === 'update') {
                if (obj.data.id === 1) {
                    layer.msg("这个admin管理员就别修改啦~")
                } else {
                    layer.open({
                        type: 1,
                        title: "..",
                        anim: 2,
                        area: ['550px', '450px'],
                        content: $(".userRoleDiv"),
                        success: function (layero, index) {
                            form.val("userRoleForm", {
                                "id": obj.data.id
                                , "userInfo.id": obj.data.userInfo.id
                                , "userInfo.uusername": obj.data.userInfo.uusername
                                , "role.id": obj.data.role.id
                                , "status": obj.data.status
                            });
                        },
                        yes: function () {
                        }
                    });
                }
            }
        });

        //监听提交
        form.on('submit(roleForm)', function (data) {
            //data.field json对象
            // JSON.stringify(data.field) 字符串化json
            layer.load(1);
            console.log(data.field)
            dataSave1("/user/role", JSON.stringify(data.field), 1);
            return false;
        });

        //监听提交
        form.on('submit(userRoleForm)', function (data) {
            //data.field json对象
            // JSON.stringify(data.field) 字符串化json
            layer.load(1);
            console.log(data.field);
            data.field.role = {"id": data.field["role.id"]};
            console.log(data.field);
            dataSave1("/user/userRole", JSON.stringify(data.field), 1);
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
                        layer.closeAll();
                        layer.msg(res.msg);
                        //重新渲染表格
                        fenYeInit7("/user/role", {}, "#roleTable");
                        fenYeInit8("/user/userRole", {}, "#userRoleTable");
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
        $(".addDictionaryItem").on("click", function () {
            layer.open({
                type: 1,
                title: "..",
                anim: 2,
                area: ['700px', '470px'],
                content: $(".dictionaryItemDiv"),
                success: function (layero, index) {
                    $(".dicId").removeAttr("disabled").removeClass("rm1");
                    $(".itemCode").removeAttr("disabled").removeClass("rm1");
                    form.val("dictionaryItemForm", {
                        "id": ""
                        , "dicId": ""
                        , "itemCode": ""
                        , "itemName": ""
                        , "itemInfo": ""
                        , "status": ""
                    });
                },
                yes: function () {
                }
            });
        })

        /*监听点击添加*/
        $(".addRole").on("click", function () {
            layer.open({
                type: 1,
                title: "..添加",
                anim: 2,
                area: ['500px', '300px'],
                content: $(".roleDiv"),
                success: function (layero, index) {
                    form.val("roleForm", {
                        "id": ""
                        , "rroleName": ""
                        , "roperate": ""
                    });
                },
                yes: function () {
                }
            });
        })
    });

    addSelect1("/user/role", null, ".roleSelect");

    /*根据权限类型装配选择框类型*/
    function addSelect1(url, urlData, select) {
        //后台获取数据
        $.getJSON(url, urlData, function (res) {
            $(select).empty();
            $(select).append("<option value=\"\">全部</option>");
            if (res.data.Length <= 0) {
                $(select).html("--");
            }

            $.each(res.data.roles, function (i, item) {
                $(select).append("<option  " + " value=\"" + item.id + "\">" + item.rroleName + "</option>");
            });
        }).error(function (xhr) {
            $(select).html("--");
            //xhr:XMLHttpRequest对象  xhr.responseJSON 获取完整的错误信息
            console.log("服务器错误,错误信息：");
            console.log(xhr.responseJSON);
        })
    }

})