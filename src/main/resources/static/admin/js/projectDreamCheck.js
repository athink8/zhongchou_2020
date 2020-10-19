$(function () {
    layui.use('table', function () {
        var table = layui.table;

        //动态生成表格，并且生成自定义的分页器
        var ppTableIns = null; //为了表格重载
        var urlData = {"pIsDream": 0, "status": 1, "isBase64Img": "false","applyDream":1};
        fenYeInit("/project/expand", urlData, "#pdTable");

        /*发布项目监听列裡工具按鈕*/
        table.on('tool(pdTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            //项目审核通过
            if (layEvent === 'isOk') {
                layer.confirm('确定该项目审核通过吗?', function (index) {
                    delete  obj.data.pIsDream; // 因为获取和更新时参数大小写不一样
                    obj.data.pisDream = 1;
                    obj.data.applyDream = 0;
                    console.log(obj.data);
                    dataSave1(JSON.stringify(obj.data))
                    layer.close(index);
                });
            }
        });

        /*审核通过项目*/
        function dataSave1(urlData) {
            $.ajax({
                url: "/project/expand/info",
                type: "POST",
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    if (res.code === "200") {
                        layer.msg("审核梦想项目成功");
                        var urlData = {"pIsDream": 0, "status": 1, "isBase64Img": "false","applyDream":1};
                        fenYeInit("/project/expand", urlData, "#pdTable");
                    } else {
                        layer.msg("服务器发生未知错误，请检查！")
                    }

                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })
        }

    })

})