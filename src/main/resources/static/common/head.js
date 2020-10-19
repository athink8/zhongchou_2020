$(function () {
    layui.use(['element', 'carousel', 'flow', 'util', 'layer', 'form'], function () {

        /* 导航栏 */
        let element = layui.element;

        //开启了懒加载（也可以指定相关img）参数：elem - img选择器 scrollElem - 滚动条所在元素选择器
        setTimeout(function () {
            /* 懒加载 */
            let flow1 = layui.flow;
            flow1.lazyimg();
        }, 200);

        //显示右下角的固定的图标
        let util = layui.util;
        util.fixbar({
            bar1: true,
            bgcolor: "rgba(85,170,170,0.4)",
            showHeight: "250", //TOP按钮的滚动条高度临界值。默认：200
            css: {right: 50, bottom: 50},
            click: function (type) {
                console.log(type);
                if (type === 'bar1') {
                    layer.msg("联系客服中..")
                }
            }
        })

        //自定义表单验证
        let form = layui.form;
        form.verify({
            not0: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (/^[0]+$/.test(value)) {
                    return '此处不能设置为 0';
                }
            },
            min6: [
                /^\w[\S]{5,}$/
                , '密码必须不小于6位，且不能出现空格'
            ],
            min2: [
                /^\w[\S]{2,}$/
                , '用户名不能小于2位，且不能出现空格'
            ],
            notNum: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (/\d+/.test(value)) {
                    return '此处不能设置为数字';
                }
            },
            onlyNum: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (!(/^[1-9][0-9]*$/.test(value))) {
                    return '此处只能设置不为0的正整数';
                }
            },
            IDcardNumber: [/^[\S]{18,18}$/, '请输入18位正确的身份证号码，且不能出现空格'],
        });
    });
    /*---layui---  */

    //存储已编辑的发布阶段
    let alreadyEdits = null;
    if (getRequestData("pp") !== null && getRequestData("pp") !== "") {
        alreadyEdits = getRequestData("pp").split(",");
        console.log(alreadyEdits);
    }

    alreadyEdit();

    /* 当前编辑阶段标题变色 */
    $(".publishTitle>div").eq($(".nowStageTitle").val() - 1).css("background-color", "aliceblue");

    /* 阶段标题点击跳转页面 */
    $(".publishTitle").on("click", "div", function () {
        // console.log($(this).index())
        let pid = getRequestData("pid");
        if (pid != null) {
            window.location.href = "publishProject" + (parseInt($(this).index()) + 1) + "?pp=" + alreadyEdits + "&pid=" + pid;
        } else {
            layer.msg('请先完成此页面哦！', {icon: 5});
        }
    });

    /* 监听每个项目 */
    $(document).on("click", ".projectCard", function () {
        window.location.href = "/projectDetail?pid=" + $(this).find(".pid").val();
    });

    /* 用户编辑后在阶段性那显示状态 */
    function alreadyEdit() {
        if (alreadyEdits != null) {
            for (let j = 0, len = alreadyEdits.length; j < len; j++) {
                let $publishTitle = $(".publishTitle>div");
                // console.log($publishTitle.eq(0).children("i"))
                $publishTitle.eq(alreadyEdits[j]).children("i").css("color", "#48EB68");
            }
        }
    }

    /*点击退出按钮 /user/loginOut*/
    $(".loginOut").on("click", function () {
        $.ajax({
            url: "/user/loginOut",
            type: "GET",
            dataType: "json",
            success: function (res) {
                if (res.code === "200") {//上传成功
                    layer.msg(res.msg + ' ,跳转中..', {
                        icon: 6,
                        time: 800 //1.5秒关闭（如果不配置，默认是3秒）
                    }, function () {
                        window.location = "/index";
                    });
                } else {
                    //如果失败
                    return layer.msg(res.msg);
                }
            },
            error: function () {
                layer.msg("服务器错误!")
            }
        })
    })

    /*点击登录按钮*/
    $(".toLoginBtn").on("click", function () {
        // location.href = "/toLogin" + "?rUrl=" + location.pathname;
        location.href = "/toLogin" + location.search;
    });

    /*点击注册按钮*/
    $(".toRegistBtn").on("click", function () {
        // location.href = "/toRegist?" + "?rUrl=" + location.pathname;
        location.href = "/toRegist" + location.search;
    });

    /*点击发起者协议*/
    $(".ppInfo").on("click", function () {
        var s = "<div style='font-size: 19px;margin: 1.5%;color: brown;'" +
            "<p>本发起者协议由预售项目发起者与梦想众筹系统共同签署。</p><br>" +
            "<p>发起者应在签署本协议前认真阅读本协议全部的内容和条款，发起者点击“同意并接受”按钮、签署本协议的纸版文件或使用本协议项下服务的，</p><br>" +
            "<p>即表示发起者已阅读并理解本协议所有内容，同意并签署了本协议，本协议则立即生效，双方均应遵守本协议约定。</p><br>" +
            "<p>双方本着自愿、平等、互利原则，经充分协商，就发起者使用梦想众筹系统服务的相关事宜达成协议，以昭信守。</p>" +
            "</div>";
        //开启弹框
        layer.open({
            type: 1,
            title: "发起者协议",
            anim: 2,
            area: ['700px'],
            content: s,
            btn: ['接收并同意'],
            success: function (layero, index) {
            },
            yes: function () {
                layer.closeAll();
            }
        });
    });

    /*点击底部的按钮*/
    $(".myFooter a").on("click", function () {
        var s = "<div style='font-size: 20px;margin: 1.5%;color: cornflowerblue;'><br>" +
            "<h2>梦想众筹系统-实现你的梦想</h2><br>" +
            "<p>关于：本梦想众筹系统由本人Athink_倾力打造的个关于实现梦想的众筹系统</p><br>" +
            "<p>联系我们：athink8@163.com</a></p><br>" +
            "<p>意见反馈：<a href='https://blog.onfree.cn/contact/' style='color: #999999'>反馈</a></p><br>" +
            "<p>版权：本梦想众筹系统归Athink_所有</a></p>" +
            "</div>";
        //开启弹框
        layer.open({
            type: 1,
            title: "梦想众筹系统服务",
            anim: 2,
            area: ['700px'],
            content: s,
            btn: ['明白'],
            success: function (layero, index) {
            },
            yes: function () {
                layer.closeAll();
            }
        });
    })
});


