package jz.entities.po;

import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 用户基本信息类
 * author: jz
 * Time: 2020/3/14 16:33
 **/

@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain=true)
public class UserInfo implements Serializable {
    private Integer id;
    private String uUsername; //用户名
    private String uPassword; //密码
    private String uEmail; //邮箱
    private String uPhone; //电话
    private String uLock; //是否锁定
    private String status; //状态 1是 0否
    private String code;
}
