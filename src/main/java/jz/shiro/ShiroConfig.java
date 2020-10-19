package jz.shiro;


import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Shiro的配置类
 *
 * @author lenovo
 */
@Configuration
public class ShiroConfig {

    /**
     * 创建ShiroFilterFactoryBean
     */
    @Bean
    public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager) {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();

        //设置安全管理器
        shiroFilterFactoryBean.setSecurityManager(securityManager);

        //添加Shiro内置过滤器
        /**
         * Shiro内置过滤器，可以实现权限相关的拦截器
         *    常用的过滤器：
         *       anon: 无需认证（登录）可以访问
         *       authc: 必须认证才可以访问
         *       user: 如果使用rememberMe的功能可以直接访问
         *       perms： 该资源必须得到资源权限才可以访问
         *       roles: 该资源必须得到角色权限才可以访问
         */
        Map<String, String> filterMap = new LinkedHashMap<String, String>();

        filterMap.put("/", "anon");
        filterMap.put("/index", "anon");
        filterMap.put("/toLogin", "anon");
        filterMap.put("/toRegist", "anon");
        filterMap.put("/dream", "anon");
        filterMap.put("/allproject", "anon");
        filterMap.put("/publishProject*", "authc");
        filterMap.put("/admin/**", "roles[1]");
        filterMap.put("/admin", "roles[1]");

        //授权过滤器
        //注意：当前授权拦截后，shiro会自动跳转到未授权页面
        //filterMap.put("/update", "perms[user:update]");
        //filterMap.put("/delete", "authc,perms[user:delete]");


        //修改调整的登录页面
        shiroFilterFactoryBean.setLoginUrl("/toLogin");
        shiroFilterFactoryBean.setUnauthorizedUrl("/403");
        //shiroFilterFactoryBean.setSuccessUrl("/index");

        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterMap);
        return shiroFilterFactoryBean;
    }

    /**
     * 创建DefaultWebSecurityManager
     */
    @Bean(name = "securityManager")
    public DefaultWebSecurityManager getDefaultWebSecurityManager(@Qualifier("userRealm") UserRealm userRealm) {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        //关联realm
        securityManager.setRealm(userRealm);
        return securityManager;
    }

    /**
     * 创建Realm
     */
    @Bean(name = "userRealm")
    public UserRealm getRealm() {
        UserRealm userRealm = new UserRealm();
        //加密算法 对比密码和数据库密码必须为加密密码
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        hashedCredentialsMatcher.setHashAlgorithmName("Md5"); //加密算法
        hashedCredentialsMatcher.setHashIterations(11); //加密次数
        userRealm.setCredentialsMatcher(hashedCredentialsMatcher);
        return userRealm;
    }

}

