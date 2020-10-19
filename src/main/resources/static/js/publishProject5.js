$(function () {
    /* layui模块入口 */
    layui.use(['layer', 'form', 'upload'], function () {
        /* 弹出层 */
        var layer = layui.layer;
        /* 表单模块 */
        var form = layui.form;

        var uid = $(".uid").val(); //用户id
        var pid = getRequestData("pid"); //项目id

        var isUploadImg1 = false; //图片上传成功1
        var isUploadImg2 = false; //图片上传成功2
        //初始化个人身份证信息
        //初始化查询
        dataSave("uId=" + uid, 0);

        //监听提交 //data.field
        form.on('submit(IDcardForm)', function (data) {
            if ($("#IDcardImg1").children("img").length <= 0 || $("#IDcardImg2").children("img").length <= 0) {
                $(".error1").show();
                $(window).scrollTop(680);
            } else {
                if (isUploadImg1 && isUploadImg2) {
                    data.field.uid = uid;
                    alert(JSON.stringify(data.field))
                    dataSave(JSON.stringify(data.field), 1);
                } else {
                    layer.msg("请检查身份证图片是否上传成功！~")
                }
            }
            return false;
        });

        /* 图片上传1 */
        var upload1 = layui.upload;
        var uploadInst1 = upload1.render({
            elem: '#IDcardImgDiv1',
            url: '/user/idCard/img',
            size: '2048', //k大小
            auto: true, //自动提交
            multiple: false,
            data: { //数据
                imgType: function () {
                    return "uicImg1";
                },
                uid: function () {
                    return uid;
                }
            },
            choose: function (obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) { // index得到文件索引 file得到文件对象 result得到文件base64编码，比如图片
                    $('#IDcardImg1 img').remove();
                    $('#IDcardImg1').prepend('<img src="' + result + '" alt="' + file.name +
                        '" class="layui-upload-img uimg">')
                });
            },
            before: function (obj) { //obj参数包含的信息
                layer.load(); //上传loading
            },
            done: function (res, index, upload) { //res（服务端响应信息）、index（当前文件的索引）、upload（重新上传的方法，一般在文件上传失败后使用）
                layer.closeAll('loading');
                if (res.code === "200") {
                    $("#IDcardImgDiv1 .layui-upload-file").remove();
                    var errtext1 = $('#errtext1');
                    errtext1.html('<span style="color: green;">上传成功</span>');
                    $(".uicId").val(res.data.uicId);
                    isUploadImg1 = true;
                } else {
                    return layer.msg('上传失败');
                }
            },
            error: function () {
                layer.closeAll('loading');
                //演示失败状态，并实现重传
                var errtext1 = $('#errtext1');
                errtext1.html(
                    '<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                errtext1.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
            },
        });
        /* 图片上传2 */
        var upload2 = layui.upload;
        var uploadInst2 = upload2.render({
            elem: '#IDcardImgDiv2',
            url: '/user/idCard/img',
            size: '2048', //k大小
            auto: true, //自动提交
            multiple: false,
            data: { //数据
                imgType: function () {
                    return "uicImg2";
                },
                uid: function () {
                    return uid;
                }
            },
            choose: function (obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) { // index得到文件索引 file得到文件对象 result得到文件base64编码，比如图片
                    $('#IDcardImg2 img').remove();
                    $('#IDcardImg2').prepend('<img src="' + result + '" alt="' + file.name +
                        '" class="layui-upload-img uimg">')
                });
            },
            before: function (obj) { //obj参数包含的信息
                layer.load();
            },
            done: function (res, index, upload) { //res（服务端响应信息）、index（当前文件的索引）、upload（重新上传的方法，一般在文件上传失败后使用）
                layer.closeAll('loading');
                if (res.code === "200") {
                    $("#IDcardImgDiv2 .layui-upload-file").remove();
                    var errtext2 = $('#errtext2');
                    errtext2.html('<span style="color: green;">上传成功</span>');
                    $(".uicId").val(res.data.uicId);
                    isUploadImg2 = true;
                } else {
                    return layer.msg('上传失败');
                }

            },
            error: function () {
                layer.closeAll('loading');
                //演示失败状态，并实现重传
                var errtext2 = $('#errtext2');
                errtext2.html(
                    '<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                errtext2.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
            },
        });

        /*项目按钮监听*/
        $(".saveBtn2").on("click", function () {
            if (pid != null && pid !== "" && uid != null && uid !== "") {
                var urlData = {
                    "id": parseInt(pid)
                };
                pPublish(JSON.stringify(urlData));
            }
        })


        /* 更新数据到后台 */
        function dataSave(Data, opeType) {
            let type;
            if (opeType === 1) {
                type = "POST"
            } else if (opeType === 0) {
                type = "GET"
            }
            $.ajax({
                type: type,
                url: "/user/idCard",
                contentType: "application/json",
                data: Data,
                dataType: "json",
                success: function (res) {
                    if (res.code === "200") {
                        console.log(res)
                        if (opeType === 1) {
                            $(".saveBtn2").trigger("click");
                        } else if (opeType === 0) {
                            if (res.data.Length > 0) {
                                if (res.data.userIdCards[0].status === "1" && res.data.userIdCards[0].uicName != null) {
                                    $(".idCardTrue").html("您已进行身份认证！请点击保存进行项目的发布..！");
                                    $(".idCardTrueVal").val(1);
                                    $(".saveBtn2").show();
                                } else if (res.data.userIdCards[0].status === "0" && res.data.userIdCards[0].uicName != null) {
                                    $(".idCardTrue").html("当前用户身份认证等待审核中..请耐心等待认证成功在发布项目！");
                                    $(".idCardTrueVal").val(0);
                                    $(".saveBtn3").show();
                                } else {
                                    $(".idCardTrueDiv").hide();
                                    $(".IDcardFormDiv").show();
                                }
                            } else {
                                $(".idCardTrueDiv").hide();
                                $(".IDcardFormDiv").show();
                            }
                        }
                    }
                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })
        }

        /* 发布项目 */
        function pPublish(Data) {
            $.ajax({
                type: "POST",
                url: "/project/publish",
                contentType: "application/json",
                data: Data,
                dataType: "json",
                success: function (res) {
                    if (res.code === "200") {
                        layer.alert('项目发布成功，感谢您的参与！请耐心等待审核..', {
                            icon: 6,
                        }, function () {
                            window.location.href = "/";
                        })
                    }
                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })
        }

        /* layui */
    });


})
