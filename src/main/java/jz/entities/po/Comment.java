package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 评论类
 * author: jz
 * Time: 2020/3/14 16:33
 **/

@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain=true)
public class Comment implements Serializable {
    private Integer id;
    private String cmName; //用户名
    private String cmContent; //评论内容 250字
    private String cmCreateDate; //评论时间
    private Integer pId; //项目id
    private Integer uId; //用户id
    private String status; //状态 1是 0否
}
