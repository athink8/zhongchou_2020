package jz.shiro;

import jz.entities.po.UserInfo;
import jz.entities.po.UserRole;
import jz.service.UserService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


/**
 * 自定义Realm
 *
 * @author lenovo
 */
public class UserRealm extends AuthorizingRealm {

    @Autowired(required = false)
    UserService userService;

    /**
     * 执行授权逻辑
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection arg0) {
        System.out.println("执行授权逻辑");
        //给资源进行授权
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();

        //添加资源的授权字符串
        //info.addStringPermission("user:add");

        //到数据库查询当前登录用户的授权字符串
        //获取当前登录用户
        Subject subject = SecurityUtils.getSubject();
        UserInfo user = (UserInfo) subject.getPrincipal();//得到当前用户
        String roleName = null;
        System.out.println(user);
        //通过权限对象的id来验证身份
        if (user != null) {
            UserRole userRole = new UserRole().setUserInfo(new UserInfo().setId(user.getId()));
            List<UserRole> userRoles = userService.findUserRole(userRole, null);
            if (userRoles != null) {
                if (userRoles.size() > 0) {
                    roleName = String.valueOf(userRoles.get(0).getRole().getId());
                }
            }
        }
        info.addRole(roleName);
        return info;
    }

    /**
     * 执行认证逻辑
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {

        //编写shiro判断逻辑，判断用户名和密码
        System.out.println("执行认证逻辑");
        //1.获取用户名 --查询用户名、邮箱、电话
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        List<UserInfo> users = userService.findUserInfo(new UserInfo().setUUsername(token.getUsername()).setStatus("1"), null);
        if (users == null || users.size() <= 0) {
            users = userService.findUserInfo(new UserInfo().setUEmail(token.getUsername()).setStatus("1"), null);
        }
        if (users == null || users.size() <= 0) {
            users = userService.findUserInfo(new UserInfo().setUPhone(token.getUsername()).setStatus("1"), null);
        }
        //判断是否用户存在
        if (users == null || users.size() <= 0) {
            throw new UnknownAccountException("该账号不存在！");
        }

        //获取匹配的唯一用户
        UserInfo user = users.get(0);

        //判断是否用户已被锁定
        if ("1".equals(user.getULock())) {
            throw new AuthenticationException("该账号已被锁定!");
        }

        //shiro 自带加密算法
        //SimpleHash password = new SimpleHash("MD5", user.getUPassword(), token.getUsername(), 11);//加密
        //System.out.println("加密后密码："+password.toString());

        //用用户id加盐
        ByteSource salt = ByteSource.Util.bytes("" + user.getUEmail());
        //2.判断密码
        return new SimpleAuthenticationInfo(user, user.getUPassword(), salt, "");
    }

}
