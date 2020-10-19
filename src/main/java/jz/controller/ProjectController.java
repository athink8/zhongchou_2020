package jz.controller;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.codec.Base64Encoder;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.RandomUtil;
import com.alipay.api.AlipayApiException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import jz.entities.po.*;
import jz.entities.vo.MyPageSize;
import jz.entities.vo.MyResponse;
import jz.service.ProjectService;
import jz.service.UserService;
import jz.util.CommonM;
import jz.util.MyAlipayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.time.LocalDateTime;
import java.util.*;


/**
 * author: jz
 * Time: 2020/3/28 22:44
 **/
@RestController
@RequestMapping("/project")
public class ProjectController {
    @Autowired
    ProjectService projectService;
    @Autowired
    UserService userService;
    //记录器
    Logger logger = LoggerFactory.getLogger(getClass());

    /*@GetMapping("/test")
    public String test(DictionaryItem dictionaryItem) {
        return "12444";
    }*/

    /*---------具体的字典值---------------*/
    //查询所有字典值
    @GetMapping("/dictionaryItem")
    public Map<String, Object> dictionaryItem(DictionaryItem dictionaryItem, MyPageSize myPageSize) {
        Map<String, Object> map = new LinkedHashMap<>();
        List<DictionaryItem> dictionaryItems = projectService.findDictionaryItem(dictionaryItem, myPageSize);
        map.put("dictionaryItems", dictionaryItems);
        map.put("Length", dictionaryItems.size());
        return map;
    }

    //更新字典值
    @PostMapping("/dictionaryItem")
    public MyResponse dictionaryItem(@RequestBody DictionaryItem dictionaryItem) {
        MyResponse myResponse = new MyResponse("500", "数据字典更新操作失败");
        Map<String, Object> hashMap = new LinkedHashMap<>();
        int returnId = -1;//返回的ID值 默认-1不存在
        //判断是否更新还是插入
        if (dictionaryItem.getId() != null) {
            System.out.println("执行数据库更新");
            returnId = projectService.updateDictionaryItem(dictionaryItem);
        } else {
            System.out.println("执行数据库插入");
            returnId = projectService.insertDictionaryItem(dictionaryItem);
        }
        //返回实际的项目id
        if (returnId != -1) {
            returnId = dictionaryItem.getId();
            hashMap.put("ditid", returnId);
            myResponse.setCode("200").setMsg("数据字典更新成功").setData(hashMap);
        }
        return myResponse;
    }

    //删除字典值
    @DeleteMapping("/dictionaryItem")
    public MyResponse dictionaryItemDel(@RequestBody DictionaryItem dictionaryItem) {
        MyResponse myResponse = new MyResponse("500", "字典删除失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (dictionaryItem.getId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = projectService.deleteDictionaryItem(dictionaryItem);
            if (b) {
                myResponse.setCode("200").setMsg("信息删除成功");
            }
        }
        return myResponse;
    }

