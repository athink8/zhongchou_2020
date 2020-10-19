package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 用户身份信息类
 * author: jz
 * Time: 2020/3/14 16:33
 **/

@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain=true)
public class UserIdCard implements Serializable {
    private Integer id;
    private String uicNumber; //身份证号码
    private String uicName; //身份证名字
    private String uicImg1; //身份证照片正面
    private String uicImg2; //身份证照片反面
    private String uicPhone; //电话
    private String status; //状态 1是 0否
    private String code;
    private String uId; //用户id
}
