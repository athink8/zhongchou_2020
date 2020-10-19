package jz.entities.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.Map;

/**
 * author: jz
 * Time: 2020/4/2 17:52
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class MyResponse implements Serializable {
    private String code; //状态码
    private String msg; //消息
    private Map<String, Object> data; //数据

    public MyResponse(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
