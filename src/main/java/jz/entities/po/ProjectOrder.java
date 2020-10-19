package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 项目订单类
 * author: jz
 * Time: 2020/3/14 16:33
 **/

@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class ProjectOrder implements Serializable {
    private Integer id;
    private String oId; //唯一标识
    private String oTradeId; //流水号
    private String oName; //订单名
    private String oMoney; //订单金额
    private String oCreateTime; //创建时间
    private String oPayTime; //付款时间
    private String oReceipt; //发票名
    private String oReceiveName; //收货人
    private String oAddress; //收货地址
    private String oPhone; //联系电话
    private Integer oNum; //购买数量
    private Integer rId; //回报id
    private Integer pId; //用户id
    private Integer uId; //项目id
    private String status; //状态 1是 0否
    private DictionaryItem oPayType; //支付类型
    private DictionaryItem oType; //订单状态类型
}
