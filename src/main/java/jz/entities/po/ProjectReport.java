package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 项目回报类
 * author: jz
 * Time: 2020/3/28 21:24
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class ProjectReport implements Serializable {
    private Integer id;
    private Integer rId; //回报id
    private DictionaryItem rType; //回报类型
    private String rMoney; //回报达到金额
    private String rContent; //回报内容
    private Integer rAllAmount; //回报数量
    private Integer rOneAmount; //单笔数量
    private String rReportDate; //回报时间
    private Integer pId; //项目id
    private String status; //状态 1是 0否
}
