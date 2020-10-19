$(function () {
    layui.use(['element', 'layer', 'form'], function () {

        /* 监听第二页选项卡 */
        /* 进度条改变 */
        var element = layui.element;

        /* 弹框 */
        var layer = layui.layer;

        var form = layui.form;

        var pid = getRequestData("pid");
        var uid = $(".uid").val();
        var pIsDream = getRequestData("pIsDream");

        var cmData = {}; //保留表单数据

        /*监听订单的表单提交*/
        form.on('submit(orderForm)', function (data) {
            //全部表单字段 data.field
            //删除多余的属性
            //刪除多余的字段
            delete data.field.oNum;
            delete data.field.id;
            //console.log(data.field);
            //layer.msg("订单创建：" + JSON.stringify(data.field))
            //去订单页面
            layer.load("1");
            //后台生成订单
            orderCreate(JSON.stringify(data.field));
            return false; //阻止原来表单跳转
        });

        /*监听评论的表单提交*/
        form.on('submit(commentForm)', function (data) {//全部表单字段 data.field
            if (uid !== null && uid !== "") {
                data.field.pid=pid;
                cmData = data.field;
                $(".pFormDiv").show();
                layer.open({
                    type: 1,
                    title: "验证码验证..",
                    anim: 3,
                    area: ['380px', '240px'],
                    content: $(".cmValicodeDiv"),
                    success: function (layero, index) {
                        $(".verify-code").trigger("click")
                    },
                    yes: function () {
                    }
                });
            } else {
                layer.open({
                    type: 1,
                    title: "您还未登录，请先登录..",
                    anim: 1,
                    area: ['300px', '130px'],
                    content: $(".goLoginBtns"),
                    success: function (layero, index) {
                    },
                    yes: function () {
                    }
                });
            }
            return false; //阻止原来表单跳转
        });
        init();

        /* 初始化 */
        function init() {
            var pid = getRequestData("pid");
            if (pid != null || pid !== "") {
                getData(pid);
            }

            /*初始化分享的二维码*/
            var qrcode = new QRCode(document.getElementById("shareQrcode"), {
                text: location.href,
                width: 120,
                height: 120,
                colorDark: "#202124",
                colorLight: "#FFFFFF",
                correctLevel: QRCode.CorrectLevel.H
            });

            /*初始化評論內容*/
            dataSave("pId=" + pid, 0)
        }

        /* 后台获取数据 */
        function getData(pid) {
            var isGoResport = true;
            //获取基本信息
            $.ajax({
                type: "GET",
                url: "/project/?" + "id=" + pid,
                dataType: "json",
                success: function (res) {
                    if (res.Length > 0) {
                        var data = res.projects[0];
                        console.log(data);
                        var per = Math.floor(data.pnowMoney / data.ptarMoney * 100) + "%";
                        var element = layui.element;
                        var pendDay = dateDiff(data.pstartDate, data.pendDate);
                        var pheadImg = data.pheadImg;

                        $(" .ppercent").html(per);
                        element.progress('ppercent2', per);
                        $(".pid").html(data.id);
                        $(".uid").html(data.userInfo.id);
                        $(".uname").html(data.userInfo.uusername);
                        $(".pname").html(data.pname);
                        $(" .ptype").html(data.ptype.itemName);
                        $(" .pstage").html(data.pstage.itemName);
                        $(" .pnowMoney").html(data.pnowMoney);
                        $(" .ptarMoney").html(data.ptarMoney);
                        $(" .pendDay").html(pendDay + "天");
                        $(" .pendDate").html(data.pendDate);
                        $(" .psupportNum").html(data.psupportNum + "人");
                        $(".pheadimgDiv img").attr("src", pheadImg);
                        $(".pintroduce>span").html(data.pintroduce);

                        //是否为梦想计划
                        if (getRequestData("pIsDream") === "1") {
                            $(" .pstage").html("梦想计划");
                            $(".Pmsg").html("梦想计划持续为你护航，请继续加油！")
                        } else {
                            //按钮控制
                            if (data.pstage.itemCode === 1) {
                                $(".psupportBtn").hide();
                                $(".pEndBtn").html("未开始！敬请等待").show();
                                isGoResport = false;
                                $(".yourSupportDiv").html("<hr>项目未开始！等待开启支持哦！期待你的参与！");
                            }
                            if (data.pstage.itemCode === 3) {
                                $(".psupportBtn").hide();
                                $(".pEndBtn").html("已结束！感谢参与").show();
                                var c = data.ptarMoney - data.pnowMoney;
                                if (c > 0) {
                                    $(".Pmsg").html("未达到目标！距目标相差" + c + "元！请继续加油~");
                                } else {
                                    $(".Pmsg").html("恭喜达成目标金额" + data.ptarMoney + "元！可喜可贺~");
                                }
                                isGoResport = false;
                                $(".yourSupportDiv").html("<hr>项目已结束！暂停支持哦！感谢你的参与！");
                            }
                        }

                    }
                }
            });

            //获取项目内容
            $.ajax({
                type: "GET",
                url: "/project/pContent?" + "id=" + pid,
                dataType: "html",
                success: function (res) {
                    var ss = res.split("#"); //为了切割获得错误码500
                    if (ss[0] !== "500") {
                        $(".pcontent").html(res)
                    }
                },
            });

            //获取项目回报
            setTimeout(function () {
                if (isGoResport) {
                    $.ajax({
                        type: "GET",
                        url: "/project/report?" + "pId=" + pid,
                        dataType: "json",
                        success: function (res) {
                            if (res.code === "200") {
                                if (res.data.Length > 0) {
                                    $(".reportsDiv").empty();
                                    for (data of res.data.reports) {
                                        var r = "<div class=\"yourSupport\">" +
                                            "         <input type=\"hidden\" name=\"rid\" value=\"" + data.id + "\" class=\"rid\">" +
                                            "         <input type=\"hidden\" name=\"pid\" value=\"" + data.pid + "\" class=\"pid\">" +
                                            "         <div class=\"mdTitle1\">" +
                                            "             <span class=\"rmoney\">" + data.rmoney + "</span>元" +
                                            "         </div>" +
                                            "         <div class=\"rtype\">" + data.rtype.itemName +
                                            "         </div>" +
                                            "         <div class=\"mdTitle2\">" +
                                            "             <span>限量</span>/" +
                                            "             每人限量<span class=\"roneAmount\">" + data.roneAmount + "</span>份" +
                                            "             总限量<span class=\"rallAmount\">" + data.rallAmount + "</span>份" +
                                            "         </div>" +
                                            "         <hr/>" +
                                            "         <div class=\"rcontent\">" + data.rcontent + "</div>" +
                                            "         <div class=\"mdTitle2\">预计回报发放时间：" +
                                            "             <span class=\"rreportDate\">" + data.rreportDate + "天后</span>" +
                                            "         </div>" +
                                            "         <button type=\"button\" class=\"layui-btn layui-btn-lg yourSupportBtn\">去支持</button>" +
                                            "</div><hr>";
                                        $(".reportsDiv").append(r)
                                    }
                                }
                            }
                        },
                    });
                }
            }, 250);

            //获取项目支持者
            var ids = []; //保存支持者的id
            $.ajax({
                type: "GET",
                url: "/project/support?" + "pId=" + pid,
                dataType: "json",
                success: function (res) {
                    if (res.code === "200" && res.data != null) {
                        $(".supports").empty();
                        if (res.data.Length > 0) {
                            var datas = res.data.projectSupports;
                            $(".supportNum").html(res.data.Length);
                            for (let data of datas) {
                                ids.push(data.uid);
                                var div1 = "<div><span class='uName'>" + data.uid + "</span><span>:支持了" + data.smoney + "元</span></div>";
                                $(".supports").append(div1)
                            }
                        } else {
                            $(".supportNum").html(0);
                        }
                    }
                },
            });

            //获得项目支持者的信息 如果有的话  -这里和上面一样 治标不治本 建议放在方法在调用更好
            setTimeout(function () {
                if (ids.length > 0) {
                    //ids = $.param(ids);
                    $.ajax({
                        type: "GET",
                        url: "/user/info/ids?" + "ids=" + ids,
                        success: function (res) {
                            if (res.code === "200" && res.data != null) {
                                console.log(res);
                                if (res.data.Length > 0) {
                                    var datas = res.data.userInfos;
                                    var $users = $(".supports .uName");
                                    //通过比较id来确定是否同一个用户
                                    for (var i = 0; i < $users.length; i++) {
                                        for (var j = 0; j < datas.length; j++) {
                                            if ($users.eq(i).html() === datas[j].id.toString()) {
                                                $users.eq(i).html(datas[j].uusername);
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    });
                }
            }, 300);

        }

        /*后台创建订单*/
        function orderCreate(urlData) {
            layer.closeAll();
            $.ajax({
                type: "POST",
                url: "/project/order",
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    if (res.code === "200") {
                        layer.msg('订单创建成功,跳转中..', {
                            time: 600
                        }, function () {
                            var rUrl = location.pathname + location.search;
                            var oid = res.data.oid;
                            console.log(rUrl);
                            location.href = "/projectOrder?" + "rUrl=" + base64encode(rUrl) + "&oid=" + base64encode(oid);
                        })
                        //oid
                    }
                },
                error: function () {
                    layer.msg("服务器异常，请稍后重试！")
                }
            });
        }

        /*后台操作评论*/
        function dataSave(urlData, opeType) {
            var type;
            if (opeType === 1) {
                type = "POST";
            } else if (opeType === 0) {
                type = "GET";
            }
            $.ajax({
                url: "/project/comment",
                type: type,
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    layer.closeAll('loading'); //关闭loading
                    if (res.code === "200") {
                        if (opeType === 1) {//更新
                            layer.msg('评论成功..', {
                                icon: 6,
                                time: 1000
                            }, function () {
                                //更新评论显示内容
                                dataSave("pId=" + pid, 0)
                            });
                        } else if (opeType === 0) { //查询
                            if (res.data.Length > 0) {
                                $(".commentNum").html(res.data.Length);
                                var datas = res.data.comments;
                                $('.comments').empty();
                                for (var data of datas) {
                                    var div1 = "<div class=\"comment\">" +
                                        "         <div>" +
                                        "           <input type=\"hidden\" class=\"cmId\" value='" + data.id + "'>" +
                                        "           <input type=\"hidden\" class=\"cmUid\" value='" + data.uid + "'>" +
                                        "           <span class=\"cmname\">" + data.cmName + "</span>" +
                                        "           <span class=\"cmcreateDate\">" + data.cmCreateDate + "</span>" +
                                        "          </div>" +
                                        "          <div class=\"cmcontent\">" + data.cmContent + "</div>" +
                                        "       </div>";
                                    $(".comments").append(div1);
                                }
                            }
                        }
                    } else {
                        //如果失败
                        return layer.msg(res.msg);
                    }

                },
                error: function () {
                    layer.closeAll('loading'); //关闭loading
                    layer.msg("服务器错误!")
                }
            })

        }

        $('#cmValicode').codeVerify({
            type: 2,
            figure: 100,	//位数，仅在type=2时生效
            arith: 0,	//算法，支持加减乘，不填为随机，仅在type=2时生效
            width: '200px',
            height: '50px',
            fontSize: '30px',
            btnId: 'checkBtn1',
            ready: function () {
            },
            success: function () {
                layer.load(1);
                if (cmData != null) {
                    layer.closeAll();
                    dataSave(JSON.stringify(cmData), 1);
                }
            },
            error: function () {
                $(".verify-code").trigger("click");
                layer.msg('验证码不匹配！');
            }
        });

        /*时间查计算*/
        function dateDiff(nTime, sTime) {
            let iDays = Math.floor((new Date(sTime).getTime() - new Date(nTime).getTime()) / (1000 * 60 * 60 * 24)); //天数
            let iHours = (new Date(sTime).getTime() - new Date(nTime).getTime()) / (1000 * 60 * 60); //小时数
            let iMinutes = (new Date(sTime).getTime() - new Date(nTime).getTime()) / (1000 * 60); //分钟数
            return iDays
        }

        /* 风险提示点击更多按钮 */
        $(".tip1More").on("click", function () {
            var height1 = "250px";
            if ($(".tip1More").children("i").eq(0).css("display") == "none") {
                height1 = "250px";
            } else {
                height1 = "535px";
            }
            $(".tip1").css("height", height1)
            $(".tip1More").children("i").eq(0).toggle();
            $(".tip1More").children("i").eq(1).toggle();
        });

        /* 点击立即支持的大按钮 */
        $(".psupportBtn").on("click", function () {
            //开启弹框
            layer.open({
                type: 1,
                title: "支持金额",
                anim: 2,
                area: ['700px', '500px'],
                content: $(".yourSupportDiv"),
                success: function (layero, index) {
                },
                yes: function () {
                }
            });
        });

        var roneAmount = 0;
        var rallAmount = 0;
        var oNum = 1; //订单的份数
        var oMoney = ""; //保存金额
        var yoMoney = 0; //保存单价

        /* 点击支持的按钮 */
        $(document).on("click", ".yourSupportBtn", function () {
            var uid = $(".uid").val();
            var pid = getRequestData("pid");
            var pIsDream = getRequestData("pIsDream");
            var $this = $(this);
            var oName = $(document).find(".pname").html();

            oName += "-" + $this.parent().find(".rcontent").html();
            roneAmount = $this.parent().find(".roneAmount").html();
            rallAmount = $this.parent().find(".rallAmount").html();
            var rid = $this.parent().find(".rid").val();
            oNum = 1;

            //判断是否无偿支持
            if ($this.hasClass("noMoney")) {
                $(".orderForm").children("div").eq(2).hide();
                $(".orderForm .oMoney").removeAttr("readonly");
                $(".orderForm .oMoney").removeClass("rm1");
                oMoney = 1;
                rid = -1;
            } else {
                $(".orderForm").children("div").show();
                $(".orderForm .oMoney").attr("readonly", "readonly");
                $(".orderForm .oMoney").addClass("rm1");
                oMoney = $this.parent().find(".rmoney").html();
                yoMoney = oMoney;
                parseInt(rid)
            }

            if (uid !== null && uid !== "") {
                //支持
                //layer.msg("恭喜你支持成功!");
                //开启弹框
                layer.open({
                    type: 1,
                    title: "确认支持",
                    anim: 2,
                    area: ['600px'],
                    content: $(".orderFormDiv"),
                    success: function (layero, index) {
                        form.val("orderForm", {
                            "oname": oName
                            , "omoney": oMoney
                            , "onum": oNum
                            , "pid": pid
                            , "uid": uid
                            , "rid": rid
                        });
                        form.render();
                    },
                    yes: function () {
                    }
                });

            } else {
                //传递登录后返回此页面
                var rUrl = "/projectDetail?pid=" + pid;
                if (pIsDream != null && pIsDream !== "") {
                    rUrl += "&pIsDream=" + pIsDream
                }
                location.href = "/toLogin?rUrl=" + base64encode(rUrl);
            }
        });

        /* 订单表单添加份数监听 */
        $(document).on("click", ".addoNum", function () {
            oNum += 1;
            var isG = true;
            if (oNum > parseInt(roneAmount)) {
                oNum = parseInt(roneAmount);
                layer.msg("已超过最大单笔限额！")
                isG = false;
            }
            if (oNum > parseInt(rallAmount)) {
                oNum = parseInt(rallAmount);
                layer.msg("已超过最大总数量！")
                isG = false;
            }
            if (isG) {
                oMoney *= oNum;
                console.log("-" + oMoney)
                form.val("orderForm", {
                    "onum": oNum,
                    "omoney": oMoney
                });
            }
        });

        /* 订单表单中分数输入框按确定后监听 */
        $(".oNum").on("keydown", function (e) {
            if (e.keyCode === 13) {
                // oMoney = parseInt($(".oMoney").val().replace("元", ""));
                var n = parseInt($(".oNum").val());
                if (n > 0 && n <= roneAmount && n <= rallAmount) {
                    oNum = n;
                    oMoney *= oNum;
                } else {
                    layer.msg("支持数量不能低于1且不能超过限额！");
                    oMoney = yoMoney;
                    oNum = 0;
                }
                form.val("orderForm", {
                    "omoney": oMoney
                });
                return false;
            }
        });

        /* 订单表单中分数输入框按确定后监听 */
        $(".oNum").on("focusout", function (e) {
            // oMoney = parseInt($(".oMoney").val().replace("元", ""));
            var n = parseInt($(".oNum").val());
            if (n > 0 && n <= roneAmount && n <= rallAmount) {
                oNum = n;
                oMoney *= oNum;
            } else {
                layer.msg("支持数量不能低于1且不能超过限额！");
                oMoney = yoMoney;
                oNum = 0;
            }
            form.val("orderForm", {
                "omoney": oMoney
            });
            return false;
        });

        /* 点击收藏按钮 */
        $(document).on("click", ".collectBtn", function () {
            layer.msg("收藏成功!");
        });

        /*监听 分享按钮*/
        $(".share a").hover(function () {
            $(".shareQrcode").show();
        }, function () {
            $(".shareQrcode").hide();
        });

        /*监听评论字数多少*/
        $(".cmcontent").on("keydown", function () {
            var fnum = $(".cmcontent").val().length;
            if (fnum != null && fnum !== "") {
                $(".fontNum").html(250 - parseInt(fnum));
            }
        })

        /*监听弹框登录按钮*/
        $(".goLoginBtns").on("click", "button", function () {
            //传递登录后返回此页面
            var rUrl = "/projectDetail?pid=" + pid;
            if (pIsDream != null && pIsDream !== "") {
                rUrl += "&pIsDream=" + pIsDream
            }
            if ($(this).index(0)) {
                location.href = "/toLogin?rUrl=" + base64encode(rUrl);
            } else {
                location.href = "/toRegist"
            }


        })

        /*---layui---  */
    });
})
