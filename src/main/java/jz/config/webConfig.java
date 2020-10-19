package jz.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * author: jz
 * Time: 2019/9/26 0:34
 * 自定义的spring mvc配置类
 **/

@Configuration
public class webConfig implements WebMvcConfigurer {

    //首页index映射
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("fore/index");
        registry.addViewController("/index").setViewName("fore/index");
        registry.addViewController("/allproject").setViewName("fore/allproject");
        registry.addViewController("/dream").setViewName("fore/dream");
        registry.addViewController("/projectDetail").setViewName("fore/projectDetail");
        registry.addViewController("/publishProject1").setViewName("fore/publishProject1");
        registry.addViewController("/publishProject2").setViewName("fore/publishProject2");
        registry.addViewController("/publishProject3").setViewName("fore/publishProject3");
        registry.addViewController("/publishProject4").setViewName("fore/publishProject4");
        registry.addViewController("/publishProject5").setViewName("fore/publishProject5");
        registry.addViewController("/toLogin").setViewName("fore/login");
        registry.addViewController("/toRegist").setViewName("fore/regist");
        registry.addViewController("/userInfo").setViewName("fore/userInfo");
        registry.addViewController("/projectOrder").setViewName("fore/projectOrder");
        /*后台*/
        /*项目管理*/
        registry.addViewController("/admin").setViewName("admin/index");
        registry.addViewController("/admin/").setViewName("admin/index");
        registry.addViewController("/admin/projectCheck").setViewName("admin/projectCheck");
        registry.addViewController("/admin/projectAll").setViewName("admin/projectAll");
        registry.addViewController("/admin/projectDreamCheck").setViewName("admin/projectDreamCheck");
        registry.addViewController("/admin/projectDreamAll").setViewName("admin/projectDreamAll");
        registry.addViewController("/admin/projectOrder").setViewName("admin/projectOrder");
        /*用户管理*/
        registry.addViewController("/admin/userAll").setViewName("admin/userAll");
        registry.addViewController("/admin/userRole").setViewName("admin/userRole");
        /*其他管理*/
        registry.addViewController("/admin/dictionaryItem").setViewName("admin/dictionaryItem");
        registry.addViewController("/admin/foreIndex").setViewName("admin/foreIndex");

        /*错误*/
        registry.addViewController("403").setViewName("/error/403");

    }
}
