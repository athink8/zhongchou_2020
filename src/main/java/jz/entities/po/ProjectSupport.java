package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 项目支持类
 * author: jz
 * Time: 2020/3/28 21:24
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class ProjectSupport implements Serializable {
    private Integer id;
    private Integer uId; //用户id
    private Integer pId; //项目id
    private String sMoney; //支持金额
    private String sDate; //支持时间
    private String status; //状态 1是 0否
}
