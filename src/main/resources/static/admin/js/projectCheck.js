$(function () {
    layui.use(['table','layer'] ,function () {
        var table = layui.table;
        var layer = layui.layer;

        //动态生成表格，并且生成自定义的分页器
        var ppTableIns = null; //为了表格重载
        var urlData = {"pIsPublish": 1, "status": "0", "isBase64Img": "false"};
        fenYeInit("/project/", urlData, "#ppTable");

        /*发布项目监听列裡工具按鈕*/
        table.on('tool(ppTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            //项目审核通过
            if (layEvent === 'isOk') {
                layer.confirm('确定该项目审核通过吗?', function (index) {
                    obj.data.status = 1;
                    console.log(obj.data);
                    layer.load();
                    dataSave1(JSON.stringify(obj.data))
                    layer.close(index);
                });
            }
        });

        /*审核通过项目*/
        function dataSave1(urlData) {
            $.ajax({
                url: "/project/info2",
                type: "POST",
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    layer.closeAll();
                    console.log(res);
                    if (res.code === "200") {
                        layer.msg("审核项目成功");
                        var urlData = {"pIsPublish": 1, "status": "0", "isBase64Img": "false"};
                        fenYeInit("/project/", urlData, "#ppTable");
                    } else {
                        layer.msg("服务器发生未知错误，请检查！")
                    }

                },
                error: function () {
                    layer.closeAll();
                    layer.msg("服务器错误")
                }
            })
        }

    })

})