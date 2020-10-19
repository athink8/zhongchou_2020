package jz.entities.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 具体的字典值
 * author: jz
 * Time: 2020/3/31 16:23
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class DictionaryItem implements Serializable {
    private Integer id;
    private Integer dicId;
    private Integer itemCode;
    private String itemName;
    private String itemInfo;
    private Integer status;

    //当传递一个参数时默认是itemCode
    public DictionaryItem(String itemCode) {
        this.itemCode = Integer.valueOf(itemCode);
    }
}
