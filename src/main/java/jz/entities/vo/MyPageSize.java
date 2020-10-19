package jz.entities.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 分页封装属性
 * author: jz
 * Time: 2020/3/29 22:18
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class MyPageSize implements Serializable {
    private int size; //大小
    private int page; //当前页数
    private int offset; //偏移量
}