/*----  以下方法需要在页面完成前配置才可调用 -----*/

/*根据条件常规获取项目*/
function getProjects(url, urlData, select, countSelect) {
    let defer = $.Deferred(); //jQuery解决递延对象

    $.ajax({
        url: url + "?" + urlData,
        type: "GET",
        dataType: "json", //返回数据格式为json
        success: function (datas) {
            if (datas != null && datas !== "" && Object.keys(datas).length > 0) {
                /*更新项目数量*/
                $(countSelect).html(datas["projects"].length);
                $(countSelect).html(datas["Length"]);
                defer.resolve(datas["Length"]);

                /*更新项目*/
                $(select).empty();
                let projects = datas["projects"]; //获取项目集合
                if (projects.length <= 0) {
                    $(select).html("并没有数据!")
                }
                for (let data of projects) {
                    let myDiv = "<div class=\"layui-col-md3 layui-col-xs12 \">\n" +
                        "                    <div class='projectCard'>\n" +
                        "                        <img lay-src=\"" + data.pheadImg + "\"" +
                        "                               alt=\"图片加载中..\"/>\n" +
                        "                        <!-- 项目文字信息 -->\n" +
                        "                        <div>\n" +
                        "                        <!-- 项目id -->\n" +
                        "                        <input type=\"hidden\" class=\"pid\" value=\"" + data.id + "\">" +
                        "                            <div class=\"Pinfo\">\n" +
                        "                                <!-- 项目名 -->\n" +
                        "                                <div class=\"Pname\">\n" + data.pname +
                        "                                </div>\n" +
                        "                                <!--  发布者名字和项目阶段  -->\n" +
                        "                                <div class=\"Uname\">\n" +
                        "                                    <i class=\"layui-icon layui-icon-username\"></i>\n" +
                        "                                     <span>" + data.userInfo.uusername + "</span>\n" +
                        "                                    <!-- 项目阶段 -->\n" +
                        "                                    <span class=\"Pstage  " + " PstageC" + data.pstage.itemCode + "\">" + data.pstage.itemName + "</span>" +
                        "                                </div>\n" +
                        "                                <!-- 项目统计金额 -->\n" +
                        "                                <div class=\"Pamount layui-row\">\n" +
                        "                                    <span class=\"layui-col-md1 layui-col-xs1\">¥</span>\n" +
                        "                                    <i class=\"Pnowmoney layui-col-md8 layui-col-xs8\">" + data.pnowMoney + "</i>\n" +
                        "                                    <i class=\"Ppercent layui-col-md2 layui-col-xs2\">" + Math.floor(data.pnowMoney / data.ptarMoney * 100) + "%</i>\n" +
                        "                                </div>\n" +
                        "                                <!-- 进度条 -->\n" +
                        "                                <div style=\"margin-top: 8px; width:95%\">\n" +
                        "                                    <div class=\"layui-progress\">\n" +
                        "                                        <div class=\"layui-progress-bar\"" +
                        "                                         lay-percent=\"" + Math.floor(data.pnowMoney / data.ptarMoney * 100) + "%\" style=\"width: " + Math.floor(data.pnowMoney / data.ptarMoney * 100) + "%\"></div>\n" +
                        "                                    </div>\n" +
                        "                                </div>\n" +
                        "                                <!-- 项目支持数-->\n" +
                        "                                <div class=\"Psupport\">\n" + data.psupportNum + "支持者" +
                        "                                </div>\n" +
                        "                                <br/>\n" +
                        "                            </div>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                </div>";
                    $(select).append(myDiv);
                }

                setTimeout(function () {
                    //开启了懒加载（也可以指定相关img）参数：elem - img选择器 scrollElem - 滚动条所在元素选择器
                    /* 懒加载 */
                    console.log("=========================");
                    console.log("假如这里出错了，没事，因为这个方法在layui定义前使用了,不影响效果");
                    let flow1 = layui.flow;
                    flow1.lazyimg();
                    console.log("=========================");
                }, 200);

            }
        },
        error: function (xhr) {
            //xhr:XMLHttpRequest对象  xhr.responseJSON 获取完整的错误信息
            console.log("服务器错误,错误信息：");
            console.log(xhr.responseJSON);
        }
    });

    return defer;
}

