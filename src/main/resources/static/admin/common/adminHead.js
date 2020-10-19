/*后台通用管理js*/
$(function () {
    layui.use(['element', 'layer'], function () {
        var element = layui.element;
        var layer = layui.layer;

        /*监听弹框关闭按钮*/
        $(".closeBtn").on("click", function () {
            layer.closeAll();
        })

        /*监听点击清理缓存按钮*/
        $(".cleanCache").on("click", function () {
            layer.msg("缓存清理成功！！")
        })
    });

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
                        window.location = "/admin";
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
})


/*获取项目的数量*/
function getProjectCount(url, urlData) {
    let defer = $.Deferred(); //jQuery解决递延对象

    $.ajax({
        url: url + "?" + urlData,
        type: "GET",
        dataType: "json",
        success: function (res) {
            if (res != null && res !== "") {
                if (Object.keys(res).length > 0) {
                    /*更新项目数量*/
                    defer.resolve(res["Length"]);
                }
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

/*获取用户的数量*/
function getUserCount(url, urlData) {
    let defer = $.Deferred(); //jQuery解决递延对象

    $.ajax({
        url: url + "?" + urlData,
        type: "GET",
        dataType: "json",
        success: function (res) {
            if (res != null && res !== "") {
                if (res.code === "200") {
                    defer.resolve(res.data.Length);
                }
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

/*生成项目表格并且初始化分页的方法*/
function fenYeInit(url, urlData, tableId) {
    //为了可以事先获取项目数目
    let defer = getProjectCount(url, $.param(urlData));
    defer.then(function (data) {// data就是返回的值
        //执行一个分页 laypage实例
        //分页
        let laypage = layui.laypage;
        laypage.render({
            elem: 'fenye', //注意,这ID，不用加 # 号
            count: data, //数据总数，从服务端得到
            limit: 12, //每页显示的条数
            prev: "上一页",
            next: "下一页",
            first: "首页",
            last: "尾页",
            theme: "#7CFB7C",
            layout: ['first', 'prev', 'page', 'next', 'last', 'count'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：obj.curr obj.limit
                //首次执行
                if (first) {
                    //do something
                }
                /* 执行获取项目 */
                let page = obj.curr - 1;
                let size = obj.limit;

                var table = layui.table;
                urlData.page = page; //添加页数
                //待审核项目表格初始化
                ppTableIns = table.render({
                    elem: tableId
                    , url: url
                    , method: "get"
                    , where: urlData //参数
                    , page: false //开启分页
                    , limit: size //分页数量
                    , cols: [[ //表头
                        {field: 'id', title: 'id', width: 10, hide: true}
                        , {field: 'pname', title: '项目名', width: 100}
                        , {field: 'pintroduce', title: '项目简介', width: 110}
                        , {field: 'pheadImg', title: '项目头图片', width: 100}
                        , {field: 'pnowMoney', title: '当前金额(元)', width: 100, align: 'center', sort: true}
                        , {field: 'ptarMoney', title: '目标金额(元)', width: 100, align: 'center', sort: true}
                        , {
                            field: 'pstage',
                            title: '阶段',
                            width: 80,
                            align: 'center',
                            sort: true,
                            templet: '<div>{{d.pstage.itemName}}</div>'
                        }
                        , {
                            field: 'ptype',
                            title: '类型',
                            width: 70,
                            align: 'center',
                            sort: true,
                            templet: '<div>{{d.ptype.itemName}}</div>'
                        }
                        , {
                            field: 'pisPublish', title: '已发布', width: 80, align: 'center', sort: true,
                            templet: "<div>{{ d.pisPublish===1?'是':'否'}}</div>"
                        }
                        , {field: 'ppublishDate', title: '发布时间', width: 125, sort: true}
                        , {field: 'pstartDate', title: '开始时间', width: 125, sort: true}
                        , {field: 'pendDate', title: '结束时间', width: 125, sort: true}
                        , {field: 'psupportNum', title: '支持数', width: 85, align: 'center', sort: true}
                        , {
                            field: 'status', title: '状态', width: 90, align: 'center', sort: true,
                            templet: "<div>{{ d.status!==1?'待审核':'审核通过'}}</div>"
                        }
                        , {fixed: 'right', width: 120, align: 'center', toolbar: '#rowBar1'}
                    ]],
                    parseData: function (res) { //res 即为原始返回的数据
                        res.code = 200;
                        return {
                            "code": res.code, //解析接口状态
                            "msg": res.msg, //解析提示文本
                            "count": res.Length, //解析数据长度
                            "data": res.projects//解析数据列表
                        };
                    }
                    , response: {
                        statusCode: 200 //成功标识
                    }
                    , initSort: {
                        field: 'id' //排序字段，对应 cols 设定的各字段名
                        , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                    , request: {
                        pageName: '' //页码的参数名称，默认：page
                        , limitName: 'size' //每页数据量的参数名，默认：limit
                    }
                })
            }
        });
    });
}

/*生成用户表格并且初始化分页的方法*/
function fenYeInit2(url, urlData, tableId) {
    //为了可以事先获取项目数目
    let defer = getUserCount(url, $.param(urlData));
    defer.then(function (data) {// data就是返回的值
        //执行一个分页 laypage实例
        //分页
        let laypage = layui.laypage;
        laypage.render({
            elem: 'fenye', //注意,这ID，不用加 # 号
            count: data, //数据总数，从服务端得到
            limit: 12, //每页显示的条数
            prev: "上一页",
            next: "下一页",
            first: "首页",
            last: "尾页",
            theme: "#7CFB7C",
            layout: ['first', 'prev', 'page', 'next', 'last', 'count'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：obj.curr obj.limit
                //首次执行
                if (first) {
                    //do something
                }
                /* 执行获取项目 */
                let page = obj.curr - 1;
                let size = obj.limit;

                var table = layui.table;
                urlData.page = page; //添加页数
                //待审核项目表格初始化
                ppTableIns = table.render({
                    elem: tableId
                    , url: url
                    , method: "get"
                    , where: urlData //参数
                    , page: false //开启分页
                    , limit: size //分页数量
                    , cols: [[ //表头
                        {field: 'id', title: 'id', width: 10, hide: true}
                        , {field: 'uusername', title: '用户名', width: 100}
                        , {field: 'upassword', title: '密码', width: 130} //数据库的密码即使拿到了也很难破解哈哈哈
                        , {field: 'uemail', title: '邮箱', width: 150}
                        , {field: 'uphone', title: '手机号', width: 130, sort: true}
                        , {
                            field: 'ulock', title: '是否锁定', width: 100, align: 'center', sort: true,
                            templet: "<div>{{ d.ulock==='1'?'锁定':'未锁'}}</div>"
                        }
                        , {
                            field: 'status', title: '状态', width: 100, align: 'center', sort: true,
                            templet: "<div>{{ d.status=='1'?'正常使用':'未验证'}}</div>"
                        }
                        , {fixed: 'right', width: 210, align: 'center', toolbar: '#rowBar1'}
                    ]],
                    parseData: function (res) { //res 即为原始返回的数据
                        return {
                            "code": res.code, //解析接口状态
                            "msg": res.msg, //解析提示文本
                            "count": res.Length, //解析数据长度
                            "data": res.data.userInfos//解析数据列表
                        };
                    }
                    , response: {
                        statusCode: "200" //成功标识
                    }
                    , initSort: {
                        field: 'id' //排序字段，对应 cols 设定的各字段名
                        , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                    , request: {
                        pageName: '' //页码的参数名称，默认：page
                        , limitName: 'size' //每页数据量的参数名，默认：limit
                    }
                })
            }
        });
    });
}

/*生成具体字典表格并且初始化分页的方法*/
function fenYeInit3(url, urlData, tableId) {
    //为了可以事先获取项目数目
    let defer = getProjectCount(url, $.param(urlData));
    defer.then(function (data) {// data就是返回的值
        //执行一个分页 laypage实例
        //分页
        let laypage = layui.laypage;
        laypage.render({
            elem: 'fenye', //注意,这ID，不用加 # 号
            count: data, //数据总数，从服务端得到
            limit: 12, //每页显示的条数
            prev: "上一页",
            next: "下一页",
            first: "首页",
            last: "尾页",
            theme: "#7CFB7C",
            layout: ['first', 'prev', 'page', 'next', 'last', 'count'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：obj.curr obj.limit
                //首次执行
                if (first) {
                    //do something
                }
                /* 执行获取项目 */
                let page = obj.curr - 1;
                let size = obj.limit;

                var table = layui.table;
                urlData.page = page; //添加页数
                //待审核项目表格初始化
                ppTableIns = table.render({
                    elem: tableId
                    , url: url
                    , method: "get"
                    , where: urlData //参数
                    , page: false //开启分页
                    , limit: size //分页数量
                    , cols: [[ //表头
                        {field: 'id', title: 'id', width: 50, hide: true}
                        , {field: 'dicId', title: '字典类型', width: 100, sort: true, align: 'center'}
                        , {field: 'itemCode', title: '标识符', width: 100, sort: true, align: 'center'}
                        , {field: 'itemName', title: '字段名称', width: 100, align: 'center'}
                        , {field: 'itemInfo', title: '备注', width: 140}
                        , {
                            field: 'status', title: '状态', width: 100, align: 'center', sort: true,
                            templet: "<div>{{ d.status==1?'正常':'停止'}}</div>"
                        }
                        , {fixed: 'right', width: 140, align: 'center', toolbar: '#rowBar1'}
                    ]],
                    parseData: function (res) { //res 即为原始返回的数据
                        res.code = 200;
                        return {
                            "code": res.code, //解析接口状态
                            "msg": res.msg, //解析提示文本
                            "count": res.Length, //解析数据长度
                            "data": res.dictionaryItems//解析数据列表
                        };
                    }
                    , response: {
                        statusCode: 200 //成功标识
                    }
                    , initSort: {
                        field: 'id' //排序字段，对应 cols 设定的各字段名
                        , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                    , request: {
                        pageName: '' //页码的参数名称，默认：page
                        , limitName: 'size' //每页数据量的参数名，默认：limit
                    }
                })
            }
        });
    });
}

/*生成字典类型表格并且初始化分页的方法*/
function fenYeInit4(url, urlData, tableId) {
    //为了可以事先获取项目数目
    let defer = getUserCount(url, $.param(urlData));
    defer.then(function (data) {// data就是返回的值
        //执行一个分页 laypage实例
        //分页
        let laypage = layui.laypage;
        laypage.render({
            elem: 'fenye2', //注意,这ID，不用加 # 号
            count: data, //数据总数，从服务端得到
            limit: 12, //每页显示的条数
            prev: "上一页",
            next: "下一页",
            first: "首页",
            last: "尾页",
            theme: "#7CFB7C",
            layout: ['first', 'prev', 'page', 'next', 'last', 'count'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：obj.curr obj.limit
                //首次执行
                if (first) {
                    //do something
                }
                /* 执行获取项目 */
                let page = obj.curr - 1;
                let size = obj.limit;

                var table = layui.table;
                urlData.page = page; //添加页数
                //待审核项目表格初始化
                ppTableIns = table.render({
                    elem: tableId
                    , url: url
                    , method: "get"
                    , where: urlData //参数
                    , page: false //开启分页
                    , limit: size //分页数量
                    , cols: [[ //表头
                        {field: 'id', title: 'id', width: 80, sort: true, align: 'center'}
                        , {field: 'dicName', title: '字典名', width: 100, sort: true, align: 'center'}
                        , {field: 'dicInfo', title: '备注', width: 120}
                        , {field: 'dicLevel', title: '级别', width: 100}
                        , {
                            field: 'status', title: '状态', width: 100, align: 'center', sort: true,
                            templet: "<div>{{ d.status==1?'正常':'停止'}}</div>"
                        }
                    ]],
                    parseData: function (res) { //res 即为原始返回的数据
                        return {
                            "code": res.code, //解析接口状态
                            "msg": res.msg, //解析提示文本
                            "count": res.data.Length, //解析数据长度
                            "data": res.data.dictionaryTypes //解析数据列表
                        };
                    }
                    , response: {
                        statusCode: "200" //成功标识
                    }
                    , initSort: {
                        field: 'id' //排序字段，对应 cols 设定的各字段名
                        , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                    , request: {
                        pageName: '' //页码的参数名称，默认：page
                        , limitName: 'size' //每页数据量的参数名，默认：limit
                    }
                })
            }
        });
    });
}

/*生成项目拓展表格并且初始化分页的方法*/
function fenYeInit5(url, urlData, tableId) {
    //为了可以事先获取项目数目
    let defer = getProjectCount(url, $.param(urlData));
    defer.then(function (data) {// data就是返回的值
        //执行一个分页 laypage实例
        //分页
        let laypage = layui.laypage;
        laypage.render({
            elem: 'fenye2', //注意,这ID，不用加 # 号
            count: data, //数据总数，从服务端得到
            limit: 12, //每页显示的条数
            prev: "上一页",
            next: "下一页",
            first: "首页",
            last: "尾页",
            theme: "#7CFB7C",
            layout: ['first', 'prev', 'page', 'next', 'last', 'count'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：obj.curr obj.limit
                //首次执行
                if (first) {
                    //do something
                }
                /* 执行获取项目 */
                let page = obj.curr - 1;
                let size = obj.limit;

                var table = layui.table;
                urlData.page = page; //添加页数
                //待审核项目表格初始化
                ppTableIns = table.render({
                    elem: tableId
                    , url: url
                    , method: "get"
                    , where: urlData //参数
                    , page: false //开启分页
                    , limit: size //分页数量
                    , cols: [[ //表头
                        {field: 'id', title: 'id', width: 10, hide: true}
                        , {field: 'pname', title: '项目名', width: 100}
                        , {field: 'pintroduce', title: '项目简介', width: 110}
                        , {field: 'pheadImg', title: '项目头图片', width: 100}
                        , {field: 'pnowMoney', title: '当前金额(元)', width: 100, align: 'center', sort: true}
                        , {field: 'ptarMoney', title: '目标金额(元)', width: 100, align: 'center', sort: true}
                        , {
                            field: 'pstage',
                            title: '阶段',
                            width: 80,
                            align: 'center',
                            sort: true,
                            templet: '<div>{{d.pstage.itemName}}</div>'
                        }
                        , {
                            field: 'ptype',
                            title: '类型',
                            width: 70,
                            align: 'center',
                            sort: true,
                            templet: '<div>{{d.ptype.itemName}}</div>'
                        }
                        , {
                            field: 'pisPublish', title: '已发布', width: 80, align: 'center', sort: true,
                            templet: "<div>{{ d.pisPublish===1?'是':'否'}}</div>"
                        }
                        , {field: 'ppublishDate', title: '发布时间', width: 125, sort: true}
                        , {field: 'pstartDate', title: '开始时间', width: 125, sort: true}
                        , {field: 'pendDate', title: '结束时间', width: 125, sort: true}
                        , {field: 'psupportNum', title: '支持数', width: 85, align: 'center', sort: true}
                        , {
                            field: 'status', title: '状态', width: 90, align: 'center', sort: true,
                            templet: "<div>{{ d.status!==1?'待审核':'审核通过'}}</div>"
                        }
                        , {fixed: 'right', width: 120, align: 'center', toolbar: '#rowBar2'}
                    ]],
                    parseData: function (res) { //res 即为原始返回的数据
                        res.code = 200;
                        return {
                            "code": res.code, //解析接口状态
                            "msg": res.msg, //解析提示文本
                            "count": res.Length, //解析数据长度
                            "data": res.projects//解析数据列表
                        };
                    }
                    , response: {
                        statusCode: 200 //成功标识
                    }
                    , initSort: {
                        field: 'id' //排序字段，对应 cols 设定的各字段名
                        , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                    , request: {
                        pageName: '' //页码的参数名称，默认：page
                        , limitName: 'size' //每页数据量的参数名，默认：limit
                    }
                })
            }
        });
    });
}

/*生成订单表格并且初始化分页的方法*/
function fenYeInit6(url, urlData, tableId) {
    //为了可以事先获取项目数目
    let defer = getUserCount(url, $.param(urlData));
    defer.then(function (data) {// data就是返回的值
        //执行一个分页 laypage实例
        //分页
        let laypage = layui.laypage;
        laypage.render({
            elem: 'fenye', //注意,这ID，不用加 # 号
            count: data, //数据总数，从服务端得到
            limit: 12, //每页显示的条数
            prev: "上一页",
            next: "下一页",
            first: "首页",
            last: "尾页",
            theme: "#7CFB7C",
            layout: ['first', 'prev', 'page', 'next', 'last', 'count'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：obj.curr obj.limit
                //首次执行
                if (first) {
                    //do something
                }
                /* 执行获取项目 */
                let page = obj.curr - 1;
                let size = obj.limit;

                var table = layui.table;
                urlData.page = page; //添加页数
                //待审核项目表格初始化
                ppTableIns = table.render({
                    elem: tableId
                    , url: url
                    , method: "get"
                    , where: urlData //参数
                    , page: false //开启分页
                    , limit: size //分页数量
                    , cols: [[ //表头
                        {field: 'id', title: 'id', width: 10, hide: true}
                        , {field: 'rid', title: 'rid', width: 10, hide: true}
                        , {field: 'pid', title: 'pid', width: 10, hide: true}
                        , {field: 'oname', title: '订单名', width: 100}
                        , {field: 'onum', title: '数量', width: 60}
                        , {field: 'oid', title: '订单号', width: 80}
                        , {field: 'otradeId', title: '流水号', width: 80}
                        , {field: 'ocreateTime', title: '创建时间', width: 100, sort: true}
                        , {field: 'opayTime', title: '支付时间', width: 100, sort: true}
                        , {field: 'omoney', title: '支付金额', width: 100, align: 'center', sort: true}
                        , {field: 'oreceipt', title: '发票名', width: 100, align: 'center'}
                        , {field: 'oreceiveName', title: '收货人', width: 100, align: 'center'}
                        , {field: 'oaddress', title: '收货地址', width: 100}
                        , {field: 'ophone', title: '联系电话', width: 100}
                        , {
                            field: 'opayType',
                            title: '支付类型',
                            width: 100,
                            align: 'center',
                            sort: true,
                            templet: '<div>{{d.opayType.itemName}}</div>'
                        }
                        , {
                            field: 'otype',
                            title: '支付状态',
                            width: 100,
                            align: 'center',
                            sort: true,
                            templet: '<div>{{d.otype.itemName}}</div>'
                        }
                        , {
                            field: 'status', title: '状态', width: 90, align: 'center', sort: true,
                            templet: "<div>{{ d.status=='1'?'正常':'异常'}}</div>"
                        }
                        , {fixed: 'right', width: 100, align: 'center', toolbar: '#rowBar1'}
                    ]],
                    parseData: function (res) { //res 即为原始返回的数据
                        return {
                            "code": res.code, //解析接口状态
                            "msg": res.msg, //解析提示文本
                            "count": res.data.Length, //解析数据长度
                            "data": res.data.projectOrders//解析数据列表
                        };
                    }
                    , response: {
                        statusCode: "200" //成功标识
                    }
                    , initSort: {
                        field: 'id' //排序字段，对应 cols 设定的各字段名
                        , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                    , request: {
                        pageName: '' //页码的参数名称，默认：page
                        , limitName: 'size' //每页数据量的参数名，默认：limit
                    }
                })
            }
        });
    });
}

/*生成权限类型表格并且初始化分页的方法*/
function fenYeInit7(url, urlData, tableId) {
    //为了可以事先获取项目数目
    let defer = getUserCount(url, $.param(urlData));
    defer.then(function (data) {// data就是返回的值
        //执行一个分页 laypage实例
        //分页
        let laypage = layui.laypage;
        laypage.render({
            elem: 'fenye', //注意,这ID，不用加 # 号
            count: data, //数据总数，从服务端得到
            limit: 12, //每页显示的条数
            prev: "上一页",
            next: "下一页",
            first: "首页",
            last: "尾页",
            theme: "#7CFB7C",
            layout: ['first', 'prev', 'page', 'next', 'last', 'count'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：obj.curr obj.limit
                //首次执行
                if (first) {
                    //do something
                }
                /* 执行获取项目 */
                let page = obj.curr - 1;
                let size = obj.limit;

                var table = layui.table;
                urlData.page = page; //添加页数
                //待审核项目表格初始化
                ppTableIns = table.render({
                    elem: tableId
                    , url: url
                    , method: "get"
                    , where: urlData //参数
                    , page: false //开启分页
                    , limit: size //分页数量
                    , cols: [[ //表头
                        {field: 'id', title: 'id', width: 10, hide: true}
                        , {field: 'rroleName', title: '权限名', width: 100}
                        , {field: 'roperate', title: '权限操作', width: 100}
                        , {fixed: 'right', width: 130, align: 'center', toolbar: '#rowBar1'}
                    ]],
                    parseData: function (res) { //res 即为原始返回的数据
                        return {
                            "code": res.code, //解析接口状态
                            "msg": res.msg, //解析提示文本
                            "count": res.data.Length, //解析数据长度
                            "data": res.data.roles//解析数据列表
                        };
                    }
                    , response: {
                        statusCode: "200" //成功标识
                    }
                    , initSort: {
                        field: 'id' //排序字段，对应 cols 设定的各字段名
                        , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                    , request: {
                        pageName: '' //页码的参数名称，默认：page
                        , limitName: 'size' //每页数据量的参数名，默认：limit
                    }
                })
            }
        });
    });
}

/*生成权限类型表格并且初始化分页的方法*/
function fenYeInit8(url, urlData, tableId) {
    //为了可以事先获取项目数目
    let defer = getUserCount(url, $.param(urlData));
    defer.then(function (data) {// data就是返回的值
        //执行一个分页 laypage实例
        //分页
        let laypage = layui.laypage;
        laypage.render({
            elem: 'fenye2', //注意,这ID，不用加 # 号
            count: data, //数据总数，从服务端得到
            limit: 12, //每页显示的条数
            prev: "上一页",
            next: "下一页",
            first: "首页",
            last: "尾页",
            theme: "#7CFB7C",
            layout: ['first', 'prev', 'page', 'next', 'last', 'count'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：obj.curr obj.limit
                //首次执行
                if (first) {
                    //do something
                }
                /* 执行获取项目 */
                let page = obj.curr - 1;
                let size = obj.limit;

                var table = layui.table;
                urlData.page = page; //添加页数
                //待审核项目表格初始化
                ppTableIns = table.render({
                    elem: tableId
                    , url: url
                    , method: "get"
                    , where: urlData //参数
                    , page: false //开启分页
                    , limit: size //分页数量
                    , cols: [[ //表头
                        {field: 'id', title: 'id', width: 10, hide: true}
                        ,{field: 'role.id', title: '权限id', width: 10, hide: true,templet: '<div>{{d.role.id}}</div>'}
                        , {field: 'role.rroleName', title: '权限名', width: 100,templet: '<div>{{d.role.rroleName}}</div>'}
                        , {field: 'role.roperate', title: '权限操作', width: 100,templet: '<div>{{d.role.roperate}}</div>'}
                        ,{field: 'userInfo.id', title: '用户id', width: 10, hide: true,templet: '<div>{{d.userInfo.id}}</div>'}
                        , {field: 'userInfo.uusername', title: '用户名', width: 100,templet: '<div>{{d.userInfo.uusername}}</div>'}
                        , {field: 'userInfo.upassword', title: '密码', width: 100, hide: true,templet: '<div>{{d.userInfo.upassword}}</div>'}
                        , {field: 'userInfo.uemail', title: '邮箱', width: 120,templet: '<div>{{d.userInfo.uemail}}</div>'}
                        , {field: 'userInfo.uphone', title: '手机号', width: 120, sort: true,templet: '<div>{{d.userInfo.uphone}}</div>'}
                        , {
                            field: 'userInfo.ulock', title: '是否锁定', width: 100, align: 'center', sort: true,
                            templet: "<div>{{ d.userInfo.ulock==='1'?'锁定':'未锁'}}</div>"
                        }
                        , {
                            field: 'userInfo.status', title: '状态', width: 100, align: 'center', sort: true,
                            templet: "<div>{{ d.userInfo.status==1?'正常使用':'未验证'}}</div>"
                        }
                        , {fixed: 'right', width: 100, align: 'center', toolbar: '#rowBar2'}
                ]],
                    parseData: function (res) { //res 即为原始返回的数据
                        return {
                            "code": res.code, //解析接口状态
                            "msg": res.msg, //解析提示文本
                            "count": res.data.Length, //解析数据长度
                            "data": res.data.userRoles//解析数据列表
                        };
                    }
                    , response: {
                        statusCode: "200" //成功标识
                    }
                    , initSort: {
                        field: 'id' //排序字段，对应 cols 设定的各字段名
                        , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                    , request: {
                        pageName: '' //页码的参数名称，默认：page
                        , limitName: 'size' //每页数据量的参数名，默认：limit
                    }
                })
            }
        });
    });
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

