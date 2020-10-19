$(function () {

    //执行根据字典装配选择类型方法
    addSelect("/project/dictionaryItem/", "dicId=1", ".pType");
    addSelect("/project/dictionaryItem/", "dicId=2", ".pStage");
    addSelect("/project/dictionaryItem/", "dicId=3", ".pHot");

    layui.use(['form', 'laypage'], function () {
        /* 表单模块 */
        let form = layui.form;

        //分页初始化
        fenYeInit("/project/expand", "pIsDream=1"+ "&");

        /*---layui---  */
    });

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

    /* 重写监听每个项目 */
    $(document).on("click", ".projectCard", function (e) {
        e.preventDefault()
        window.location.href = "/projectDetail?pid=" + $(this).find(".pid").val()+"&pIsDream=1";
    });
});
