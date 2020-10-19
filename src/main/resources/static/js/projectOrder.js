$(function () {
    /* layui模块入口 */
    layui.use(['layer', 'form'], function () {
        //弹出层
        var layer = layui.layer;

        //表单模块
        var form = layui.form;

        //获取连接中的订单id和重定向链接
        var rUrl = getRequestData("rUrl");
        if (rUrl == null) {
            rUrl = "/"
        } else {
            rUrl = base64decode(rUrl)
        }
        var oid = base64decode(getRequestData("oid"));
        //初始化订单
        projectOrderSave("id=" + oid, 0);

        //监听提交 //data.field 数据json
        form.on('submit(orderForm)', function (data) {
            console.log(data.field);
            delete data.field.opayTime;
            if (data.field.otradeId === "" || data.field.otradeId === null) {
                delete data.field.otradeId;
            }
            projectOrderSave(JSON.stringify(data.field), 1);
            return false;
        });

        /* 更新数据到后台 opeType -1删除 0查询 1更新/添加 */
        function projectOrderSave(urldata, opeType) {
            console.log(urldata);
            let type;
            if (opeType === 1) {
                type = "POST"
            } else if (opeType === 0) {
                type = "GET"
            }
            $.ajax({
                url: "/project/order",
                contentType: "application/json",
                type: type,
                data: urldata,
                dataType: "json",
                success: function (res) {
                    if (res.code === "200") {
                        //查询的结果
                        if (opeType === 0) {
                            //初始化给表单赋值
                            if (res.data.Length > 0) {
                                let data = res.data.projectOrders[0];
                                form.val("orderForm", {
                                    "id": data.id
                                    , "rid": data.rid
                                    , "pid": data.pid
                                    , "oid": data.oid
                                    , "otradeId": data.otradeId
                                    , "oname": data.oname
                                    , "onum": data.onum
                                    , "omoney": data.omoney
                                    , "ocreateTime": data.ocreateTime
                                    , "opayTime": data.opayTime
                                    , "oreceipt": data.oreceipt
                                    , "oreceiveName": data.oreceiveName
                                    , "oaddress": data.oaddress
                                    , "ophone": data.ophone
                                    , "opayType": data.opayType.itemCode
                                });
                                //已付款
                                if (data.otype.itemCode === 2) {
                                    $(".projectTitle").html("项目订单-已付款");
                                    $(".orderBtn").addClass("noDisplay");
                                    $(".backBtn").removeClass("noDisplay");
                                    $(".otypeDiv").removeClass("noDisplay");
                                    $(".oidDiv").removeClass("noDisplay");
                                    $(".opayTimeDiv").removeClass("noDisplay");
                                    $(".otype").val("已支付");
                                    var i = data.opayType.itemCode === 1 ? 1 : 0;
                                    $(".opayTypeDiv input").eq(i).attr("disabled", " ");
                                    $(".oreceipt").attr("disabled", " ").addClass("rm1");
                                    $(".oreceiveName").attr("disabled", " ").addClass("rm1");
                                    $(".oaddress").attr("disabled", " ").addClass("rm1");
                                    $(".ophone").attr("disabled", " ").addClass("rm1");
                                    form.render();
                                }
                            } else {
                                layer.msg('订单异常，正在返回首页！..', {
                                    time: 800
                                }, function () {
                                    location.href = "/";
                                })
                            }
                        } else if (opeType === 1) {
                            //更新成功
                            if (res.data != null) {
                                layer.msg('付款成功..', {
                                    time: 1000
                                }, function () {
                                    projectOrderSave("id=" + res.data.oid, 0)
                                });
                            } else {
                                layer.msg(res.msg)
                            }
                        }
                    } else if (res.code === "302") {
                        $("body").html(res.data.toAliPay)
                    } else {
                        layer.msg(res.msg)
                    }
                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })

        }

        /*监听返回按钮*/
        $(".backBtn").on("click", function () {
            location.href = rUrl;
        })


        /* layui */
    })

    //获取支付方式
    addSelect2("/project/dictionaryItem", "dicId=6", ".opayTypeDiv>div", "opayType")

})
