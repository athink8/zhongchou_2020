package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 项目拓展类
 * author: jz
 * Time: 2020/3/28 21:24
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class ProjectExpand implements Serializable {
    private Integer id;
    private Integer applyDream; //申请梦想计划 1是 0否 //是否梦想计划 1是 0否
    private Integer pIsDream; //申请梦想计划 1是 0否 //是否梦想计划 1是 0否
    private Integer pIsCarousel; //是否进首页轮播图 1是 0否
    private Integer pId; //项目id
    private Integer status; //状态 1是 0否
}
