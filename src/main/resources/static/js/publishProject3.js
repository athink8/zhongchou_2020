$(function () {

    //获取回报的长度
    var rsize = 0;
    //获取连接中的项目id
    var pid = getRequestData("pid");
    //这里是为了防止每项目id情况下查询到
    if (pid == null) {
        pid = -1;
    }
    /* layui模块入口 */
    layui.use(['layer', 'form', 'table'], function () {
        /* 弹出层 */
        var layer = layui.layer;
        /* 表单模块 */
        var form = layui.form;

        //监听提交
        form.on('submit(reportForm)', function (data) {
            layer.closeAll();
            //data.field json对象
            // JSON.stringify(data.field) 字符串化json
            // console.log($.param(data.field)); //获取格式化的参数

            //执行后台方法
            // reportSave($.param(data.field), 1);
            reportSave(JSON.stringify(data.field), 1);

            //重置表单
            form.val("reportForm", {
                "rtype": "",
                "rtype": "",
                "rmoney": "",
                "rcontent": "",
                "rallAmount": "",
                "roneAmount": "",
                "rreportDate": "",
            });
            return false;
        });

        var table = layui.table;
        //回报表格初始化
        var tableIns = table.render({
            elem: '#reportTable'
            , url: '/project/report'
            , method: "get"
            , where: {"pId": pid} //参数
            , page: false //开启分页
            , cols: [[ //表头
                {field: 'id', title: 'id', width: 80, hide: true}
                , {field: 'rid', title: '序号', width: 80, sort: true, fixed: 'left'}
                , {field: 'rtype', title: '回报类型', width: 120, sort: true, templet: '<div>{{d.rtype.itemName}}</div>'}
                , {field: 'rmoney', title: '支付金额(元)', width: 130, sort: true}
                , {field: 'rcontent', title: '回报内容', width: 150}
                , {field: 'rreportDate', title: '回报时间(天后)', width: 200}
                , {field: 'rallAmount', title: '回报名额', width: 100}
                , {field: 'roneAmount', title: '单笔数量', width: 100}
                , {fixed: 'right', width: 120, align: 'center', toolbar: '#rowBar'}
            ]],
            parseData: function (res) { //res 即为原始返回的数据
                if (res.data.reports.length > 0) {
                    rsize = res.data.reports[res.data.Length - 1].rid;
                }
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "count": res.data.Length, //解析数据长度
                    "data": res.data.reports //解析数据列表
                };
            }
            , response: {
                statusCode: 200 //成功标识
            }
            , toolbar: '#toolBar'
            , defaultToolbar: []
            , initSort: {
                field: 'rid' //排序字段，对应 cols 设定的各字段名
                , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
            }
        });

        //监听列裡工具按鈕
        table.on('tool(reportTable)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

            if (layEvent === 'del') { //删除
                layer.confirm('真的删除行么', function (index) {
                    layer.close(index);
                    reportSave(JSON.stringify(data), -1)
                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                });
            } else if (layEvent === 'edit') { //编辑
                openForm(data);
                // layer.msg(JSON.stringify(data));
                //同步更新缓存对应的值
                /*obj.update({
                    username: '123'
                    , title: 'xxx'
                });*/

            }
        });

        //监听表头按钮事件
        table.on('toolbar(reportTable)', function (obj) {
            if (obj.event === 'add') { //添加回报
                openForm(null);
                // layer.msg("添加");
            }
        });

        /* 更新数据到后台 opeType  1更新/添加 -1删除*/
        function reportSave(reportData, opeType) {
            console.log(reportData);
            let type;
            if (opeType === 1) {
                type = "POST"
            } else if (opeType === -1) {
                type = "DELETE"
            }
            $.ajax({
                url: "/project/report",
                type: type,
                data: reportData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (data) {
                    tableIns.reload()
                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })

        }

        /*---layui---  */
    });

    /*---------------------------*/
    /* 点击保存按钮 */
    $("#saveBtn").on("click", function () {
        let pp = getRequestData("pp") + ",2";
        let pid = getRequestData("pid");
        //页面跳转
        if (rsize >= 1) {
            console.log(rsize)
            layer.msg('保存成功,跳转中..', {
                icon: 6,
                time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
            }, function () {
                window.location.href = "/publishProject4" + "?pp=" + pp + "&pid=" + pid;
            })
        } else {
            layer.msg('请先设置回报!', {
                icon: 5
            })
        }
    })


    /*获取回报类型*/
    addSelect("/project/dictionaryItem/", "dicId=4", ".rtype");

    /*弹出回报表单弹框  rdata为表单数据*/
    function openForm(rdata) {
        var form = layui.form;
        //重置表单
        form.val("reportForm", {
            "rtype": "",
            "pid": pid,
            "rid": rsize + 1
        });

        //给表单赋值
        if (rdata != null) {
            form.val("reportForm", { // lay-filter="" 对应的值  "name": "value"
                "id": rdata.id,
                "rid": rdata.rid,
                "pid": rdata.pid,
                "rtype": rdata.rtype.itemCode,
                "rmoney": rdata.rmoney,
                "rcontent": rdata.rcontent,
                "rallAmount": rdata.rallAmount,
                "roneAmount": rdata.roneAmount,
                "rreportDate": rdata.rreportDate,
            });
        }
        //开启弹框
        layer.open({
            type: 1,
            title: "回报编辑",
            anim: 2,
            area: ['700px', '500px'],
            content: $("#reportForm"),
            success: function (layero, index) {
            },
            yes: function () {
            }
        });
    }
})
