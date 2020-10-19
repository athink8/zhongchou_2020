$(function () {

    /* layui模块入口 */
    layui.use(['layer', 'form'], function () {
        /* 弹出层 */
        var layer = layui.layer;
        /* 表单模块 */
        var form = layui.form;

        var isvaliCode = false;
        var isSamePsd = false;

        //监听提交
        form.on('submit(registForm)', function (data) {
            //data.field json对象
            // JSON.stringify(data.field) 字符串化json

            var isSameUser = $('.existName').val() === "0"; //是否重复用户标识符
            console.log("isSameUse=" + isSameUser);

            //校验验证码
            if (!isvaliCode) {
                layer.msg("请先滑动验证码验证哦~")
                return false;
            }

            //检查重复密码相同
            if (data.field.upassword !== data.field.upassword2) {
                layer.msg("两次输入的密码不一致哦~");
                isSamePsd = false;
                return false;
            } else {
                isSamePsd = true;
            }

            //检查是否重复用户名
            if (!isSameUser) {
                layer.msg("当前用户已存在，请重新输入!", {time: 1000});
                $('.uusername').focus();
            }

            if (isSamePsd && isvaliCode && isSameUser) {
                // console.log($.param(data.field)); //获取格式化的参数
                //执行后台方法
                //  dataSave($.param(data.field), 1);
                dataSave(JSON.stringify(data.field));
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
                layer.msg("验证成功，请点击注册吧!");
                isvaliCode = true;
            },
            error: function () {
                layer.msg("验证失败，请重试！")
            }

        });

        /*监听用户名填写完毕后台检查*/
        $('.uusername').on("focusout", function () {
            var urlData = "uUsername=" + $('.uusername').val();
            dataSave2(urlData);
        });

        /* 注册更新数据到后台  */
        function dataSave(urlData) {
            console.log(urlData);
            layer.load(1);
            $.ajax({
                url: "/user/regist?",
                type: "POST",
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    layer.closeAll('loading'); //关闭loading
                    if (res.code === "200") {//上传成功
                        layer.msg('注册成功,前往登录中..', {
                            icon: 6,
                            time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
                        }, function () {
                            window.location.href = "/toLogin";
                        });
                    } else {
                        //如果注册失败
                        layer.msg(res.msg);
                    }
                },
                error: function () {
                    layer.closeAll('loading'); //关闭loading
                    layer.msg("服务器错误!")
                }
            })

        }

        /* 后台查询数据  */
        function dataSave2(urlData) {
            console.log(urlData);
            $.ajax({
                url: "/user/info?" + urlData,
                type: "GET",
                dataType: "json",
                success: function (res) {
                    if (res.code === "200") { //查询成功
                        if (res.data.Length <= 0) { //未查询到重复的用户
                            $('.existName').val("0");
                        } else {
                            layer.msg("当前用户已存在，请重新输入!", {time: 1000});
                            $('.uusername').focus();
                        }
                    }
                },
                error: function () {
                    layer.msg("服务器错误!")
                }
            })

        }

        /*---layui---  */
    });

})