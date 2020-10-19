package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 字典类型
 * author: jz
 * Time: 2020/3/31 16:23
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class DictionaryType implements Serializable {
    private Integer id;
    private String dicName; //字典名
    private String dicInfo; //备注
    private String dicLevel; //级别
    private Integer status;

}