    /*---------字典类型---------------*/
    //查询所有字典类型
    @GetMapping("/dictionaryType")
    public MyResponse dictionaryType(DictionaryType dictionaryType, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "数据字典类型查询失败");
        Map<String, Object> map = new LinkedHashMap<>();
        List<DictionaryType> dictionaryTypes = projectService.findDictionaryType(dictionaryType, myPageSize);
        map.put("dictionaryTypes", dictionaryTypes);
        map.put("Length", dictionaryTypes.size());
        myResponse.setCode("200").setMsg("数据字典类型查询成功").setData(map);
        return myResponse;
    }

    //更新字典类型
    @PostMapping("/dictionaryType")
    public MyResponse dictionaryType(@RequestBody DictionaryType dictionaryType) {
        MyResponse myResponse = new MyResponse("500", "数据字典类型更新失败");
        Map<String, Object> hashMap = new LinkedHashMap<>();
        int returnId = -1;//返回的ID值 默认-1不存在
        //判断是否更新还是插入
        if (dictionaryType.getId() != null) {
            System.out.println("执行数据库更新");
            returnId = projectService.updateDictionaryType(dictionaryType);
        } else {
            System.out.println("执行数据库插入");
            returnId = projectService.insertDictionaryType(dictionaryType);
        }
        //返回实际的项目id
        if (returnId != -1) {
            returnId = dictionaryType.getId();
            hashMap.put("dicid", returnId);
            myResponse.setCode("200").setMsg("数据字典类型更新成功").setData(hashMap);
        }
        return myResponse;
    }

    //删除字典类型
    @DeleteMapping("/dictionaryType")
    public MyResponse dictionaryTypeDel(@RequestBody DictionaryType dictionaryType) {
        MyResponse myResponse = new MyResponse("500", "字典类型删除失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (dictionaryType.getId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = projectService.deleteDictionaryType(dictionaryType);
            if (b) {
                myResponse.setCode("200").setMsg("字典类型删除成功");
            }
        }
        return myResponse;
    }


    /*---------项目拓展--------------*/
    //通过ProjectExpand拓展条件获取所需要项目
    @GetMapping("/expand")
    public Map<String, Object> expand(ProjectExpand projectExpand, ProjectInfo projectInfo, MyPageSize myPageSize, String isBase64Img) {
        //System.out.println(projectExpand);
        Map<String, Object> map = new LinkedHashMap<>();
        if (projectExpand != null) {
            List<ProjectInfo> projects = projectService.findProject(projectExpand, projectInfo, myPageSize);
            System.out.println(projectInfo);
            //这里处理的是不是在线地址就进行图片base64化 isBase64Img是控制因子 默认是
            if (isBase64Img == null || "true".equals(isBase64Img)) {
                imgBase64(projects);
            }
            map.put("Length", projects.size());
            map.put("projects", projects);
        }
        return map;
    }


    //获取项目的所有拓展条件
    @GetMapping("/expand/info")
    public MyResponse expandInfo(ProjectExpand projectExpand, MyPageSize myPageSize) {
        //System.out.println(projectExpand);
        MyResponse myResponse = new MyResponse("500", "操作失败");
        Map<String, Object> hashMap = new LinkedHashMap<>();
        List<ProjectExpand> projectExpands = projectService.findProjectExpand(projectExpand, myPageSize);
        if (projectExpands != null && projectExpands.size() > 0) {
            hashMap.put("projectExpand", projectExpands);
            hashMap.put("Length", projectExpands.size());
            myResponse.setCode("200").setMsg("操作成功").setData(hashMap);
        }
        return myResponse;
    }

    //更新项目的拓展条件
    @PostMapping("/expand/info")
    public MyResponse expandInfo(@RequestBody ProjectExpand projectExpand) {
        System.out.println("來了");
        System.out.println(projectExpand);
        MyResponse myResponse = new MyResponse("500", "操作失败");
        Map<String, Object> hashMap = new LinkedHashMap<>();
        int returnId = -1;//返回的ID值 默认-1不存在
        //判断是否更新还是插入
        if (projectExpand.getId() != null) {
            System.out.println("执行数据库更新");
            returnId = projectService.updateProjectExpand(projectExpand);
        } else if (projectExpand.getPId() != null) {
            System.out.println("执行数据库插入");
            returnId = projectService.insertProjectExpand(projectExpand);
        }
        //返回实际的项目id
        if (returnId != -1) {
            returnId = projectExpand.getId();
            hashMap.put("peid", returnId);
            myResponse.setCode("200").setMsg("信息更新成功").setData(hashMap);
        }
        return myResponse;
    }

    //删除项目的拓展条件
    @DeleteMapping("/expand/info")
    public MyResponse expandInfoDel(@RequestBody ProjectExpand projectExpand) {
        MyResponse myResponse = new MyResponse("500", "操作失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (projectExpand.getId() != null || projectExpand.getPId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = projectService.deleteProjectExpand(projectExpand);
            if (b) {
                myResponse.setCode("200").setMsg("信息删除成功");
            }

        }
        return myResponse;
    }

    /*---------项目基本---------------*/
    //按基本条件查询项目
    @GetMapping("/")
    public Map<String, Object> info(ProjectInfo projectInfo, MyPageSize myPageSize, String hot, String isBase64Img) {
        Map<String, Object> map = new LinkedHashMap<>();
        List<ProjectInfo> projects = projectService.findProject(projectInfo, myPageSize, hot);
        //这里处理的是不是在线地址就进行图片base64化 isBase64Img是控制因子 默认是
        if (isBase64Img == null || "true".equals(isBase64Img)) {
            imgBase64(projects);
        }
        map.put("projects", projects);
        map.put("Length", projects.size());
        return map;
    }

    //通过一堆ids获取所需要项目
    @GetMapping("/info")
    public MyResponse info(@RequestParam("ids") List<Integer> ids, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "查询失败-ids");
        System.out.println(ids);
        List projects = projectService.findProjectByIds(ids, myPageSize);
        System.out.println(projects);
        if (projects.size() > 0) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("projects", projects);
            map.put("Length", projects.size());
            myResponse.setData(map).setCode("200").setMsg("操作成功");
        }
        return myResponse;
    }

    //单独获取项目的内容详情
    @GetMapping("/pContent")
    public String pContent(ProjectInfo projectInfo) {
        System.out.println(projectInfo);
        if (projectInfo.getId() != null) {
            List<ProjectInfo> project = projectService.findProject(projectInfo, null, null);
            if (project.size() > 0) {
                System.out.println(project.get(0).getPContent());
                String filePath = project.get(0).getPContent(); //文件路径+用户名
                String read = null;
                if (filePath != null && !filePath.equals("")) {
                    File file = new File(filePath); //创建文件
                    FileInputStream fileInputStream = IoUtil.toStream(file);
                    read = IoUtil.read(fileInputStream, "UTF-8");
                    return read;
                }
            }
        }
        return "500#数据错误或无数据";
    }

    //更新项目(带文件上传的)
    @PostMapping("/info")
    public MyResponse info(@RequestParam(value = "file", required = false) MultipartFile imgFile, HttpServletRequest request) {

        int returnId = -1;

        //是否有上传文件
        String imgUrl = null;
        if (imgFile != null) {
            if (!imgFile.isEmpty()) {
                try {
                    imgUrl = CommonM.upLoadFile(imgFile.getInputStream(), imgFile.getOriginalFilename(), 1, request);
                } catch (IOException e) {
                    e.printStackTrace();
                    logger.error("文件上传失败！" + Arrays.toString(e.getStackTrace()));
                }
            }
        }

        //是否有html編輯的內容
        String htmlFile = request.getParameter("htmlFile");
        String pid1 = request.getParameter("pid"); //当前项目id
        int pid;
        if (htmlFile != null && pid1 != null && !pid1.equals("") && !pid1.equals("null")) {
            pid = Integer.parseInt(pid1);
            System.out.println(pid + ": " + htmlFile);
            InputStream inputStream = IoUtil.toUtf8Stream(htmlFile);
            String upLoadFile = CommonM.upLoadFile(inputStream, "up.html", 3, request);
            returnId = upDateProjectInfo(new ProjectInfo().setId(pid).setPContent(upLoadFile));
        }

        //更新数据
        //获取传入的ProjectInfo值
        String data = request.getParameter("data");
        if (data != null) {
            try {
                System.out.println("y：" + data);
                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                ProjectInfo projectInfo = mapper.readValue(data, ProjectInfo.class);
                //更新上传的头图片路径
                if (imgUrl != null) {
                    projectInfo.setPHeadImg(imgUrl);
                }
                System.out.println(projectInfo);
                projectInfo.setUserInfo((UserInfo) request.getSession().getAttribute("nowUser"));
                projectInfo.setPStage(new DictionaryItem().setItemCode(1));
                projectInfo.setPNowMoney("0");
                projectInfo.setPSupportNum(0);
                returnId = upDateProjectInfo(projectInfo);
            } catch (Exception e) {
                logger.error("操作失败失败！" + e.getMessage());
            }
        }

        //返回值
        if (returnId != -1) {
            Map<String, Object> hashMap = new LinkedHashMap<>();
            hashMap.put("pid", returnId);
            return new MyResponse("200", "信息更新成功")
                    .setData(hashMap);
        }
        return new MyResponse("500", "操作失败");
    }

    //更新项目2(不带文件上传的)
    @PostMapping("/info2")
    public MyResponse reports(@RequestBody ProjectInfo projectInfo) {
        MyResponse myResponse = new MyResponse("500", "项目更新2操作失败");
        System.out.println(projectInfo);
        Map<String, Object> hashMap = new LinkedHashMap<>();
        if (projectInfo != null) {
            int returnId = upDateProjectInfo(projectInfo);
            //返回实际的项目id
            if (returnId != -1) {
                returnId = projectInfo.getId();
                hashMap.put("pid", returnId);
                myResponse.setCode("200").setMsg("信息更新成功").setData(hashMap);
            }
        }
        return myResponse;
    }

    //删除项目
    @DeleteMapping("/info")
    public MyResponse infoDel(@RequestBody ProjectInfo projectInfo) {
        MyResponse myResponse = new MyResponse("500", "操作失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (projectInfo.getId() != null) {
            isGo = true;
        }
        if (projectInfo.getUserInfo() != null) {
            if (projectInfo.getUserInfo().getId() != null) {
                isGo = true;
            }
        }
        if (isGo) {
            boolean b = projectService.deleteProject(projectInfo);
            if (b) {
                myResponse.setCode("200").setMsg("信息删除成功");
            }

        }
        return myResponse;
    }

    /*---------项目回报---------------*/
    //查询项目回报
    @GetMapping("/report")
    public MyResponse reports(ProjectReport projectReport, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "操作失败");
        List<ProjectReport> projectReports = projectService.findProjectReport(projectReport, myPageSize);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("reports", projectReports);
        map.put("Length", projectReports.size());
        myResponse.setData(map).setCode("200").setMsg("操作成功");
        return myResponse;
    }

    //更新项目回报
    @PostMapping("/report")
    public MyResponse reports(@RequestBody ProjectReport projectReport) {
        MyResponse myResponse = new MyResponse("500", "操作失败");
        Map<String, Object> hashMap = new LinkedHashMap<>();
        int returnId = -1;//返回的ID值 默认-1不存在
        //判断是否更新还是插入
        if (projectReport.getId() != null) {
            System.out.println("执行数据库更新");
            returnId = projectService.updateProjectReport(projectReport);
        } else if (projectReport.getRId() != null && projectReport.getPId() != null) {
            System.out.println("执行数据库插入");
            returnId = projectService.insertProjectReport(projectReport);
        }
        //返回实际的项目id
        if (returnId != -1) {
            returnId = projectReport.getId();
            hashMap.put("rid", returnId); //返回的是主键id而不是rid
            myResponse.setCode("200").setMsg("信息更新成功").setData(hashMap);
        }
        return myResponse;
    }

    //删除项目回报
    @DeleteMapping("/report")
    public MyResponse reportsDel(@RequestBody ProjectReport projectReport) {
        MyResponse myResponse = new MyResponse("500", "操作失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (projectReport.getId() != null) {
            isGo = true;
        }
        if (projectReport.getRId() != null && projectReport.getPId() != null) {
            isGo = true;
        }
        if (projectReport.getPId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = projectService.deleteProjectReport(projectReport);
            if (b) {
                myResponse.setCode("200").setMsg("信息删除成功");
            }

        }
        return myResponse;
    }

    /*---------联系信息----------------*/
    //查询项目联系信息
    @GetMapping("/connectionInfo")
    public MyResponse connectionInfo(ProjectConnectionInfo projectConnectionInfo, MyPageSize myPageSize) {
        System.out.println(projectConnectionInfo);
        List<ProjectConnectionInfo> connectionInfo = projectService.findProjectConnectionInfo(projectConnectionInfo, myPageSize);
        MyResponse myResponse = new MyResponse("500", "操作失败");
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("connectionInfo", connectionInfo);
        map.put("Length", connectionInfo.size());
        myResponse.setData(map).setCode("200").setMsg("操作成功");
        return myResponse;
    }

    //更新项目联系信息
    @PostMapping("/connectionInfo")
    public MyResponse connectionInfo(ProjectConnectionInfo projectConnectionInfo) {
        MyResponse myResponse = new MyResponse("500", "操作失败");
        Map<String, Object> hashMap = new LinkedHashMap<>();
        int returnId = -1;//返回的ID值 默认-1不存在
        //判断是否更新还是插入
        if (projectConnectionInfo.getId() != null) {
            System.out.println("执行数据库更新");
            returnId = projectService.updateProjectConnectionInfo(projectConnectionInfo);
        } else {
            System.out.println("执行数据库插入");
            returnId = projectService.insertProjectConnectionInfo(projectConnectionInfo);
        }
        //返回实际的项目id
        if (returnId != -1) {
            returnId = projectConnectionInfo.getId();
            hashMap.put("pcid", returnId);
            myResponse.setCode("200").setMsg("信息更新成功").setData(hashMap);
        }
        return myResponse;
    }

    //删除项目联系信息
    @DeleteMapping("/connectionInfo")
    public MyResponse connectionInfoDel(ProjectConnectionInfo projectConnectionInfo) {
        MyResponse myResponse = new MyResponse("500", "操作失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (projectConnectionInfo.getId() != null) {
            isGo = true;
        }
        if (projectConnectionInfo.getPId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = projectService.deleteProjectConnectionInfo(projectConnectionInfo);
            if (b) {
                myResponse.setCode("200").setMsg("信息删除成功");
            }
        }
        return myResponse;
    }

    /*---------项目支持----------------*/
    //查询项目支持信息
    @GetMapping("/support")
    public MyResponse support(ProjectSupport projectSupport, MyPageSize myPageSize) {
        System.out.println(projectSupport);
        List<ProjectSupport> projectSupports = projectService.findProjectSupport(projectSupport, myPageSize);
        MyResponse myResponse = new MyResponse("500", "项目支持操作失败");
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("projectSupports", projectSupports);
        map.put("Length", projectSupports.size());
        myResponse.setData(map).setCode("200").setMsg("操作成功");
        return myResponse;
    }

    //通过用户id支持信息查出项目
    @GetMapping("/supportP")
    public MyResponse supportP(ProjectSupport projectSupport, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "项目支持操作失败");
        System.out.println(projectSupport);
        List<Integer> ids = new ArrayList<>();
        if (projectSupport != null) {
            if (projectSupport.getUId() != null) {
                //通过用户id查询所有支持的信息
                List<ProjectSupport> projectSupport1 = projectService.findProjectSupport(projectSupport, myPageSize);
                for (ProjectSupport ps : projectSupport1) {
                    ids.add(ps.getPId());
                }
            }
            List<ProjectInfo> projects = new ArrayList<>();
            if (ids.size() > 0) {
                projects = projectService.findProjectByIds(ids, myPageSize);
            }
            Map<String, Object> map = new LinkedHashMap<>();
            System.out.println();
            map.put("Length", projects.size());
            map.put("projects", projects);
            myResponse.setData(map).setCode("200").setMsg("操作成功");
        }
        return myResponse;
    }

    //更新项目支持
    @PostMapping("/support")
    public MyResponse support(ProjectSupport projectSupport) {
        MyResponse myResponse = new MyResponse("500", "项目支持操作失败");
        Map<String, Object> hashMap = new LinkedHashMap<>();
        int returnId = -1;//返回的ID值 默认-1不存在
        if (projectSupport != null) {
            //判断是否更新还是插入
            if (projectSupport.getId() != null) {
                System.out.println("执行数据库更新");
                returnId = projectService.updateProjectSupport(projectSupport);
            } else {
                System.out.println("执行数据库插入");
                returnId = projectService.insertProjectSupport(projectSupport);
            }
            //返回实际的项目id
            if (returnId != -1) {
                returnId = projectSupport.getId();
                hashMap.put("pcid", returnId);
                myResponse.setCode("200").setMsg("信息更新成功").setData(hashMap);
            }
        }
        return myResponse;
    }

    //删除项目支持
    @DeleteMapping("/support")
    public MyResponse supportDel(ProjectSupport projectSupport) {
        MyResponse myResponse = new MyResponse("500", "项目支持操作失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (projectSupport != null) {
            if (projectSupport.getId() != null) {
                isGo = true;
            }
        }
        if (isGo) {
            boolean b = projectService.deleteProjectSupport(projectSupport);
            if (b) {
                myResponse.setCode("200").setMsg("信息删除成功");
            }
        }
        return myResponse;
    }

    /*---------项目订单----------------*/
    //查询项目订单
    @GetMapping("/order")
    public MyResponse order(ProjectOrder projectOrder, MyPageSize myPageSize) {
        System.out.println(projectOrder);
        List<ProjectOrder> projectOrders = projectService.findProjectOrder(projectOrder, myPageSize);
        MyResponse myResponse = new MyResponse("500", "订单查询失败");
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("Length", projectOrders.size());
        map.put("projectOrders", projectOrders);
        myResponse.setData(map).setCode("200").setMsg("操作成功");
        return myResponse;
    }

    //更新项目订单
    @PostMapping("/order")
    public MyResponse order(@RequestBody ProjectOrder projectOrder, HttpServletRequest request) {
        System.out.println(projectOrder);
        MyResponse myResponse = new MyResponse("500", "项目支持操作失败");
        Map<String, Object> hashMap = new LinkedHashMap<>();
        int returnId = -1;//返回的ID值 默认-1不存在
        if (projectOrder != null) {
            //判断是否更新还是插入
            if (projectOrder.getId() != null) {
                System.out.println("执行数据库更新");

                int isG = 0; //控制一直向下的因子
                UserInfo nowUser = (UserInfo) request.getSession().getAttribute("nowUser");
                if (nowUser == null) {
                    return myResponse.setMsg("当前登录已过期，请重新刷新再试！");
                }

                //先更新订单内容
                System.out.println("第0阶段：更新订单内容");
                projectService.updateProjectOrder(projectOrder);

                //查询项目回报库存  //这里待定使用数据库加锁 悲观锁 for update
                //rid为空时为无偿支持 无需此步 注意别让它查询 会报错
                ProjectReport projectReport = null;
                System.out.println("第一阶段：查询库存");
                if (projectOrder.getRId() != null) {
                    //查询数据库
                    List<ProjectReport> projectReports =
                            projectService.findProjectReport(new ProjectReport().setId(projectOrder.getRId()), null);
                    if (projectReports != null && projectReports.size() > 0) {
                        projectReport = projectReports.get(0);
                        //有库存且没超过单笔限额  //这里留个坑 当同个用户再次下单呢?
                        System.out.println(projectReport.getRAllAmount());
                        System.out.println(projectReport.getROneAmount());
                        System.out.println(projectOrder.getONum());
                        if (projectReport.getRAllAmount() > 0 && projectOrder.getONum() <= projectReport.getROneAmount()) {
                            isG = 1;
                        } else {
                            myResponse.setMsg("库存不足");
                        }
                    }
                } else {
                    isG = 1;
                }

                //如果是支付宝支付后
                if (projectOrder.getOTradeId() != null) {
                    isG = 2;
                }

                //查询付款方法
                if (isG == 1) {
                    System.out.println("第二阶段：支付");
                    if (projectOrder.getOPayType().getItemCode() == 1) {
                        //-余额支付
                        //查询个人财富
                        List<UserProperty> userProperties =
                                userService.findUserProperty(new UserProperty().setUId(nowUser.getId()), null);
                        if (userProperties != null && userProperties.size() > 0) {
                            UserProperty userProperty = userProperties.get(0);
                            Double userMoney = Double.valueOf(userProperty.getUpCount()); //用户财富
                            Double payMoney = Double.valueOf(projectOrder.getOMoney()); //订单金额
                            if (userMoney >= payMoney) {
                                //更新个人财富
                                String endMoney = String.valueOf(userMoney - payMoney);
                                userProperty.setUpCount(endMoney).setUpCountDate(CommonM.formatDate(LocalDateTime.now(), null));
                                int i = userService.updateUserProperty(userProperty);
                                if (i != -1) {
                                    projectOrder.setOTradeId(RandomUtil.randomString(28));
                                    isG = 2;
                                }
                            } else {
                                myResponse.setMsg("余额不足! 当前余额：" + userMoney + "元");
                            }
                        }
                    } else if (projectOrder.getOPayType().getItemCode() == 2) {
                        //-支付宝支付
                        System.out.println("支付寶支付");
                        try {
                            hashMap.put("toAliPay", MyAlipayUtils.aliPay(projectOrder, 1));
                        } catch (AlipayApiException e) {
                            e.printStackTrace();
                        }
                        //返回重定向支付宝页面
                        myResponse.setCode("302").setMsg("前往支付寶支付").setData(hashMap);
                        return myResponse;
                    }
                }

                //更新项目回报库存
                if (isG == 2) {
                    System.out.println("第三阶段：更新庫存");
                    //如果不是无偿支付才需更新库存
                    if (projectReport != null) {
                        int haveNum = projectReport.getRAllAmount(); //库存数量
                        int oNum = projectOrder.getONum(); //订单数量
                        int endNum = haveNum - oNum;
                        if (endNum < 0) {
                            endNum = 0;
                        }
                        int i = projectService.updateProjectReport(projectReport.setRAllAmount(endNum));
                        if (i != -1) {
                            isG = 3;
                        }
                    } else {
                        isG = 3;
                    }
                }

                //更新项目支持
                if (isG == 3) {
                    System.out.println("第四阶段：更新项目支持");
                    int i = -1;
                    ProjectSupport projectSupport = new ProjectSupport(null, nowUser.getId(), projectOrder.getPId(),
                            projectOrder.getOMoney(), CommonM.formatDate(LocalDateTime.now(), null), "1");
                    i = projectService.insertProjectSupport(projectSupport);
                   /* List<ProjectSupport> projectSupports1 = projectService.findProjectSupport(projectSupport, null);
                    //先查询是否存在
                    projectSupport.setSMoney(projectOrder.getOMoney()).setSDate(CommonM.formatDate(LocalDateTime.now(), null)).setStatus("1");
                    if (projectSupports1 != null && projectSupports1.size() > 0) {
                        //更新
                        projectSupport.setId(projectSupports1.get(0).getId());
                        i = projectService.updateProjectSupport(projectSupport);
                    } else {
                        //插入
                        i = projectService.insertProjectSupport(projectSupport);
                    }*/

                    if (i != -1) {
                        isG = 4;
                    }
                }

                //更新项目当前金额和支持数
                if (isG == 4) {
                    System.out.println("第五阶段：更新项目支持数");
                    ProjectInfo projectInfo = new ProjectInfo();
                    projectInfo.setId(projectOrder.getPId());
                    List<ProjectInfo> projects = projectService.findProject(projectInfo, null, null);
                    if (projects != null && projects.size() > 0) {
                        projectInfo = projects.get(0);
                        int sNum = projectInfo.getPSupportNum();
                        int nowMoney = Integer.parseInt(projectInfo.getPNowMoney())
                                + Integer.parseInt(projectOrder.getOMoney());
                        projectInfo.setPNowMoney(String.valueOf(nowMoney));
                        projectInfo.setPSupportNum(sNum + 1);
                        int i = projectService.upDateProject(projectInfo);
                        if (i != -1) {
                            isG = 5;
                        }
                    }
                }

                //5.更新订单状态 返回当前订单号
                if (isG == 5) {
                    System.out.println("第六阶段：更新订单状态");
                    projectOrder.setOPayTime(CommonM.formatDate(LocalDateTime.now(), null));
                    projectOrder.setOType(new DictionaryItem("2"));
                    returnId = projectService.updateProjectOrder(projectOrder);
                }


            } else {
                System.out.println("执行数据库插入");
                //rid为-1时为无偿支持 无需值 注意它的值会一一对应 否则会报错
                if (projectOrder.getRId() != null) {
                    if (-1 == projectOrder.getRId()) {
                        projectOrder.setRId(null);
                    }
                }
                projectOrder.setOCreateTime(CommonM.formatDate(LocalDateTime.now(), "yyyy-MM-dd HH:mm:ss"));
                projectOrder.setStatus("1");
                projectOrder.setOId(RandomUtil.simpleUUID());
                //以下订单状态类型和付款类型必须先默认 否则无法查询
                projectOrder.setOType(new DictionaryItem().setItemCode(1));
                projectOrder.setOPayType(new DictionaryItem().setItemCode(1));
                returnId = projectService.insertProjectOrder(projectOrder);
            }

            //返回实际的订单id
            if (returnId != -1) {
                returnId = projectOrder.getId();
                hashMap.put("oid", returnId); //返回的是自增id不是订单号
                myResponse.setCode("200").setMsg("订单更新成功").setData(hashMap);
            }
        }
        return myResponse;
    }

    //删除项目订单
    @DeleteMapping("/order")
    public MyResponse orderDel(@RequestBody ProjectOrder projectOrder) {
        MyResponse myResponse = new MyResponse("500", "订单删除失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (projectOrder != null) {
            if (projectOrder.getId() != null) {
                isGo = true;
            }
        }
        if (isGo) {
            boolean b = projectService.deleteProjectOrder(projectOrder);
            if (b) {
                myResponse.setCode("200").setMsg("订单删除成功");
            }
        }
        return myResponse;
    }

    /*---------项目发布----------------*/
    @PostMapping("/publish")
    public MyResponse pPublish(@RequestBody ProjectInfo projectInfo, HttpServletRequest request) {
        MyResponse myResponse = new MyResponse("500", "项目发布失败");
        UserInfo nowUser = (UserInfo) request.getSession().getAttribute("nowUser");
        //System.out.println(projectInfo);
        //System.out.println(nowUser);
        if (projectInfo != null && nowUser != null) {
            if (projectInfo.getId() != null && nowUser.getId() != null) {
                int i = -1;
                projectInfo.setUserInfo(nowUser);
                projectInfo.setPPublishDate(LocalDateTime.now().toString());
                projectInfo.setPIsPublish(1);
                //更新基本项目信息
                i = projectService.upDateProject(projectInfo);
                //更新项目拓展信息
                List<ProjectExpand> projectExpands =
                        projectService.findProjectExpand(new ProjectExpand().setPId(projectInfo.getId()), null);
                if (projectExpands.size() <= 0) {
                    ProjectExpand projectExpand = new ProjectExpand(null, 0, 0, 0, projectInfo.getId(), 1);
                    i = projectService.insertProjectExpand(projectExpand);
                }

                if (i != -1) {
                    myResponse.setCode("200").setMsg("发布成功");
                }
            }
        }
        return myResponse;
    }

    /*--------支付模块----------*/
    /*前往支付页面*/
    @GetMapping("/aliPay")
    public String aliPay(ProjectOrder projectOrder, int type) {
        try {
            return MyAlipayUtils.aliPay(projectOrder, type);
        } catch (AlipayApiException e) {
            e.printStackTrace();
        }
        return "支付宝支付错误！";
    }

    /*项目支付成功返回同步页面*/
    @GetMapping("/aliPay/return")
    public String aliPayReturn(HttpServletRequest request, HttpServletRequest response) {
        ProjectOrder projectOrder = null;
        try {
            projectOrder = MyAlipayUtils.aliPayReturn(request, response);
        } catch (AlipayApiException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        //判断是否支付成功
        if (projectOrder != null) {
            //执行
            List<ProjectOrder> projectOrders = projectService.findProjectOrder(new ProjectOrder().setOId(projectOrder.getOId()), null);
            if (projectOrders != null && projectOrders.size() > 0) {
                projectOrders.get(0).setOTradeId(projectOrder.getOTradeId());
                projectOrder = projectOrders.get(0);
                //projectService.updateProjectOrder(projectOrder);
                //System.out.println(projectOrder);
                MyResponse myResponse = order(projectOrder, request);
                System.out.println(myResponse);
                if (myResponse.getCode().equals("200")) {
                    if (myResponse.getData() != null) {
                        String oid = String.valueOf(myResponse.getData().get("oid"));
                        String oid1 = Base64Encoder.encodeUrlSafe(oid);
                        System.out.println(oid1);
                        return "<script type=\"text/javascript\">" +
                                "  location.href='/projectOrder?oid=" + oid1 + "'" +
                                "</script>";
                    }
                }
            }
        }
        return "支付宝支付出现异常了！<a href='/'>返回首页</a>";
    }

    /*项目支付宝异步 通知页面*/
    @PostMapping("/aliPay/notify")
    public String alipayNotifyNotice(HttpServletRequest request, HttpServletRequest response) throws Exception {
        ProjectOrder projectOrder = null;
        try {
            projectOrder = MyAlipayUtils.alipayNotifyNotice(request, response);
        } catch (AlipayApiException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        //判断是否支付成功
        if (projectOrder != null) {
            //执行
        }
        return null;
    }

    /*充值支付成功返回同步页面*/
    @GetMapping("/aliPay/return2")
    public String aliPayReturn2(HttpServletRequest request, HttpServletRequest response) {
        ProjectOrder projectOrder = null;
        try {
            projectOrder = MyAlipayUtils.aliPayReturn(request, response);
        } catch (AlipayApiException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        //判断是否支付成功
        if (projectOrder != null) {
            //执行
            UserInfo userInfo = (UserInfo) request.getSession().getAttribute("nowUser");
            System.out.println(projectOrder);
            if (userInfo == null) {
                return "当前用户已过期，请重新刷新..<a href='/'>返回首页</a>";
            }
            //插入订单
            projectOrder.setOType(new DictionaryItem("2"));
            projectOrder.setOPayType(new DictionaryItem("2"));
            projectOrder.setOCreateTime(CommonM.formatDate(LocalDateTime.now(), null));
            projectOrder.setOPayTime(CommonM.formatDate(LocalDateTime.now(), null));
            projectOrder.setOName("个人资金充值");
            projectOrder.setStatus("1");
            projectOrder.setUId(userInfo.getId());
            projectService.insertProjectOrder(projectOrder);

            //更新个人财富
            UserProperty userProperty = new UserProperty();
            userProperty.setUId(userInfo.getId());
            List<UserProperty> userProperties = userService.findUserProperty(userProperty, null);
            if (userProperties != null && userProperties.size() > 0) {
                Double userMoney = Double.parseDouble(userProperties.get(0).getUpCount()); //用户财富
                Double payMoney = Double.valueOf(projectOrder.getOMoney()); //订单金额
                Double endMoney = userMoney + payMoney;
                userProperties.get(0).setUpCount(String.valueOf(endMoney));
                userProperty = userProperties.get(0);
            }
            userProperty.setUpCountDate(CommonM.formatDate(LocalDateTime.now(), null));
            userService.updateUserProperty(userProperty);
            return "<script type=\"text/javascript\">" +
                    "  location.href='/userInfo?uid=" + userInfo.getId() + "'" +
                    "</script>";
        }
        return "支付宝支付出现异常了！<a href='/'>返回首页</a>";
    }

    /*---------项目评论----------------*/
    //查询项目评论
    @GetMapping("/comment")
    public MyResponse support(Comment comment, MyPageSize myPageSize) {
        System.out.println(comment);
        List<Comment> comments = projectService.findComment(comment, myPageSize);
        MyResponse myResponse = new MyResponse("500", "项目评论查询失败");
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("comments", comments);
        map.put("Length", comments.size());
        myResponse.setData(map).setCode("200").setMsg("操作成功");
        return myResponse;
    }

    //更新项目评论
    @PostMapping("/comment")
    public MyResponse comment(@RequestBody Comment comment, HttpServletRequest request) {
        MyResponse myResponse = new MyResponse("500", "项目评论操作失败");
        UserInfo nowUser = (UserInfo) request.getSession().getAttribute("nowUser");
        if (nowUser == null) {
            return myResponse.setMsg("当前用户未登录！");
        }
        Map<String, Object> hashMap = new LinkedHashMap<>();
        int returnId = -1;//返回的ID值 默认-1不存在
        if (comment != null) {
            comment.setUId(nowUser.getId()).setCmName(nowUser.getUUsername());
            System.out.println(comment);
            //判断是否更新还是插入
            if (comment.getId() != null) {
                System.out.println("执行数据库更新");
                returnId = projectService.updateComment(comment);
            } else {
                System.out.println("执行数据库插入");
                comment.setStatus("1");
                comment.setCmCreateDate(CommonM.formatDate(LocalDateTime.now(), null));
                returnId = projectService.insertComment(comment);
            }
            //返回实际的项目id
            if (returnId != -1) {
                returnId = comment.getId();
                hashMap.put("cmid", returnId);
                myResponse.setCode("200").setMsg("信息更新成功").setData(hashMap);
            }
        }
        return myResponse;
    }

    //删除项目评论
    @DeleteMapping("/comment")
    public MyResponse commentDel(Comment comment) {
        MyResponse myResponse = new MyResponse("500", "项目评论操作失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (comment != null) {
            if (comment.getId() != null) {
                isGo = true;
            }
        }
        if (isGo) {
            boolean b = projectService.deleteComment(comment);
            if (b) {
                myResponse.setCode("200").setMsg("项目评论删除成功");
            }
        }
        return myResponse;
    }

    /*---------公共私有方法----------------*/
    /*更新項目基础信息的数据库方法*/
    private int upDateProjectInfo(ProjectInfo projectInfo) {
        int returnId = -1;//返回的ID值 默认-1不存在
        //判断是否更新还是插入
        if (projectInfo.getId() != null) {
            System.out.println("执行数据库更新");
            returnId = projectService.upDateProject(projectInfo);
        } else {
            System.out.println("执行数据库插入");
            returnId = projectService.insertProject(projectInfo);
        }
        //返回实际的项目id
        if (returnId != -1) {
            returnId = projectInfo.getId();
        }
        return returnId;
    }

    /*这里处理的是不是在线地址就进行图片base64化*/
    private void imgBase64(List<ProjectInfo> projects) {
        for (ProjectInfo project : projects) {
            if (!project.getPHeadImg().contains("http:") || !project.getPHeadImg().contains("https:")) {
                File imgFile = new File(project.getPHeadImg());
                if (FileUtil.exist(imgFile)) {
                    project.setPHeadImg("data:image/jpg;base64," + Base64.encode(imgFile));
                }
            }
        }
    }
}
