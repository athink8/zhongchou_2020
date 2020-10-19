package jz;

import jz.dao.ProjectExpandDao;
import jz.dao.ProjectReportDao;
import jz.dao.RoleDao;
import jz.dao.UserInfoDao;
import jz.entities.vo.MailBean;
import jz.service.MailService;
import jz.service.ProjectService;
import jz.service.UserService;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.mail.MessagingException;
import java.time.LocalDateTime;

@SpringBootTest
class JzZhongchouApplicationTests {
    @Autowired(required = false)
    protected ProjectExpandDao projectExpandDao;
    @Autowired(required = false)
    protected ProjectService projectService;
    @Autowired(required = false)
    protected ProjectReportDao projectReportDao;
    @Autowired(required = false)
    protected UserInfoDao userInfoDao;
    @Autowired(required = false)
    protected RoleDao roleDao;
    @Autowired(required = false)
    protected MailService mailService;
    @Autowired(required = false)
    protected UserService userService;

    @Test
    void contextLoads() {
//        System.out.println(userService.updateUserProperty(new UserProperty().setId(11).setUpCount("3000")));
//        System.out.println(projectService.updateProjectOrder(new ProjectOrder().setId(12).setOMoney("3000")));
        String password = new SimpleHash("MD5", "123456", "" + "jz@onfree.cn", 11).toString();
        System.out.println(password);

    }

    public void sentMail() {
        try {
            mailService.sendHTMLMail(new MailBean("athink8@163.com", "注册邮箱验证 - 梦想众筹系统",
                    "<div style=\"border-radius: 10px 10px 10px 10px;font-size:13px;    color: #555555;width: 666px;font-family:'Century Gothic','Trebuchet MS','Hiragino Sans GB',微软雅黑,'Microsoft Yahei',Tahoma,Helvetica,Arial,'SimSun',sans-serif;margin:50px auto;border:1px solid #eee;max-width:100%;background: #ffffff repeating-linear-gradient(-45deg,#fff,#fff 1.125rem,transparent 1.125rem,transparent 2.25rem);box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);\">\n" +
                            "   <div style=\"width:100%;background:#49BDAD;color:#ffffff;border-radius: 10px 10px 0 0;background-image: -moz-linear-gradient(0deg, rgb(67, 198, 184), rgb(255, 209, 244));background-image: -webkit-linear-gradient(0deg, rgb(67, 198, 184), rgb(255, 209, 244));height: 66px;\">\n" +
                            "    <p style=\"font-size:15px;word-break:break-all;padding: 23px 32px;margin:0;background-color: hsla(0,0%,100%,.4);border-radius: 10px 10px 0 0;\">\n" +
                            "     注册邮箱验证-<a style=\"text-decoration:none;color: blueviolet;\" href=\"http://localhost:8081/\" target=\"_blank\">梦想众筹系统 </a>\n" +
                            "    </p>\n" +
                            "   </div>\n" +
                            "   <div style=\"margin:40px auto;width:90%\">\n" +
                            "    <p style=\"font-size: 20px;font-weight: 600;\">亲爱的用户：</p>\n" +
                            "    <div style=\"background: #fafafa repeating-linear-gradient(-45deg,#fff,#fff 1.125rem,transparent 1.125rem,transparent 2.25rem);box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);margin:20px 0px;padding:15px;border-radius:5px;font-size:14px;color:#555555;\">\n" +
                            "     <p style=\"font-size: 17px;\">\n" +
                            "      您好！感谢您使用梦想众筹系统!<br>\n" +
                            "      您的账号（athink***）正在进行邮箱验证，\n" +
                            "      <a style='color: blue;' href=\"http://localhost:8081/user/checkMail?email=1&code=123\">点击此处验证</a>" +
                            "      <br><br>\n" +
                            "      或者复制一下地址进行访问：<br>\n" +
                            "      http://localhost:8081/user/checkMail?email=1&code=123\n" +
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
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
