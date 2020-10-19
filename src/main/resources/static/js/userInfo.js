$(function () {

    /* layui模块入口 */
    layui.use(['layer', 'form', 'table'], function () {
        /* 弹出层 */
        var layer = layui.layer;

        //用户id
        var uid = -1;
        var uid1 = $(".uid").val();
        var uid2 = getRequestData("uid");
        if (uid1 === uid2) {
            uid = uid1;
        }

        //初始化个人信息
        userInfoSave("id=" + uid, 0);

        //初始化个人认证信息
        userIdCardSave("uId=" + uid, 0)

        //初始化个人財產
        userPropertySave("uId=" + uid);


        /* 表单模块 */
        var form = layui.form;

        //监听提交
        form.on('submit(userInfoForm)', function (data) {
            //data.field json对象
            // JSON.stringify(data.field) 字符串化json

            var isSamePsd = false;
            if (data.field.upassword !== data.field.upassword2) {
                layer.msg("两次输入的密码不一致哦~");
                return false;
            } else {
                isSamePsd = true;
            }

            if (isSamePsd) {
                console.log(data.field); //获取格式化的参数
                //执行后台方法
                // reportSave($.param(data.field), 1);
                // reportSave(JSON.stringify(data.field), 1);
                userInfoSave(JSON.stringify(data.field), 1);
                return false;
            }
        });

        var table = layui.table;

        //参与项目表格初始化
        var tableIns0 = table.render({
            elem: '#psTable'
            , url: '/project/supportP'
            , method: "get"
            , where: {"status": 1, "uId": uid} //参数
            , page: false //开启分页
            , cols: [[ //表头
                {field: 'id', title: 'id', width: 10, hide: true}
                , {field: 'pname', title: '项目名', width: 120}
                , {field: 'pintroduce', title: '项目简介', width: 140}
                , {field: 'pheadImg', title: '项目头图片', width: 120}
                , {field: 'pnowMoney', title: '已筹集金额(元)', width: 130, align: 'center', sort: true}
                , {field: 'ptarMoney', title: '目标金额(元)', width: 100, align: 'center', sort: true}
                , {
                    field: 'pstage',
                    title: '阶段',
                    width: 70,
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
                , {field: 'ppublishDate', title: '发布时间', width: 100, sort: true}
                , {field: 'pstartDate', title: '开始时间', width: 120, sort: true}
                , {field: 'pendDate', title: '结束时间', width: 120, sort: true}
                , {field: 'psupportNum', title: '支持数', width: 80, align: 'center', sort: true}
                , {fixed: 'right', width: 120, align: 'center', toolbar: '#rowBar0'}
            ]],
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "count": res.data.Length, //解析数据长度
                    "data": res.data.projects//解析数据列表
                };
            }
            , response: {
                statusCode: "200" //成功标识
            }
            , initSort: {
                field: 'id' //排序字段，对应 cols 设定的各字段名
                , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
            }
        });

        //参与项目监听列裡工具按鈕
        table.on('tool(psTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            if (layEvent === 'detail') { //查看
                if (obj.data.status === 1 && obj.data.pisPublish === 1) {
                    window.location.href = "/projectDetail?pid=" + obj.data.id;
                } else {
                    layer.msg("当前项目并未审核或审核不通过,无法查看详情!")
                }
            }
        });

        //发布项目表格初始化
        var tableIns1 = table.render({
            elem: '#pTable'
            , url: '/project/'
            , method: "get"
            , where: {"pisPublish": 1, "userInfo.id": uid,"status":"-1"} //参数
            , page: false //开启分页
            , cols: [[ //表头
                {field: 'id', title: 'id', width: 10, hide: true}
                , {field: 'pname', title: '项目名', width: 90}
                , {field: 'pintroduce', title: '项目简介', width: 90}
                , {field: 'pheadImg', title: '项目头图片', width: 100}
                , {field: 'pnowMoney', title: '已筹集金额(元)', width: 130, align: 'center', sort: true}
                , {field: 'ptarMoney', title: '目标金额(元)', width: 100, align: 'center', sort: true}
                , {
                    field: 'pstage',
                    title: '阶段',
                    width: 70,
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
                , {field: 'ppublishDate', title: '发布时间', width: 100, sort: true}
                , {field: 'pstartDate', title: '开始时间', width: 100, sort: true}
                , {field: 'pendDate', title: '结束时间', width: 100, sort: true}
                , {field: 'psupportNum', title: '支持数', width: 80, align: 'center', sort: true}
                , {
                    field: 'status', title: '状态', width: 90, align: 'center', sort: true,
                    templet: "<div>{{ d.status!==1?'待审核':'审核通过'}}</div>"
                }
                , {fixed: 'right', width: 160, align: 'center', toolbar: '#rowBar'}
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
        });

        //发布项目监听列裡工具按鈕
        table.on('tool(pTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            if (layEvent === 'detail') { //查看
                if (obj.data.status === 1 && obj.data.pisPublish === 1) {
                    window.location.href = "/projectDetail?pid=" + obj.data.id;
                } else {
                    layer.msg("当前项目并未审核或审核不通过,无法查看详情!")
                }
            } else if (layEvent === 'applyDream') { //申请梦想计划
                let urlData = {
                    "pId": obj.data.id
                };
                dataSave(urlData, 0)
            }
        });

        //梦想计划项目表格初始化
        var tableIns2 = table.render({
            elem: '#pdTable'
            , url: '/project/expand/'
            , method: "GET"
            , where: {"pIsDream": 1, "userInfo.id": uid, "status": 1} //参数
            , page: false //开启分页
            , cols: [[ //表头
                {field: 'id', title: 'id', width: 10, hide: true}
                , {field: 'pname', title: '项目名', width: 90}
                , {field: 'pintroduce', title: '项目简介', width: 90}
                , {field: 'pheadImg', title: '项目头图片', width: 100}
                , {field: 'pnowMoney', title: '已筹集金额(元)', width: 130, align: 'center', sort: true}
                , {field: 'ptarMoney', title: '目标金额(元)', width: 100, align: 'center', sort: true}
                , {
                    field: 'pstage',
                    title: '阶段',
                    width: 70,
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
                , {field: 'ppublishDate', title: '发布时间', width: 100, sort: true}
                , {field: 'pstartDate', title: '开始时间', width: 100, sort: true}
                , {field: 'pendDate', title: '结束时间', width: 100, sort: true}
                , {field: 'psupportNum', title: '支持数', width: 80, align: 'center', sort: true}
                , {
                    field: 'status', title: '状态', width: 90, align: 'center', sort: true,
                    templet: "<div>{{ d.status!==1?'待审核':'审核通过'}}</div>"
                }
                , {fixed: 'right', width: 160, align: 'center', toolbar: '#rowBar2'}
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
        });

        //梦想计划项目监听列裡工具按鈕
        table.on('tool(pdTable)', function (obj) { //注：tool 是工具条事件名，test 是 lay-filter="值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象

            if (layEvent === 'detail') { //查看
                if (obj.data.status === 1 && obj.data.pisPublish === 1) {
                    window.location.href = "/projectDetail?pIsDream=1&pid=" + obj.data.id;
                } else {
                    layer.msg("当前项目并未审核或审核不通过,无法查看详情!")
                }
            }
        });

        /* 项目查询更新数据到后台 opeType  0查看 1更新/添加 -1删除 */
        function dataSave(urlData, opeType) {
            let type;
            let pid = -1;
            if (opeType === 1) {
                type = "POST"
            } else if (opeType === -1) {
                type = "DELETE"
            } else if (opeType === 0) {
                pid = urlData.pId;
                type = "GET";
                urlData = $.param(urlData);
            }
            $.ajax({
                url: "/project/expand/info",
                type: type,
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    console.log(res)
                    //查询是否为梦想计划项目
                    if (opeType === 0) {
                        if (res.code === "200" && res.data !== null) {
                            let urlData = {};
                            if (res.data.projectExpand[0].pisDream === 1) {
                                layer.msg("此项目已是梦想计划项目了，无需重新申请！");
                            } else if (res.data.projectExpand[0].applyDream === 1) {
                                layer.msg("此项目正在进行申请梦想计划项目，请勿重新操作！");
                            } else {
                                layer.msg("申请成功");
                                urlData = {"id": res.data.projectExpand[0].id, "applyDream": "1", "pid": pid};
                                dataSave(JSON.stringify(urlData), 1)
                            }
                        } else {
                            layer.msg("申请成功");
                            urlData = {"applyDream": "1", "pid": pid};
                            dataSave(JSON.stringify(urlData), 1)
                        }
                    }

                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })

        }

        /* 用户信息查询更新数据到后台 opeType  0查看 1更新/添加 -1删除 */
        function userInfoSave(urlData, opeType) {
            let type;
            let pid = -1;
            if (opeType === 1) {
                type = "POST"
            } else if (opeType === -1) {
                type = "DELETE"
            } else if (opeType === 0) {
                type = "GET";
            }
            $.ajax({
                url: "/user/info",
                type: type,
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    if (res.code === "200" && res.data !== null) {
                        if (opeType === 1) {
                            layer.msg("个人信息更新成功");
                        } else if (opeType === 0) {
                            form.val("userInfoForm", {
                                "id": res.data.userInfos[0].id
                                , "uusername": res.data.userInfos[0].uusername
                                , "uphone": res.data.userInfos[0].uphone
                                , "uemail": res.data.userInfos[0].uemail
                            });
                        }
                    }

                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })

        }

        /* 用户身份证信息查询更新数据到后台 opeType  0查看 1更新/添加 -1删除 */
        function userIdCardSave(urlData, opeType) {
            let type;
            let pid = -1;
            if (opeType === 1) {
                type = "POST"
            } else if (opeType === -1) {
                type = "DELETE"
            } else if (opeType === 0) {
                type = "GET";
            }
            $.ajax({
                url: "/user/idCard",
                type: type,
                data: urlData,
                contentType: "application/JSON",
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    if (res.code === "200") {
                        if (opeType === 0 && res.data.Length !== 0) {
                            var data = res.data.userIdCards[0];
                            if (data.status === "1") {
                                $(".idCardTrue").html("当前用户已认证！");
                                var $idCardChi = $(".idCardInfo> h2");
                                var isT = data.status === "1" ? "已认证" : "等待审核";
                                $idCardChi.eq(0).html("姓名：" + data.uicName);
                                $idCardChi.eq(1).html("身份证号：*************" + data.uicNumber.substr(12, 5));
                                $idCardChi.eq(2).html("手机号：********" + data.uicPhone.substr(6, 4));
                                $idCardChi.eq(3).html("状态：" + isT);
                            } else if (res.data.userIdCards[0].status === "0") {
                                $(".idCardTrue").html("当前用户等待审核中..！")
                            }
                        }
                    }
                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })

        }

        /* 用户财务信息查询更新数据到后台 opeType  0查看 1更新/添加 -1删除 */
        function userPropertySave(urlData) {
            $.ajax({
                url: "/user/property?" + urlData,
                type: "GET",
                contentType: "application/JSON",
                success: function (res) {
                    console.log(res);
                    if (res.code === "200") {
                        var data = {
                            "upCount": "0",
                            "upCountDate": new Date().toLocaleDateString(),
                        };
                        var isL = "无";
                        if (res.data.Length !== 0) {
                            data = res.data.userProperties[0];
                            isL = data.upLock === "1" ? "已锁定" : "未锁定";
                        }
                        var $propertyInfoChi = $(".propertyInfo> h2");
                        $propertyInfoChi.eq(0).html("当前余额：" + data.upCount + "元");
                        $propertyInfoChi.eq(1).html("更新时间：" + data.upCountDate);
                        $propertyInfoChi.eq(2).html("是否锁定：" + isL);
                    }
                },
                error: function () {
                    layer.msg("服务器错误")
                }
            })

        }

        /*前往支付页面*/
        function goAliPay(urlData) {
            $.ajax({
                url: "/project/aliPay?" + urlData,
                type: "GET",
                success: function (res) {
                    $("body").html(res);
                },
                error: function () {
                    layer.msg("充值失败，服务器错误")
                }
            })
        }

        /*监听个人财富充值点击事件*/
        $(".addMoney").on("click", function () {
            //开启弹框
            layer.open({
                type: 1,
                title: "充值金额",
                anim: 2,
                area: ['500px'],
                content: $(".addMoneyDiv"),
                success: function (layero, index) {
                },
                yes: function () {
                }
            });
        })

        /*监听充值提交*/
        form.on('submit(addMoneyForm)', function (data) {
            //data.field json对象
            // JSON.stringify(data.field) 字符串化json
            console.log(data.field); //获取格式化的参数
            //执行后台方法
            // reportSave($.param(data.field), 1);
            // reportSave(JSON.stringify(data.field), 1);
            var urlData = "oMoney=" + data.field.omoney+"&type=2";
            goAliPay(urlData);
            return false;
        });

        /*---layui---  */
    });

});