/*获取浏览器连接的参数值*/
function getRequestData(key) {
    let query = window.location.search.substring(1);
    let lets = query.split("&");
    for (let i = 0; i < lets.length; i++) {
        let key1 = lets[i].split("=");
        if (key1[0] === key) {
            return key1[1];
        }
    }
    return null;
}

/*根据字典装配选择框类型*/
function addSelect(url, urlData, select) {
    //后台获取数据
    $.getJSON(url, urlData, function (datas) {
        $(select).empty();
        $(select).append("<option value=\"\">全部</option>");
        if (datas["dictionaryItems"].length <= 0) {
            $(select).html("--");
        }

        let isSelected = "";
        $.each(datas.dictionaryItems, function (i, item) {
            //判断是否连接里有热度参数 控制默认的选择项
            if (item.dicId === 3 && item.itemCode === parseInt(getRequestData("hot"))) {
                isSelected = "selected";
            } else {
                isSelected = ""
            }
            $(select).append("<option  " + isSelected + " value=\"" + item.itemCode + "\">" + item.itemName + "</option>");
        });
    }).error(function (xhr) {
        $(select).html("--");
        //xhr:XMLHttpRequest对象  xhr.responseJSON 获取完整的错误信息
        console.log("服务器错误,错误信息：");
        console.log(xhr.responseJSON);
    })
}

/*根据字典装配单选框类型*/
function addSelect2(url, urlData, select, name) {
    //后台获取数据
    $.getJSON(url, urlData, function (datas) {
        $(select).empty();
        if (datas["dictionaryItems"].length <= 0) {
            $(select).html("--");
        }

        let isChecked = "checked";
        $.each(datas.dictionaryItems, function (i, item) {
            if (i !== 0) {
                isChecked = ""
            }
            var radio = "<input type=\"radio\" name=" + name + " value=" + item.itemCode + " title=" + item.itemName + "   " + isChecked + ">";
            $(select).append(radio);
        });
    }).error(function (xhr) {
        $(select).html("--");
        //xhr:XMLHttpRequest对象  xhr.responseJSON 获取完整的错误信息
        console.log("服务器错误,错误信息：");
        console.log(xhr.responseJSON);
    })
}

/*字符串转base64*/
function base64encode(str) {
    // 对字符串进行编码
    var encode = encodeURI(str);
    // 对编码的字符串转化base64
    var base64 = btoa(encode);
    return base64;
}

/*base64转字符串*/
function base64decode(base64) {
    // 对base64转编码
    var decode = atob(base64);
    // 编码转字符串
    var str = decodeURI(decode);
    return str;
}



