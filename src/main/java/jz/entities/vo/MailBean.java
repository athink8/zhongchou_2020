package jz.entities.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 邮件类
 * author: jz
 * Time: 2020/4/18 15:55
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
@Accessors(chain = true)
public class MailBean implements Serializable {
    private String recipient;   //邮件接收人
    private String subject; //邮件主题
    private String content; //邮件内容
    private String attachmentFilename; //附件内容
    private String attachmentSource; //附件路径内容

    public MailBean(String recipient, String subject, String content) {
        this.recipient = recipient;
        this.subject = subject;
        this.content = content;
    }
}
