$(function () {
    layui.use(['table', 'layer', 'laydate', 'form'], function () {
        var table = layui.table;
        var layer = layui.layer;
        var laydate = layui.laydate;
        var form = layui.form;

        let sTime; //保存选择的开始时间
        let eTime; //保存选择的结束时间
        laydate.render({
            elem: '#pstartdate',
            min: +3,
            max: '2022-12-31',
            btns: ['clear', 'confirm'],
            format: 'yyyy-MM-dd',
            done: function (value) {
                sTime = value;
                // console.log(value); //得到日期生成的值，如：2017-08-18
            }
        });
        //时间控件2
        var laydate = layui.laydate;
        laydate.render({
            elem: '#penddate', //指定元素
            min: +11,
            max: '2022-12-31',
            btns: ['clear', 'confirm'],
            format: 'yyyy-MM-dd',
            done: function (value, date, endDate) {
                eTime = value;
            }
        });

        //动态生成表格，并且生成自定义的分页器
        var ppTableIns = null; //为了表格重载
        var urlData = {"pIsPublish": 1, "status": "-1", "isBase64Img": "false"};
        fenYeInit("/project/", urlData, "#paTable");

        form.on('submit(pForm)', function (data) {
            layer.load(1);
            dataSave1("/project/info2", JSON.stringify(data.field), 1);
            return false;
        });

        /*发布项目监听列裡工具按鈕*/
        table.on('tool(paTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象
            var layer = layui.layer;
            //项目审核通过
            if (layEvent === 'delete') {
                layer.confirm('请确定要删除此项目吗', function (index) {
                    console.log(obj.data);
                    dataSave1("/project/info", JSON.stringify(obj.data), -1)
                    layer.close(index);
                });
            } else if (layEvent === 'update') {
                console.log(obj.data);
                // layer.msg(JSON.stringify(obj.data));
                layer.open({
                    type: 1,
                    title: "..",
                    anim: 2,
                    area: ['750px', '600px'],
                    content: $(".pFormDiv"),
                    success: function (layero, index) {
                        form.val("pForm", {
                            "id": obj.data.id
                            , "pname": obj.data.pname
                            , "pnowMoney": obj.data.pnowMoney
                            , "ptarMoney": obj.data.ptarMoney
                            , "pintroduce": obj.data.pintroduce
                            , "ptype": obj.data.ptype.dicId
                            , "pstartDate": obj.data.pstartDate
                            , "pendDate": obj.data.pendDate
                        });
                    },
                    yes: function () {
                    }
                });

                // dataSave1(JSON.stringify(obj.data),1)
            }
        });

        /*项目后台操作*/
        function dataSave1(url, urlData, type) {
            if (type === 1) {
                type = "POST"
            } else if (type === -1) {
                type = "Delete"
            }
            $.ajax({
                url: url,
                type: type,
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    layer.closeAll();
                    console.log(res);
                    if (res.code === "200") {
                        layer.closeAll();
                        layer.msg(res.msg);
                        //重新渲染表格
                        var urlData = {"pIsPublish": 1, "status": "-1", "isBase64Img": "false"};
                        fenYeInit("/project/", urlData, "#paTable");
                    } else {
                        layer.msg("服务器发生未知错误，请检查..")
                    }
                },
                error: function () {
                    layer.closeAll();
                    layer.msg("服务器错误")
                }
            })
        }

    });

    /*获取项目类型*/
    addSelect("/project/dictionaryItem/", "dicId=1", ".pType");

})