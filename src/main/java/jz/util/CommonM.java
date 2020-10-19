package jz.util;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.RandomUtil;
import jz.entities.po.UserInfo;
import jz.entities.vo.UrlCollect;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.InputStream;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;

/**
 * 公共抽取方法
 * author: jz
 * Time: 2020/4/21 16:56
 **/
public class CommonM {

    /*文件上传方法 FileType: 1项目头图片  2身份证图片 3内容文件*/
    public static String upLoadFile(InputStream uFile, String FileName, int FileType, HttpServletRequest request) {
        String filePath = null;
        String fileName = null;
        UserInfo nowUser = (UserInfo) request.getSession().getAttribute("nowUser");
        if (nowUser != null) {
            if (1 == FileType) {
                filePath = UrlCollect.URL_PREX_PIMG + nowUser.getUUsername(); //文件路径+用户名
                fileName = nowUser.getUUsername() + "_" + RandomUtil.randomString(18) + "_" + FileName; //文件名
            } else if (2 == FileType) {
                filePath = UrlCollect.URL_PREX_UICIMG + nowUser.getUUsername(); //文件路径+用户名
                fileName = nowUser.getUUsername() + "_" + FileName; //文件名
            } else if (3 == FileType) {
                filePath = UrlCollect.URL_PREX_CONTAIN + nowUser.getUUsername(); //文件路径+用户名
                fileName = nowUser.getUUsername() + "_" + RandomUtil.randomString(18) + "_" + FileName; //文件名
            }

            if (filePath != null) {
                File file = new File(filePath, fileName); //创建文件
                FileUtil.writeFromStream(uFile, file); //复制文件
                return filePath + "/" + fileName;
            }
        }

        return null;
    }

    /*时间格式化 "yyyy-MM-dd HH:mm:ss" */
    public static String formatDate(TemporalAccessor temporal, String format) {
        if (format == null || format.equals("")) {
            format = "yyyy-MM-dd HH:mm:ss";
        }
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern(format);
        return dtf.format(temporal);
    }
}
