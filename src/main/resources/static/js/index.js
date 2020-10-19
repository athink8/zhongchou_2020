$(function () {

    layui.use(['carousel'], function () {
        /* 执行获取轮播图项目 */
        getCarouselProject();

        /* 轮播图 */
        let carousel = layui.carousel;
        setTimeout(function () {
            carousel.render({
                elem: '#headTurnImg',
                width: '83%', //设置容器宽度
                height: '340px',
                arrow: 'hover', //始终显示箭头
                anim: 'default', //切换动画方式
                autoplay: 'true',
                interval: '3000'
            });
        },250);

    });
    /*---layui---  */

    /*执行获取项目*/
    /*最新*/
    getProjects("/project/", "hot=1&&size=4", ".projectDiv1");
    /*最热*/
    getProjects("/project/", "hot=2&&size=4", ".projectDiv2");
    /*获取梦想计划*/
    getProjects("/project/expand", "pIsDream=1&&size=4", ".projectDiv3");

    /* 通过ajax获取轮播图项目 */
    function getCarouselProject() {
        var urlData = "pIsCarousel=1";
        $.ajax({
            url: "/project/expand?" + urlData,
            type: "GET",
            dataType: "json", //返回数据格式为json
            success: function (datas) {
                // console.log(datas);
                if (datas != null && datas !== "" && Object.keys(datas).length > 0) {
                    $(".headImgDiv").empty();
                    let projects = datas["projects"]; //获取项目集合
                    if (projects.length <= 0) {
                        $(".headImgDiv").html("此为轮播图，然而并没有数据!")
                    }
                    for (let data of projects) {
                        //console.log(data);
                        let turnDiv = "<div class='projectCard'>\n" +
                            "                <!-- 左边图片 -->\n" +
                            "                <a href=\"javascript:\">\n" +
                            "                    <img lay-src=\"" + data.pheadImg + "\" alt=\"图片加载中..\"/>\n" +
                            "                </a>\n" +
                            "                <!-- 右边文字信息 -->\n" +
                            "                <div>\n" +
                            "                    <div class=\"headImgInfo\">\n" +
                            "                        <!-- 项目id -->\n" +
                            "                        <input type=\"hidden\" class=\"pid\" value=\"" + data.id + "\">" +
                            "                        <!-- 项目名 -->\n" +
                            "                        <div class=\"HPname\">\n" + data.pname +
                            "                        </div>\n" +
                            "                        <!-- 项目简介 -->\n" +
                            "                        <div class=\"HPintroduce\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
                            "                            <span>\n" + data.pintroduce +
                            "                            </span>\n" +
                            "                        </div>\n" +
                            "                        <!-- 项目统计金额 -->\n" +
                            "                        <div class=\"HPamount\">¥\n" +
                            "                            <i class=\"HPnowmoney\">" + data.pnowMoney + "</i>\n" +
                            "                            <i class=\"HPpercent\">" + Math.floor(data.pnowMoney / data.ptarMoney * 100) + "%</i>\n" +
                            "                            <div style=\"margin-top: 8px; width:96%\">\n" +
                            "                                <div class=\"layui-progress\">\n" +
                            "                                    <div class=\"layui-progress-bar\"" +
                            "                                       lay-percent=\"" + Math.floor(data.pnowMoney / data.ptarMoney * 100) + "%\"" +
                            "                                       style=\"width:1%\"></div>\n" +
                            "                                </div>\n" +
                            "                            </div>\n" +
                            "                        </div>\n" +
                            "                        <!-- 项目支持数-->\n" +
                            "                        <div class=\"HPsupport\">\n" + data.psupportNum + "支持者" +
                            "                        </div>\n" +
                            "                        <br/>\n" +
                            "                    </in>\n" +
                            "                </div>\n" +
                            "            </div>";

                        $(".headImgDiv").append(turnDiv);
                    }
                }
            },
            error: function (err) {
                console.log("服务器错误")
            }
        })
    }

});
