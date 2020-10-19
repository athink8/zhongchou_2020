$(function () {

    /* layui模块入口 */
    layui.use(['layer', 'form'], function () {
        /* 弹出层 */
        var layer = layui.layer;
        /* 表单模块 */
        var form = layui.form;

        var isvaliCode = false;

        var selUrl = ""; //选择要跳转的连接

        //监听提交
        form.on('submit(loginForm)', function (data) {
            if (isvaliCode) {
                //data.field json对象
                // JSON.stringify(data.field) 字符串化json
                console.log($.param(data.field)); //获取格式化的参数
                if (data.field.selUrl === "on") {
                    selUrl = "/admin"
                }
                //执行后台方法
                dataSave($.param(data.field));
            } else {
                layer.msg("请先滑动验证码验证哦~")
                return false;
            }

            return false;
        });

        /*验证码*/
        $('#valiCode').slideVerify({
            type: 1,		//类型
            vOffset: 2,	//误差量，根据需求自行调整
            barSize: {
                width: '90%',
                height: '40px',
            },
            ready: function () {
            },
            success: function () {
                layer.msg("验证成功，请点击登录吧!");
                isvaliCode = true;
            },
            error: function () {
                layer.msg("验证失败，请重试！")
            }

        });

        /* 更新数据到后台 opeType  1更新/添加 -1删除*/
        function dataSave(urlData, opeType) {
            console.log(urlData);
            layer.load(1);
            $.ajax({
                url: "/user/login?" + urlData,
                type: "GET",
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    layer.closeAll('loading'); //关闭loading
                    if (res.code === "200") {//上传成功
                        layer.msg('登录成功,跳转中..', {
                            icon: 6,
                            time: 1000 //1.5秒关闭（如果不配置，默认是3秒）
                        }, function () {
                            //获取拦截的连接
                            let rUrl = res.data.rUrl;
                            console.log(rUrl);

                            //优先跳转选择的后台页面
                            if (selUrl != null) {
                                rUrl = selUrl;
                            }
                            //获取连接中参数的要跳转的链接
                            if (rUrl == null) {
                                rUrl = getRequestData("rUrl");
                                if (rUrl !== null && rUrl !== "") {
                                    rUrl = base64decode(rUrl);
                                }
                            }
                            if (rUrl != null && rUrl !== "") {
                                window.location = rUrl;
                            } else {
                                window.location = "/";
                                //alert("当前用户已经邮箱检验过或无需校验，请勿重复操作！");
                                //window.location = "/";
                            }
                        });
                    } else {
                        //如果上传失败
                        return layer.msg(res.msg);
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
})