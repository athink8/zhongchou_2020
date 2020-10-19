package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 项目联系信息类
 * author: jz
 * Time: 2020/3/28 21:24
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class ProjectConnectionInfo implements Serializable {
    private Integer id;
    private String pcName; //联系名
    private String pcInfo; //详细自我介绍
    private String pcPhone; //联系电话
    private String pcCall; //客服电话
    private String pcAccount; //收款人账号
    private String pcAccountName; //收款人姓名
    private Integer pId; //项目id
}
