$(function () {

    layui.use(['form', 'laypage', 'flow', 'upload', 'laydate', 'util'], function () {

        /* 图片上传 和表单参数 */
        var upload = layui.upload;
        var uploadInst = upload.render({
            elem: '#phimgdiv',
            url: '/project/info/',
            size: '1025', //k大小
            auto: false, //自动提交
            data: { //数据
                data: function () {
                    // console.log(form.val("form1"));
                    var data1 = form.val("form1");
                    data1.pisPublish = "0";
                    console.log(JSON.stringify(data1));
                    return JSON.stringify(data1); //获取表单数据
                }
            },
            bindAction: '#imgsaveBtn', //提交按钮
            choose: function (obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) { // index得到文件索引 file得到文件对象 result得到文件base64编码，比如图片
                    $('#phimg').attr('src', result); //图片链接（base64）
                });
            },
            before: function (obj) { //obj参数包含的信息
                layer.load(1); //上传loading
            },
            done: function (res) { //res（服务端响应信息）、index（当前文件的索引）、upload（重新上传的方法，一般在文件上传失败后使用）
                layer.closeAll('loading'); //关闭loading
                console.log(res);
                if (res.code === "200") {//上传成功
                    layer.msg('保存成功,跳转中..', {
                        icon: 6,
                        time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
                    }, function () {
                        window.location = "/publishProject2?pp=0&pid=" + res.data.pid;
                    });
                } else {
                    //如果上传失败
                    return layer.msg('上传失败,请重试');
                }
            },
            error: function () {
                layer.closeAll('loading'); //关闭loading
                return layer.msg('服务器错误,请重试');
            },
        });

        let sTime; //保存选择的开始时间
        let eTime; //保存选择的结束时间
        //时间控件1
        var laydate = layui.laydate;
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

        //初始化表单
        var urlData = "userInfo.id=" + $(".uid").val() + "&status=-1&pIsPublish=0";
        dataSave(urlData);

        //监听表单提交(只做表单验证)
        var form = layui.form;
        form.on('submit(form1)', function (data) {
            console.log(data)
            //验证时间差
            let timeDif = new Date(eTime).getTime() - new Date(sTime).getTime();//获得时间差
            if (timeDif / (1000 * 60 * 60 * 24) <= 6) {
                layer.msg("结束的时间应大于开始时间7天");
                return
            }
            // layer.msg(JSON.stringify(data.field));
            //验证是否上传图片了
            if ($("#phimg").attr("src") == "none" || $("#phimg").attr("src") == "") {
                console.log($("#phimg").attr("src"));
                $(".error1").show();
                $(window).scrollTop(250);
            } else {
                $(".error1").hide();
                $("#imgsaveBtn").trigger("click"); //点击图片上传按钮
            }
            return false;
        });

        /* 更新数据到后台 opeType  1更新/添加 -1删除*/
        function dataSave(urlData) {
            $.ajax({
                url: "/project/?" + urlData,
                type: "GET",
                dataType: "json",
                success: function (res) {
                    if (res != null && res.Length > 0) {
                        form.val("form1", {
                            "id": res.projects[0].id
                            , "pname": res.projects[0].pname
                            , "ptarMoney": res.projects[0].ptarMoney
                            , "pintroduce": res.projects[0].pintroduce
                            , "ptype": res.projects[0].ptype.dicId
                            , "pstartDate": res.projects[0].pstartDate
                            , "pendDate": res.projects[0].pendDate
                        });
                    }
                },
                error: function () {
                    layer.closeAll('loading'); //关闭loading
                    layer.msg("服务器错误!")
                }
            })

        }

        /*---layui---  */
    });

    /*获取项目类型*/
    addSelect("/project/dictionaryItem/", "dicId=1", ".pType");

    //响应输入框回车键按下的处理
    $("#form1").on("keydown", "input[type='text']", function () {
        if (event.keyCode === 13) {
            return false;
        }
    })


});
