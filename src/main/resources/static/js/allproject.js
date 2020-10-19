$(function () {

    //执行根据字典装配选择类型方法
    addSelect("/project/dictionaryItem/", "dicId=1", ".pType");
    addSelect("/project/dictionaryItem/", "dicId=2", ".pStage");
    addSelect("/project/dictionaryItem/", "dicId=3", ".pHot");

    layui.use(['form', 'laypage'], function () {
        /* 表单模块 */
        let form = layui.form;

        //根据连接获取参数初始化
        let UrlData = getRequestData("hot");

        //分页初始化
        fenYeInit("/project/", "hot=" + UrlData);

        // form.render(); //更新全部
        // form.render('select'); //刷新select选择框渲染

        //执行监听选择事件
        selectListen();

        /* 点击搜索按钮 搜索框出现 */
        $(".psearchBtn").on("click", function () {
            //console.log($(".psearchInfo").css("display"));
            //判断不是第一次点击时执行搜索查询
            if ($(".psearchInfo").css("display") !== "none") {
                searchData();
                return
            }

            $(".psearchInfo").show();
            $(".textClean").show();
        });

        /* 搜索框 按下回车发送搜索 */
        $(".psearchInfo").on("keydown", function () {
            if (event.keyCode === 13) {
                searchData();
            }
        });
        /* 搜索清除按钮  */
        $(".textClean").on("click", function () {
            $(".psearchInfo").val("")
        });
        /*---layui---  */
    });

    /*搜索内容方法*/
    function searchData() {
        if ($(".psearchInfo").val() == null || $(".psearchInfo").val() == '') {
            var layer = layui.layer;
            layer.msg('请输入你要搜索的关键字呢', {icon: 5});
        } else {
            fenYeInit("/project/", "pName=" + $(".psearchInfo").val());
        }
        let form = layui.form;
        form.val("pHot", {"pHot": ""});
        form.val("pType", {"pType": ""});
        form.val("pStage", {"pStage": ""});
        $(".selectVal>input").eq(0).val("");
        $(".selectVal>input").eq(1).val("");
        $(".selectVal>input").eq(2).val("");
    }

    /*分页初始化方法*/
    function fenYeInit(url, urlData) {
        //为了可以事先更新项目数目
        let defer = getProjects(url, urlData, null, ".pnumber");
        defer.then(function (data) {// data就是返回的值
            //执行一个分页 laypage实例
            /* 分页 */
            let laypage = layui.laypage;
            laypage.render({
                elem: 'fenye', //注意,这ID，不用加 # 号
                count: data, //数据总数，从服务端得到
                limit: 12, //每页显示的条数
                prev: "⬅",
                next: "➡",
                first: "首页",
                last: "尾页",
                theme: "#7CFB7C",
                jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：obj.curr obj.limit
                    //首次执行
                    if (first) {
                        //do something
                    }
                    /* 执行获取项目 */
                    let page = obj.curr - 1;
                    let size = obj.limit;
                    getProjects(url, "page=" + page + "&size=" + size + "&" + urlData, ".projectDiv4", null);
                }
            });
        });


    }

    /*监听选择事件*/
    function selectListen() {
        let form = layui.form;
        form.on('select()', function (data) { //data 包含当前触发的对象 data.elem当前标签 data.value当前选择值
            //关闭搜索框和清除按钮
            $(".psearchInfo").hide();
            $(".textClean").hide();

            // console.log(data.elem + data.value);
            //保存选择的值到隐藏的地方去
            if ($(data.elem).hasClass("pHot")) {
                $(".selectVal>input").eq(0).val(data.value);
                //console.log("pHot");
            }
            if ($(data.elem).hasClass("pType")) {
                $(".selectVal>input").eq(1).val(data.value);
                // console.log("pType");
            }
            if ($(data.elem).hasClass("pStage")) {
                $(".selectVal>input").eq(2).val(data.value);
                // console.log("pStage");
            }

            //获取隐藏保存的值
            let hot = "hot=" + $(".selectVal>input").eq(0).val();
            let pType = "&pType.itemCode=" + $(".selectVal>input").eq(1).val();
            let pStage = "&pStage.itemCode=" + $(".selectVal>input").eq(2).val();
            //执行后台查询并装配到分页
            fenYeInit("/project/", hot + pType + pStage);
        });
    }


});
