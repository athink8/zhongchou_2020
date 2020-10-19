package jz.service;

import jz.entities.vo.MailBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;

/**
 * author: jz
 * Time: 2020/4/18 15:58
 **/
@Service
public class MailService {
    @Value("${spring.mail.sender}") //yml里的配置
    private String MAIL_SENDER; //邮件发送者

    @Autowired
    private JavaMailSender javaMailSender;

    /**
     * 发送一个简单格式的邮件
     *
     * @param mailBean
     */
    public void sendSimpleMail(MailBean mailBean) throws MessagingException {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        //邮件发送人
        simpleMailMessage.setFrom(MAIL_SENDER);
        //邮件接收人
        simpleMailMessage.setTo(mailBean.getRecipient());
        //邮件主题
        simpleMailMessage.setSubject(mailBean.getSubject());
        //邮件内容
        simpleMailMessage.setText(mailBean.getContent());
        //这里添加抄送人名称列表
        //String[] ccList = new String[]{MAIL_SENDER};
        //simpleMailMessage.setCc(ccList);
        //这里添加密送人名称列表
        //String[] bccList = new String[]{MAIL_SENDER};
        //simpleMailMessage.setBcc(bccList);
        //发送邮件
        javaMailSender.send(simpleMailMessage);
    }

    /**
     * 发送一个HTML格式的邮件
     *
     * @param mailBean
     */
    public void sendHTMLMail(MailBean mailBean) throws MessagingException {
        MimeMessage mimeMailMessage = null;
        mimeMailMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMailMessage, true);
        mimeMessageHelper.setFrom(MAIL_SENDER);
        mimeMessageHelper.setTo(mailBean.getRecipient());
        mimeMessageHelper.setSubject(mailBean.getSubject());
        mimeMessageHelper.setText(mailBean.getContent(), true);
        //这里添加抄送人名称列表
        //String[] ccList = new String[]{MAIL_SENDER};
        //mimeMessageHelper.setCc(ccList);
        //这里添加密送人名称列表
        //String[] bccList = new String[]{MAIL_SENDER};
        //mimeMessageHelper.setBcc(bccList);
        javaMailSender.send(mimeMailMessage);

    }

    /**
     * 发送带附件格式的邮件
     *
     * @param mailBean
     */
    public void sendAttachmentMail(MailBean mailBean) throws MessagingException {
        MimeMessage mimeMailMessage = null;
        mimeMailMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMailMessage, true);
        mimeMessageHelper.setFrom(MAIL_SENDER);
        mimeMessageHelper.setTo(mailBean.getRecipient());
        mimeMessageHelper.setSubject(mailBean.getSubject());
        mimeMessageHelper.setText(mailBean.getContent(), true);
        //这里添加抄送人名称列表
        //String[] ccList = new String[]{MAIL_SENDER};
        //mimeMessageHelper.setCc(ccList);
        //这里添加密送人名称列表
        //String[] bccList = new String[]{MAIL_SENDER};
        //mimeMessageHelper.setBcc(bccList);
        //文件路径
        FileSystemResource file = new FileSystemResource(new File(mailBean.getAttachmentSource()));
        mimeMessageHelper.addAttachment(mailBean.getAttachmentFilename(), file);

        javaMailSender.send(mimeMailMessage);

    }

    /**
     * 发送带静态资源的邮件
     *
     * @param mailBean
     */
    public void sendInlineMail(MailBean mailBean) throws MessagingException {
        MimeMessage mimeMailMessage = null;
        mimeMailMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMailMessage, true);
        mimeMessageHelper.setFrom(MAIL_SENDER);
        mimeMessageHelper.setTo(mailBean.getRecipient());
        mimeMessageHelper.setSubject(mailBean.getSubject());
        mimeMessageHelper.setText("<html><body>" + mailBean.getContent() + "</body></html>", true);
        //这里添加抄送人名称列表
        //String[] ccList = new String[]{MAIL_SENDER};
        //mimeMessageHelper.setCc(ccList);
        //这里添加密送人名称列表
        //String[] bccList = new String[]{MAIL_SENDER};
        //mimeMessageHelper.setBcc(bccList);
        //文件路径
        FileSystemResource file = new FileSystemResource(new File(mailBean.getAttachmentSource()));
        mimeMessageHelper.addAttachment(mailBean.getAttachmentFilename(), file);

        javaMailSender.send(mimeMailMessage);

    }
}
