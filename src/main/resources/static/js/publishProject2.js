$(function () {
    layui.use(['layer'], function () {

        /* 弹出层 */
        var layer = layui.layer;

        /*---layui---  */
    })

    /*--wang富文本实例化-- */
    var E = window.wangEditor;
    var editor = new E('#editor');

    // 自定义菜单配置
    editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'undo', // 撤销
        'redo' // 重复
    ];
    // 自定义配置颜色（字体颜色、背景色）
    editor.customConfig.colors = [
        '#000000',
        '#eeece0',
        '#1c487f',
        '#4d80bf',
        '#c24f4a',
        '#8baa4a',
        '#7b5ba1',
        '#46acc8',
        '#9932CC',
        '#A9A9A9',
        '#8B0000',
        '#C71585',
    ];
    // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
    editor.customConfig.emotions = [{
        // tab 的标题
        title: 'emoji',
        // type -> 'emoji' / 'image'
        type: 'emoji',
        // content -> 数组
        content: ['😀', '😃', '😄', '😁', '😆', '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍',
            '🙋', '🙇', '🙌', '🙏', '💐', '🌸', '💮', '🌹', '🌺', '🌻', '🌼', '🌷', '🌱', '💐', '🌸', '💮', '🌹', '🌺',
            '🌻', '🌼', '🌷', '🌱', '🌿', '🍀'
        ],
    }];
    // 自定义字体
    editor.customConfig.fontNames = [
        '宋体',
        '微软雅黑',
        'Arial',
        'Tahoma',
        'Verdana'
    ];
    // 显示“上传图片”的tab
    editor.customConfig.uploadImgShowBase64 = true;
    // 隐藏“网络图片”tab
    editor.customConfig.showLinkImg = false;
    editor.customConfig.zIndex = 20
    // editor.create(); // editor.txt.text() 获取文字  editor.txt.html() 获取html内容
    editor.create();
    E.fullscreen.init('#editor');

    $("#editor .w-e-text-container").css("height", "500px");
    $("#editor .w-e-text-container").css("background-color", "rgba(204,255,204,0.1)");

    /*初始化编辑框数据*/
    dataFind(getRequestData("pid"));

    /* 点击保存按钮 */
    $(".saveBtn").on("click", function () {
        var editHtml = editor.txt.html();
        var editText = editor.txt.text();
        if (editText.length > 0 && editText.length !== "  ") {
            //预览
            layer.open({
                type: 1,
                title: '你编辑的内容预览',
                content: editHtml,
                area: ['600px', '500px'],
                btn: ['确定', '再修改下'],
                yes: function (index, layero) {
                    console.log(editHtml);
                    dataSave(editHtml);
                }, btn2: function (index, layero) {
                    //按钮【按钮二】的回调
                    //return false //开启该代码可禁止点击该按钮关闭
                }
            });

        } else {
            layer.msg('请输入详细内容介绍哦!!');
            $(window).scrollTop(280);
        }

    })

    /* 更新数据到后台 */
    function dataSave(Data) {
        layer.load(1); //上传loading
        let pid = getRequestData("pid");//获取连接中的项目id
        let formData = new FormData();//这里需要实例化一个FormData来进行文件上传
        formData.append("htmlFile", Data);
        formData.append("pid", pid);
        $.ajax({
            type: "POST",
            url: "/project/info",
            data: formData,
            processData: false, //因为data值是FormData对象，不需要对数据做处理。
            contentType: false,
            dataType: "json",//返回数据格式为json
            success: function (res) {
                if (res.code === "200") {//上传成功
                    let pp = getRequestData("pp") + ",1";
                    layer.msg('保存成功,跳转中..', {
                        icon: 6,
                        time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
                    }, function () {
                        window.location = "/publishProject3?pp=" + pp + "&pid=" + pid;
                    });
                } else {
                    //如果失败
                    layer.closeAll('loading'); //关闭loading
                    return layer.msg('更新失败,请重试');
                }
            },
            error: function () {
                layer.closeAll('loading'); //关闭loading
                return layer.msg('服务器错误,请重试');
            },
        })
    }

    /*查询数据从后台*/
    function dataFind(pid) {
        $.ajax({
            type: "GET",
            url: "/project/pContent" + "?id=" + pid+"&status=-1&pIsPublish=0",
            dataType: "html",
            success: function (res) {
                if (typeof (res) == "string") {
                    var ss = res.split("#"); //为了切割获得错误码500
                    if (ss[0] !== "500") {
                        editor.txt.html(res);
                    }
                }
            },
            error: function () {
                return layer.msg('服务器错误,请重试');
            },
        })
    }
})
