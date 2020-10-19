$(function () {
    layui.use(['table', 'layer'], function () {
        var table = layui.table;
        var layer = layui.layer;

        //动态生成表格，并且生成自定义的分页器
        //已设置的幻灯片项目
        var urlData2 = {"pIsPublish": 1, "status": "1", "isBase64Img": "false", "pIsCarousel": 1};
        fenYeInit5("/project/expand", urlData2, "#pcTable");
        //所有项目
        var urlData = {"pIsPublish": 1, "status": "1", "isBase64Img": "false", "pIsCarousel": 0};
        fenYeInit("/project/expand", urlData, "#pTable");

        /*所有项目监听列裡工具按鈕*/
        table.on('tool(pTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            //设置幻灯片
            if (layEvent === 'isCarousel') {
                layer.confirm('确定设置该项目为首页幻灯片吗?', function (index) {
                    delete obj.data.pIsCarousel;
                    obj.data.pisCarousel = 1;
                    console.log(obj.data);
                    layer.load();
                    dataSave1(JSON.stringify(obj.data))
                    layer.close(index);
                });
            }

        });

        /*已设置的幻灯片项目监听列裡工具按鈕*/
        table.on('tool(pcTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            //设置幻灯片
            if (layEvent === 'isCarousel') {
                layer.confirm('确定取消该项目为首页幻灯片吗?', function (index) {
                    delete obj.data.pIsCarousel;
                    obj.data.pisCarousel = 0;
                    console.log(obj.data);
                    layer.load();
                    dataSave1(JSON.stringify(obj.data))
                    layer.close(index);
                });
            }

        });

        /*审核通过项目*/
        function dataSave1(urlData, select) {
            $.ajax({
                url: "/project/expand/info",
                type: "POST",
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    layer.closeAll();
                    console.log(res);
                    if (res.code === "200") {
                        layer.msg(res.msg);
                        var urlData2 = {"pIsPublish": 1, "status": "1", "isBase64Img": "false", "pIsCarousel": 1};
                        fenYeInit5("/project/expand", urlData2, "#pcTable");
                        var urlData = {"pIsPublish": 1, "status": "1", "isBase64Img": "false", "pIsCarousel": 0};
                        fenYeInit("/project/expand", urlData, "#pTable");
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