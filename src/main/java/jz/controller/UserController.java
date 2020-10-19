package jz.controller;

import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import jz.entities.po.*;
import jz.entities.vo.MailBean;
import jz.entities.vo.MyPageSize;
import jz.entities.vo.MyResponse;
import jz.service.MailService;
import jz.service.UserService;
import jz.util.CommonM;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.util.SavedRequest;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * author: jz
 * Time: 2020/4/17 21:35
 **/

@RequestMapping("/user")
@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    protected MailService mailService;

    @RequestMapping("/test")
    public Object login(HttpServletRequest request) {
        System.out.println(SecurityUtils.getSubject().getSession().getAttribute("currentUserId"));
        return SecurityUtils.getSubject().getSession().getAttribute("currentUserId");
    }

    /*--------登录注册模块-------------*/
    /*登录*/
    @GetMapping("/login")
    public MyResponse login(UserInfo userInfo, HttpServletRequest request, String rememberMe) {
        MyResponse myResponse = new MyResponse("500", "登录发生错误");
        System.out.println(userInfo);
        System.out.println(rememberMe);
        //登录判断控制
        if (userInfo != null) {
            if (!StrUtil.hasEmpty(userInfo.getUUsername(), userInfo.getUPassword())) {
                UsernamePasswordToken token = new UsernamePasswordToken(userInfo.getUUsername(), userInfo.getUPassword());
                Subject currentUser = SecurityUtils.getSubject();
                //保留拦截前的地址
                String rUrl = null;
                if (currentUser.getSession(false) != null) {
                    SavedRequest reqUrl = WebUtils.getSavedRequest(request);
                    if (reqUrl != null) {
                        rUrl = reqUrl.getRequestUrl();
                    }
                }
                //是否记住我
                if ("on".equals(rememberMe)) {
                    token.setRememberMe(true);
                }
                //登录判断
                try {
                    //主体提交登录请求到SecurityManager
                    currentUser.login(token);
                } catch (IncorrectCredentialsException ice) {
                    myResponse.setMsg("该账号或密码不正确");
                } catch (UnknownAccountException uae) {
                    myResponse.setMsg("该账号不存在");
                } catch (AuthenticationException ae) {
                    myResponse.setMsg("该账号已被锁定");
                }
                //登录成功
                if (currentUser.isAuthenticated() || currentUser.isRemembered()) {
                    System.out.println("认证成功");
                    HashMap<String, Object> map = new LinkedHashMap<>();
                    map.put("userInfo", (UserInfo) currentUser.getPrincipal());
                    map.put("rUrl", rUrl);
                    myResponse.setCode("200").setMsg("认证成功").setData(map);
                    System.out.println((UserInfo) currentUser.getPrincipal());
                    request.getSession().setAttribute("nowUser", (UserInfo) currentUser.getPrincipal());
                } else {
                    token.clear();
                }
            }
        }

        return myResponse;
    }

    /*退出登录*/
    @GetMapping("/loginOut")
    public MyResponse loginOut(HttpServletRequest request) {
        Subject currentUser = SecurityUtils.getSubject();
        currentUser.logout();
        request.getSession().removeAttribute("nowUser");
        request.getSession().invalidate();
        MyResponse myResponse = new MyResponse("200", "登录退出成功");
        return myResponse;
    }

    /*注册*/
    @PostMapping("/regist")
    public MyResponse regist(@RequestBody UserInfo userInfo, HttpServletRequest request) {
        MyResponse myResponse = new MyResponse("500", "注册发生错误");
        System.out.println(userInfo);
        //注册控制
        if (userInfo != null) {

            //先查询并删除已经邮箱注册但未验证的用户
            List<UserInfo> userInfo1 = userService.findUserInfo(new UserInfo().setUEmail(userInfo.getUEmail()), null);
            if (userInfo1 != null && userInfo1.size() > 0) {
                if (userInfo1.get(0).getStatus().equals("0")) {
                    userService.deleteUserInfo(userInfo1.get(0));
                }
            }

            String code = RandomUtil.randomString(25);
            userInfo.setCode(code);
            userInfo.setStatus("0");
            userInfo.setULock("0");
            String password = new SimpleHash("MD5", userInfo.getUPassword(), "" + userInfo.getUEmail(), 11).toString();
            userInfo.setUPassword(password);
            if (sendEmail(userInfo)) {
                userService.insertUserInfo(userInfo);
                myResponse.setCode("200").setMsg("注册成功！");
            }

        }
        return myResponse;
    }

    /*邮件校验和激活用户*/
    @RequestMapping("/checkMail")
    public String checkMail(UserInfo userInfo, HttpServletResponse response) {
        String s = "<br><p style='font-size: 23px;text-align: center;'>邮件校验发生错误！<br><br>" +
                "返回<a href=\"http://localhost:8081/\">主页</a></p>";
        //校验用户
        List<UserInfo> userInfos = userService.findUserInfo(userInfo, null);
        if (userInfos != null && userInfos.size() > 0) {
            //当前用户已激活
            if (userInfos.get(0).getStatus().equals("1")) {
                s = "<script>alert(\"当前用户已经邮箱检验过或无需校验，请勿重复操作！\");" +
                        "window.location = \"/\";" + "</script>";
                return s;
            }
            //立刻激活
            int i = userService.updateUserInfo(userInfos.get(0).setStatus("1"));
            if (i != -1) {
                //初始化个人财富
                UserProperty userProperty = new UserProperty();
                userProperty.setUpCount("0").setUpCountDate(CommonM.formatDate(LocalDateTime.now(), null));
                userProperty.setUpLock("0").setUId(userInfos.get(0).getId()).setStatus("1");
                int p = userService.insertUserProperty(userProperty);
                if (p == -1) {
                    s = "出现未知错误，可能个人用户财产初始化出错，请联系管理员..";
                }
                //初始化个人权限
                UserRole userRole = new UserRole();
                userRole.setUserInfo(new UserInfo().setId(userInfos.get(0).getId()));
                List<UserRole> userRoles = userService.findUserRole(userRole, null);
                if (userRoles != null) {
                    if (userRoles.size() <= 0) {
                        userRole = userRole.setRole(new Role().setId(2));
                        userService.insertUserRole(userRole);
                    }
                }
                if (p == -1) {
                    s = "出现未知错误，可能个人权限初始化出错，请联系管理员..";
                }

                //返回前台
                s = "<br><p style='font-size: 23px;text-align: center;'>邮件校验成功！<br><br>" +
                        "请点击前往<a href=\"http://localhost:8081/toLogin\">登录</a>" +
                        "或者<a href=\"http://localhost:8081/\">主页</a></p>";
            }
        }
        return s;
    }

    /*--------用户基本信息模块-------------*/
    @GetMapping("/info")
    public MyResponse info(UserInfo userInfo, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "用户查询错误");
        System.out.println(userInfo);
        List<UserInfo> userInfos = userService.findUserInfo(userInfo, myPageSize);
        if (userInfos != null) {
            HashMap<String, Object> map = new LinkedHashMap<>();
            map.put("userInfos", userInfos);
            map.put("Length", userInfos.size());
            myResponse.setCode("200").setMsg("查询成功！").setData(map);
        }
        return myResponse;
    }

    //通过一堆ids获取所需要项目
    @GetMapping("/info/ids")
    public MyResponse info(@RequestParam(value = "ids", required = false) List<Integer> ids, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "查询失败-ids");
        System.out.println(ids);
        List userInfos = userService.findUserInfoByIds(ids, myPageSize);
        if (userInfos.size() > 0) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("userInfos", userInfos);
            map.put("Length", userInfos.size());
            myResponse.setData(map).setCode("200").setMsg("操作成功");
        }
        return myResponse;
    }

    @PostMapping("/info")
    public MyResponse info(@RequestBody UserInfo userInfo) {
        MyResponse myResponse = new MyResponse("500", "用户更新错误");
        System.out.println(userInfo);
        if (userInfo != null) {
            if (userInfo.getUPassword() != null) {
                String password = new SimpleHash("MD5", userInfo.getUPassword(), "" + userInfo.getUEmail(), 11).toString();
                userInfo.setUPassword(password);
            }
            int i = -1;
            if (userInfo.getId() != null) {
                i = userService.updateUserInfo(userInfo);
            } else {
                i = userService.insertUserInfo(userInfo);
                //初始化个人财富
                List<UserProperty> userProperties = userService.findUserProperty(new UserProperty().setUId(i), null);
                if (userProperties != null && userProperties.size() <= 0) {
                    UserProperty userProperty = new UserProperty();
                    userProperty.setUpCount("0").setUpCountDate(CommonM.formatDate(LocalDateTime.now(), null));
                    userProperty.setUpLock("0").setUId(userInfo.getId()).setStatus("1");
                    userService.insertUserProperty(userProperty);
                }

                //初始化个人权限
                UserRole userRole = new UserRole();
                userRole.setUserInfo(new UserInfo().setId(i));
                List<UserRole> userRoles = userService.findUserRole(userRole, null);
                if (userRoles != null) {
                    if (userRoles.size() <= 0) {
                        userRole = userRole.setRole(new Role().setId(2));
                        userService.insertUserRole(userRole);
                    }
                }
            }
            if (i != -1) {
                HashMap<String, Object> map = new LinkedHashMap<>();
                map.put("uid", userInfo.getId());
                myResponse.setCode("200").setMsg("用户更新成功！").setData(map);
            }
        }
        return myResponse;
    }

    //删除项目
    @DeleteMapping("/info")
    public MyResponse infoDel(@RequestBody UserInfo userInfo) {
        MyResponse myResponse = new MyResponse("500", "操作失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (userInfo.getId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = userService.deleteUserInfo(userInfo);
            if (b) {
                myResponse.setCode("200").setMsg("信息删除成功");
            }

        }
        return myResponse;
    }

    /*--------用户身份证信息模块-------------*/
    @GetMapping("/idCard")
    public MyResponse idCard(UserIdCard userIdCard, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "用户身份证信息查询错误");
        System.out.println(userIdCard);
        List<UserIdCard> userIdCards = userService.findUserIdCard(userIdCard, myPageSize);
        if (userIdCards != null) {
            HashMap<String, Object> map = new LinkedHashMap<>();
            map.put("userIdCards", userIdCards);
            map.put("Length", userIdCards.size());
            myResponse.setCode("200").setMsg("查询成功！").setData(map);
        }
        return myResponse;
    }

    @PostMapping("/idCard")
    public MyResponse idCard(@RequestBody UserIdCard userIdCard) {
        MyResponse myResponse = new MyResponse("500", "用户身份证信息查询错误");
        System.out.println(userIdCard);
        if (userIdCard != null) {
            int i = -1;
            userIdCard.setCode(RandomUtil.randomString(20));
            if (userIdCard.getId() != null) {
                System.out.println("执行更新");
                i = userService.updateUserIdCard(userIdCard);
            } else {
                System.out.println("执行插入");
                userIdCard.setStatus("0");
                userIdCard.setCode(RandomUtil.randomString(25));
                i = userService.insertUserIdCard(userIdCard);
            }
            if (i != -1) {
                HashMap<String, Object> map = new LinkedHashMap<>();
                map.put("uicId", userIdCard.getId());
                myResponse.setCode("200").setMsg("用户更新成功！").setData(map);
            }
        }
        return myResponse;
    }

    @PostMapping("/idCard/img")
    public MyResponse idCard(@RequestParam(value = "file", required = false) MultipartFile imgFile,
                             @RequestParam(value = "imgType", required = false) String imgType,
                             @RequestParam(value = "uid", required = false) String uid,
                             HttpServletRequest request) {
        MyResponse myResponse = new MyResponse("500", "用户身份证信息查询错误");
        System.out.println(imgFile.getOriginalFilename());
        System.out.println(imgType);
        System.out.println(uid);

        //先查询是否存在当前用户的身份证信息
        UserIdCard userIdCard = new UserIdCard();
        userIdCard.setUId(uid);
        List<UserIdCard> userIdCards = userService.findUserIdCard(userIdCard, null);

        //先判断是图1还是图2 上传图片
        try {
            if ("uicImg1".equals(imgType)) {
                String s = CommonM.upLoadFile(imgFile.getInputStream(), "uicImg1.jpg", 2, request);
                userIdCard.setUicImg1(s);
            } else if ("uicImg2".equals(imgType)) {
                String s = CommonM.upLoadFile(imgFile.getInputStream(), "uicImg2.jpg", 2, request);
                userIdCard.setUicImg2(s);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        //更新数据库
        int i = -1;
        if (userIdCards.size() > 0) {
            userIdCard.setId(userIdCards.get(0).getId());
            i = userService.updateUserIdCard(userIdCard);
        } else {
            i = userService.insertUserIdCard(userIdCard);
        }
        if (i != -1) {
            HashMap<String, Object> map = new LinkedHashMap<>();
            map.put("uicId", userIdCard.getId());
            myResponse.setCode("200").setMsg("用户身份证图片更新成功！").setData(map);
        }
        return myResponse;
    }

    @DeleteMapping("/idCard")
    public MyResponse idCardDel(@RequestBody UserIdCard userIdCard) {
        MyResponse myResponse = new MyResponse("500", "操作失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (userIdCard.getId() != null) {
            isGo = true;
        }
        if (userIdCard.getUId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = userService.deleteUserIdCard(userIdCard);
            if (b) {
                myResponse.setCode("200").setMsg("信息删除成功");
            }
        }
        return myResponse;
    }

    /*--------用户财产模块-------------*/
    @GetMapping("/property")
    public MyResponse property(UserProperty userProperty, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "用户财产查询错误");
        System.out.println(userProperty);
        List<UserProperty> userProperties = userService.findUserProperty(userProperty, myPageSize);
        if (userProperties != null) {
            HashMap<String, Object> map = new LinkedHashMap<>();
            map.put("userProperties", userProperties);
            map.put("Length", userProperties.size());
            myResponse.setCode("200").setMsg("查询成功！").setData(map);
        }
        return myResponse;
    }

    @PostMapping("/property")
    public MyResponse property(@RequestBody UserProperty userProperty) {
        MyResponse myResponse = new MyResponse("500", "用户财产更新错误");
        System.out.println(userProperty);
        if (userProperty != null) {
            int i = -1;
            if (userProperty.getId() != null) {
                i = userService.updateUserProperty(userProperty);
            } else {
                i = userService.insertUserProperty(userProperty);
            }
            if (i != -1) {
                HashMap<String, Object> map = new LinkedHashMap<>();
                map.put("upId", userProperty.getId());
                myResponse.setCode("200").setMsg("用户更新成功！").setData(map);
            }
        }
        return myResponse;
    }

    @DeleteMapping("/property")
    public MyResponse propertyDel(@RequestBody UserProperty userProperty) {
        MyResponse myResponse = new MyResponse("500", "用户财产操作失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (userProperty.getId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = userService.deleteUserProperty(userProperty);
            if (b) {
                myResponse.setCode("200").setMsg("用户财产删除成功");
            }

        }
        return myResponse;
    }

    /*--------权限模块-------------*/
    @GetMapping("/role")
    public MyResponse role(Role role, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "权限查询错误");
        System.out.println(role);
        List<Role> roles = userService.findRole(role, myPageSize);
        if (roles != null) {
            HashMap<String, Object> map = new LinkedHashMap<>();
            map.put("roles", roles);
            map.put("Length", roles.size());
            myResponse.setCode("200").setMsg("权限查询成功！").setData(map);
        }
        return myResponse;
    }

    @PostMapping("/role")
    public MyResponse role(@RequestBody Role role) {
        MyResponse myResponse = new MyResponse("500", "权限更新错误");
        System.out.println(role);
        if (role != null) {
            int i = -1;
            if (role.getId() != null) {
                i = userService.updateRole(role);
            } else {
                i = userService.insertRole(role);
            }
            if (i != -1) {
                HashMap<String, Object> map = new LinkedHashMap<>();
                map.put("rid", role.getId());
                myResponse.setCode("200").setMsg("权限更新成功！").setData(map);
            }
        }
        return myResponse;
    }

    @DeleteMapping("/role")
    public MyResponse roleDel(@RequestBody Role role) {
        MyResponse myResponse = new MyResponse("500", "权限删除失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (role.getId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = userService.deleteRole(role);
            if (b) {
                myResponse.setCode("200").setMsg("权限删除成功");
            }

        }
        return myResponse;
    }

    /*--------用户权限模块-------------*/
    @GetMapping("/userRole")
    public MyResponse userRole(UserRole userRole, MyPageSize myPageSize) {
        MyResponse myResponse = new MyResponse("500", "用户权限查询错误");
        System.out.println(userRole);
        List<UserRole> userRoles = userService.findUserRole(userRole, myPageSize);
        if (userRoles != null) {
            HashMap<String, Object> map = new LinkedHashMap<>();
            map.put("userRoles", userRoles);
            map.put("Length", userRoles.size());
            myResponse.setCode("200").setMsg("用户权限查询成功！").setData(map);
        }
        return myResponse;
    }

    @PostMapping("/userRole")
    public MyResponse userRole(@RequestBody UserRole userRole) {
        MyResponse myResponse = new MyResponse("500", "用户权限更新错误");
        System.out.println(userRole);
        if (userRole != null) {
            int i = -1;
            if (userRole.getId() != null) {
                i = userService.updateUserRole(userRole);
            } else {
                i = userService.insertUserRole(userRole);
            }
            if (i != -1) {
                HashMap<String, Object> map = new LinkedHashMap<>();
                map.put("urid", userRole.getId());
                myResponse.setCode("200").setMsg("用户权限更新成功！").setData(map);
            }
        }
        return myResponse;
    }

    @DeleteMapping("/userRole")
    public MyResponse userRoleDel(@RequestBody UserRole userRole) {
        MyResponse myResponse = new MyResponse("500", "用户权限删除失败");
        boolean isGo = false;//是否给予执行数据库操作
        if (userRole.getId() != null) {
            isGo = true;
        }
        if (isGo) {
            boolean b = userService.deleteUserRole(userRole);
            if (b) {
                myResponse.setCode("200").setMsg("用户权限删除成功");
            }

        }
        return myResponse;
    }

    /*-------分离的方法--------*/
    /*发送邮件*/
    private boolean sendEmail(UserInfo userInfo) {
        try {
            System.out.println("mail= " + userInfo);
            if (userInfo == null) {
                return false;
            }
            if (userInfo.getUEmail() == null) {
                return false;
            }
            mailService.sendHTMLMail(new MailBean(userInfo.getUEmail(), "注册邮箱验证 - 梦想众筹系统",
                    "<div style=\"border-radius: 10px 10px 10px 10px;font-size:13px;    color: #555555;width: 666px;font-family:'Century Gothic','Trebuchet MS','Hiragino Sans GB',微软雅黑,'Microsoft Yahei',Tahoma,Helvetica,Arial,'SimSun',sans-serif;margin:50px auto;border:1px solid #eee;max-width:100%;background: #ffffff repeating-linear-gradient(-45deg,#fff,#fff 1.125rem,transparent 1.125rem,transparent 2.25rem);box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);\">\n" +
                            "   <div style=\"width:100%;background:#49BDAD;color:#ffffff;border-radius: 10px 10px 0 0;background-image: -moz-linear-gradient(0deg, rgb(67, 198, 184), rgb(255, 209, 244));background-image: -webkit-linear-gradient(0deg, rgb(67, 198, 184), rgb(255, 209, 244));height: 66px;\">\n" +
                            "    <p style=\"font-size:20px;word-break:break-all;padding: 23px 32px;margin:0;" +
                            "background-color: hsla(0,0%,100%,.4);border-radius: 10px 10px 0 0;\">\n" +
                            "     注册邮箱验证-<a style=\"text-decoration:none;color: blueviolet;\" href=\"http://localhost:8081/\" target=\"_blank\">梦想众筹系统 </a>\n" +
                            "    </p>\n" +
                            "   </div>\n" +
                            "   <div style=\"margin:40px auto;width:90%\">\n" +
                            "    <p style=\"font-size: 20px;font-weight: 600;\">亲爱的用户：</p>\n" +
                            "    <div style=\"background: #fafafa repeating-linear-gradient(-45deg,#fff,#fff 1.125rem,transparent 1.125rem,transparent 2.25rem);box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);margin:20px 0px;padding:15px;border-radius:5px;font-size:14px;color:#555555;\">\n" +
                            "     <p style=\"font-size: 17px;\">\n" +
                            "      您好！感谢您使用梦想众筹系统!<br>\n" +
                            "      您的账号（" + userInfo.getUUsername().substring(0, 2) + "***）正在进行邮箱验证，\n" +
                            "      <a style='color: blue;' href=\"http://localhost:8081/user/checkMail?uEmail=" + userInfo.getUEmail() +
                            "&code=" + userInfo.getCode() + "\">点击此处验证</a>" +
                            "      <br><br>\n" +
                            "      或者复制一下地址进行访问：<br>\n" +
                            "      http://localhost:8081/user/checkMail?uEmail=" + userInfo.getUEmail() + "&code=" + userInfo.getCode() +
                            "      <br>\n" +
                            "      <hr>\n" +
                            "      (为了保障您帐号的安全性，请在1小时内完成验证。)\n" +
                            "     </p>\n" +
                            "    </div>\n" +
                            "    <p style=\"text-align: right;\">\n" +
                            "     梦想众筹系统服务中心<br>\n" +
                            "     " + LocalDateTime.now() +
                            "    </p>\n" +
                            "    <style type=\"text/css\">\n" +
                            "     a:link {\n" +
                            "      text-decoration: none\n" +
                            "     }\n" +
                            "\n" +
                            "     a:visited {\n" +
                            "      text-decoration: none\n" +
                            "     }\n" +
                            "\n" +
                            "     a:hover {\n" +
                            "      text-decoration: none\n" +
                            "     }\n" +
                            "\n" +
                            "     a:active {\n" +
                            "      text-decoration: none\n" +
                            "     }\n" +
                            "    </style>\n" +
                            "   </div>\n" +
                            "  </div>"
            ));

            System.out.println("邮件发送success");
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }


}
