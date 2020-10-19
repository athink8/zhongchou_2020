$(function () {
    layui.use('element', function () {
        var element = layui.element;
    });

    dataSave("/user/info", "", ".userCount");
    dataSave("/project/", "status=-1", ".projectCount");
    dataSave("/project/expand", "pIsDream=1", ".dreamCount");
    dataSave("/project/order", "status=1", ".orderCount");

    /*数据图表生成*/
    var ctx = document.getElementById('myChart').getContext('2d');
    var data1 = [1, 1, 1, 2, 2, 2, 2, 2, 2, 5];
    var data2 =[0, 2, 5, 10, 15, 15, 16, 17, 20, 22];
    var data3 =[1, 2, 3, 4, 4, 4, 4, 4, 5, 7];
    var data4 =[1, 5, 8, 10, 10, 11, 12, 13, 15, 39];

    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            datasets: [
                {
                    label: '用户统计',
                    backgroundColor: "#4B90F9",
                    borderColor: "#4B90F9",
                    data: data1,
                    fill: false,
                }, {
                    label: '总项目统计',
                    backgroundColor: "#4ED383",
                    borderColor: "#4ED383",
                    data: data2,
                    fill: false,
                }, {
                    label: '梦想计划统计',
                    backgroundColor: "#EBD47A",
                    borderColor: "#EBD47A",
                    data: data3,
                    fill: false,
                }, {
                    label: '订单统计',
                    backgroundColor: "#B0AEA4",
                    borderColor: "#B0AEA4",
                    data: data4,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: '10天数据统计'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '日期'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '数量'
                    }
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontSize: 12,
                }
            }
        }
    });

    /*后台获取数据长度并填充统计*/
    function dataSave(url, urlData, select) {
        $.ajax({
            url: url + "?" + urlData,
            type: "GET",
            dataType: "json",
            success: function (res) {
                //这里因为后台数据接口没有统一  只能补救下了 哎..
                if (res.hasOwnProperty("code")) {
                    if (res.code === "200") {
                        $(select).html(res.data.Length);
                    }
                } else if (res.hasOwnProperty("projects")) {
                    $(select).html(res.Length);
                }
            },
            error: function (xhr) {
                //xhr:XMLHttpRequest对象  xhr.responseJSON 获取完整的错误信息
                console.log("服务器错误,错误信息：");
                console.log(xhr.responseJSON);
            }
        });

    }

})