package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 用户财产类
 * author: jz
 * Time: 2020/3/14 16:33
 **/

@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class UserProperty implements Serializable {
    private Integer id;
    private String upCount; //资金数目
    private String upCountDate; //更新时间
    private String upAccount; //绑定账号
    private String upAccountName; //绑定账号名字
    private String upLock; //是否锁 1是 0否
    private Integer uId; //用户id
    private String status; //状态 1是 0否
}
