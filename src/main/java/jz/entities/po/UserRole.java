package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * 包含用户和权限的类
 * author: jz
 * Time: 2020/5/1 20:23
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class UserRole {
    private Integer id;
    private UserInfo userInfo; //用戶
    private Role role; //权限

    public UserRole(String uId, String rId) {
        if (uId != null && !"".equals(uId)) {
            this.userInfo.setId(Integer.valueOf(uId));
        }
        if (rId != null && !"".equals(rId)) {
            this.role.setId(Integer.valueOf(rId));
        }
    }
}
