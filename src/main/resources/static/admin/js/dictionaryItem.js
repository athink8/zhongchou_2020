$(function () {
    layui.use(['table', 'form', 'layer'], function () {
        var table = layui.table;
        var form = layui.form;
        var layer = layui.layer;

        //动态生成表格，并且生成自定义的分页器
        fenYeInit3("/project/dictionaryItem", {"status": -1}, "#dictionaryItemTable");
        fenYeInit4("/project/dictionaryType", {"status": -1}, "#dictionaryTypeTable");

        /*发布项目监听列裡工具按鈕*/
        table.on('tool(dictionaryItemTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            //用户删除
            if (layEvent === 'delete') {
                layer.confirm("请勿乱删除，删除将导致系统出错！<br>....确定删除该字典吗?", function (index) {
                    dataSave1("/project/dictionaryItem", JSON.stringify(obj.data), -1)
                    layer.close(index);
                });
            } else if (layEvent === 'update') {
                $(".dicId").attr("disabled", " ").addClass("rm1");
                $(".itemCode").attr("disabled", " ").addClass("rm1");
                layer.open({
                    type: 1,
                    title: "..",
                    anim: 2,
                    area: ['700px', '490px'],
                    content: $(".dictionaryItemDiv"),
                    success: function (layero, index) {
                        form.val("dictionaryItemForm", {
                            "id": obj.data.id
                            , "dicId": obj.data.dicId
                            , "itemCode": obj.data.itemCode
                            , "itemName": obj.data.itemName
                            , "itemInfo": obj.data.itemInfo
                            , "status": obj.data.status
                        });
                    },
                    yes: function () {
                    }
                });
            }
        });

        //监听提交
        form.on('submit(dictionaryItemForm)', function (data) {
            //data.field json对象
            // JSON.stringify(data.field) 字符串化json
            layer.load(1);
            console.log(data.field);
            dataSave1("/project/dictionaryItem", JSON.stringify(data.field), 1);
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
                        fenYeInit3("/project/dictionaryItem", {"status": -1}, "#dictionaryItemTable");
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

    })
})