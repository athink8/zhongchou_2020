package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 项目信息类
 * author: jz
 * Time: 2020/3/28 21:24
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class ProjectInfo implements Serializable {
    private Integer id;
    private String pName; //项目名
    private String pHeadImg; //项目头图片
    private String pIntroduce; //项目简介
    private DictionaryItem pStage; //项目阶段 1预售 2在售 3已结束 ->通过数据字典查询
    private DictionaryItem pType; //项目类型->通过数据字典查询
    //private List<DictionaryItem> PItems; //查询数据字典 --》失败！
    private String pContent; //项目详情
    private String pNowMoney; //项目当前金额
    private String pTarMoney; //项目目标总金额
    private String pPublishDate; //项目发布时间
    private String pStartDate; //项目开始时间
    private String pEndDate; //项目结束时间
    private Integer pSupportNum; //项目支持数
    private Integer status; //状态 1是 0否
    private Integer pIsPublish; //是否已发布 1是 0否
    //private Integer pPublishId; //发布者id
    private UserInfo userInfo; //用户
}
