$(function () {

    // 回报数据
    var reportDatas = {
        "data": []
    };

    var isUpdate = 0; //是否更新量  1更新 0添加 -1删除

    /* layui模块入口 */
    layui.use(['layer', 'form'], function () {
        /* 弹出层 */
        var layer = layui.layer;
        /* 表单模块 */
        var form = layui.form;
        /* 自定义表单验证 */
        form.verify({
            reportDate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (/^[0]+$/.test(value)) {
                    return '时间不能设置为 0';
                }
            }
        });

        //监听提交
        form.on('submit(reportForm)', function (data) {
            layer.closeAll();
            //data.field json对象
            // JSON.stringify(data.field) 字符串化json
            // console.log(JSON.stringify(data.field))

            var reportId = parseInt(data.field.reportId)
            var reportType = data.field.reportType == 0 ? "虚拟物品" : "实体物品";
            var money = data.field.money;
            var reportContent = data.field.reportContent;
            var allAmount = data.field.allAmount == 0 ? "无限制" : data.field.allAmount;
            var oneAmount = data.field.oneAmount == 0 ? "无限制" : data.field.oneAmount;
            var reportDate = data.field.reportDate;
            //回报数据添加进组里
            reportDatas["data"][reportId] = data.field;
            console.log(JSON.stringify(reportDatas["data"]))
            //执行后台方法
            reportSave(data.field);

            if (isUpdate == 0) { //添加
                //页面隐藏保存汇报内容
                $(".reportContentInfo").append("<input type=\"hidden\" name=\"reportContent_" + reportId + "\" value=\"" +
                    reportContent +
                    "\" id=\"reportContent_" + reportId + "\"/>");

                reportId = reportId + 1; //原来表格内数据长度+1 序号
                $(".reportId").val(reportId);
                //添加一行回报到页面表格
                $(".reportTable").append(
                    "<tr><td>" + reportId + "</td><td>" + reportType + "</td><td>" + money + "</td><td>" + reportContent.slice(
                    0, 8) + ".." +
                    "</td><td>项目结束 " + reportDate + " 天后</td><td>" + allAmount + "</td><td>" + oneAmount + "</td></td>" +
                    "<td><div class=\"layui-btn-group\">" +
                    "<button type=\"button\" class=\"layui-btn layui-btn-primary layui-btn-xs editReport\">" +
                    "<i class=\"layui-icon layui-icon-edit\"></i>" +
                    "</button>" +
                    "<button type=\"button\" class=\"layui-btn layui-btn-primary layui-btn-xs delReport\">" +
                    "<i class=\"layui-icon layui-icon-close\"></i>" +
                    "</button>" +
                    "</div></td>"
                )
            } else if (isUpdate == 1) { //更新
                // console.log($(".reportTable tbody tr").eq(reportId + 1));
                //更新表格
                var tds = $(".reportTable tbody tr").eq(reportId).children("td");
                var reportarr = [reportId + 1, reportType, money, reportContent.slice(0, 8) + "..",
                    "项目结束 " + reportDate + " 天后", allAmount, oneAmount
                ];
                for (var i = 0; i < tds.length; i++) {
                    tds.eq(i).html(reportarr[i]);
                }
                $("#reportContent_" + reportId).val(reportContent);
                $(".reportId").val(reportId + 1);

            }

            //重置表单
            $("#reportForm .needUpdate").val("");
            form.val("reportForm", {
                "reportType": "",
            });
            return false;
        });

        /*---layui---  */
    })

    /* 点击添加回报按钮 */
    $(".addReportBtn").on("click", function () {
        isUpdate = 0;
        openForm(null);
    })

    /* 监听表格内编辑和删除按钮 */
    $(".reportTable").on("click", "button", function () {
        // console.log(this)

        var tid = parseInt($(this).parent().parent().siblings().eq(0).html()); //获取表格第一个数据id
        var reportId = tid - 1; //因为json数据从0开始
        if ($(this).hasClass("editReport")) {
            //编辑按钮
            isUpdate = 1;
            openForm(reportDatas.data[reportId]);
            // console.log(tid)
            // console.log(reportDatas.data[reportId])
        } else if ($(this).hasClass("delReport")) {
            //删除按钮
            isUpdate = -1;
            deleteDate(reportId);
        }
    });

    /* 点击保存按钮 */
    $("#saveBtn").on("click", function () {
        //页面跳转
        if ($(".reportTable tbody tr").length != 0) {
            layer.msg('保存成功', {
                icon: 6,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                window.location.href = "publishProject4.html";
            })
        } else {
            layer.msg('请先输入回报!', {
                icon: 5
            })
        }
    })

    /* 更新数据到后台 */
    function reportSave(reportData) {
        // console.log("2:" + reportData)
        if (isUpdate == 0) {
            $.ajax({
                type: "POST",
                url: "/report/" + reportData.reportId,
                contentType: "application/json",
                data: JSON.stringify(reportData),
                //返回数据格式为json
                dataType: "json",
                //请求成功完成后要执行的方法
                success: function (data) {

                },
            })
        } else if (isUpdate == 1) {
            $.ajax({
                type: "PUT",
                url: "/report/" + reportData.reportId,
                contentType: "application/json",
                data: JSON.stringify(reportData),
                //返回数据格式为json
                dataType: "json",
                //请求成功完成后要执行的方法
                success: function (data) {

                },
            })
        } else if (isUpdate == -1) {
            //删除数据到后台
            $.ajax({
                type: "DELETE",
                url: "/report/" + reportData,
                //返回数据格式为json
                dataType: "json",
                //请求成功完成后要执行的方法
                success: function (data) {
                },
            })
        }
    }

    /* 执行删除一行数据操作 */
    function deleteDate(reportId) {
        //后台操作
        reportSave(reportId);

        //删除表格那行
        var trs = $(".reportTable tbody tr");
        for (var i = 0; i < trs.length; i++) {
            console.log(trs.eq(i).children().eq(0).html() + "-" + reportId)
            if (trs.eq(i).children().eq(0).html() == reportId + 1) {
                trs.eq(i).remove();
            }
        }
        //最后一条重置
        if ($(".reportTable tbody tr").length == 0) {
            $(".reportId").val(0);
        }

        //删除json组里这数据
        reportDatas["data"][reportId] = null;
        console.log(JSON.stringify(reportDatas["data"]))

    }

    /*弹出回报表单弹框  rdata为表单数据*/
    function openForm(rdata) {
        var form = layui.form;
        //重置表单
        $("#reportForm .needUpdate").val("");
        form.val("reportForm", {
            "reportType": "",
        });
        //给表单赋值
        if (rdata != null) {
            form.val("reportForm", { // lay-filter="" 对应的值  "name": "value"
                "reportId": rdata.reportId,
                "reportType": rdata.reportType,
                "money": rdata.money,
                "reportContent": rdata.reportContent,
                "allAmount": rdata.allAmount,
                "oneAmount": rdata.oneAmount,
                "reportDate": rdata.reportDate
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
