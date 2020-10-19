package jz.util;

import java.io.FileWriter;
import java.io.IOException;

/* *
 *类名：AlipayConfig
 *功能：基础配置类
 *详细：设置帐户有关信息及返回路径
 */

public class AlipayConfig {
	
//↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

	// 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
	public static String app_id = "2016102400748616";
	
	// 商户私钥，您的PKCS8格式RSA2私钥
    public static String merchant_private_key ="MIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQDLbl+M2TMd41U+um3htXu1zokBxAHZ6QxRYRGA/nzojjm4R3QMzf/YRRSiY6KjLuPm6A/v2YE1N6zlWA7VmIXMXeNZbczISgSDgswZLtAIoswGBdKlSd3Nn8bMn8BDeCNJ+XSKloGphMdMT/2a0xxRjL5xS0cQUj33t/WJFlKx55+R5GRVrOFzS18vefYTR2wFAti9dst6ZFbpBqJ1xh5P1uAeEHuzmhzBL2vFdV7/LwCcxwnBDXX/xlxazlUVHxlHsEtZ5ZmbisF75tYdrzVCdazvki2vBV/ACFv1iIvMzHD158jyG10JzbjrmZmq4tlwRPYB2hdDdw5jsIsHnyMNAgMBAAECggEBAKPAeuWTyNPcNLhDtUOkpKpaUGq9bogMUkAHlOFy+PTx14CA8+eCwtlB8jQtY7NbgVRTpNB7EsjVwjTyxy4kkj9JrEJGYjsvaaa62LPEvOzWrsiCU2d9qC9m183LIiatRCq9xJPyRvk/ynWhRhEksnzqgDoOUGvQ59TJnbn14CcXTi3Qwfv6iGOWeDkDNBAzIDf8sSK1uyTTM/ZIDyMeTtFw9fPRoVWeN2Pip+2ca6IraVR3AeMiQQaGI9UkM+vfTbHpMivhhTU/nLrr6yws0niflA33mWv8JYz6W4CplH+/U230c0NB4mGNhTVsXle55mDZh6VQMehmmscxCGoxugECgYEA5tZVPq770yu+EAE5O+CE6VFDpOyi8CovKJ1gRwF3A2TNIV6woq1aap6yxT4/3xPoUmMf+SGQVYMgaiDz2QY6dgVlkBwRUEGEbF1xjmGZb/2xiGFmnq7QbYnPck4D5jvNJ9lYp1P5hgCeoz2U4KT2D2CQPZofQ/SljSgRtMJ9qE0CgYEA4ZtBRY8a3M9z8LNse994xsLJLxAfRMAXFxeja1iaSxtVVXqOJZCmfaW0PAAHtpFDTjXEz3NMnlBgSeONegKNNCK5vd3QocsgtkILdiVFwEXkSyfx0HTKXQix0hCzRpKtVkQSCrlZr88s0dMV5I0wM+K7P+r/FmOOb0JqSLXgxcECgYEAsvnJnFFV5PQMaCJauucohjJAzVXAO4+pgscKh+NF4Ha+aToen/LioLotB6ttIEwyG/bJKoNwgiyp7D9icYlXuHwUs/hfICe8Qbztt6RKsD817/T8+Nm3tsZb9lcwxMjnFxd4mjwMwm4mkZDEpqygL2oCTBD8XtcHqPtBRzJo9R0CgYEA3Wuj/yH5ilftAYMHaPgmMGVCUPdwyOgCgX6IvDVkkWxNLyyuUD4MuWqlXvHkoBEnzp3FAJm3y/U027ACzYmtjkq6o5cNSY30GAzv9M+WCqRN8FlO4nmNlwuOgo4zdYNFrlH2pyHM3VjnMzQJ25uagIH5pzz7iLzDMX0slRo0dcECgYEAsBU19rMK+BkycDg55mCZnfNuOe+Q6hJczbiXVRyR3MZy5saneXfYJkojSS+Nyr1ysigc29xRuEYzDJ+BKJ34IrVPlOo1HLXZCRHQtZD2y1iCBNhgF14ZULhlT9bT9z4mJ5ws2FMzw1fi0bKPwt53wYA6MfuqkqZP2PniNQie6d4=";

	// 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
    public static String alipay_public_key ="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtsWeqMGRD8SB5Q0jGf8YV5v6PfgdoSn5hflnH5YuryJl1YR90vxTMwmzyeEMqaLnSU/X0d2fkfhgYG8MiFyjsMpx+Zz1Mel7Z8ko5acEVxduNEVPbiRmLVF5COuRSFwy2zXqvqsEpwuwHXuMXTq26FEbxLVDVSOkrUcnILaEYf5S7I/DtOnqhGvguK0p5zCct0gHVnXUHBeICb7fdElEheJ6Ip+ZKr4b4zXxTWckM0JyJFz+3fwLj77RPOcPXZFzCxm4SaCCH/fxfiSlLOJY7tJYHjuTUCq/Nhs+1l6S5aratgnAMUURJJcw8sR88sy6wcGNvM7f1Yr+SmHpFG/FwwIDAQAB";

	// 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String notify_url = "http://localhost:8081/project/aliPay/notify";

	// 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String return_url = "http://localhost:8081/project/aliPay/return";

	// 服务器异步通知页面路径  第二个
	public static String notify_url2 = "http://localhost:8081/project/aliPay/notify2";

	// 页面跳转同步通知页面路径 第二个
	public static String return_url2 = "http://localhost:8081/project/aliPay/return2";


	// 签名方式
	public static String sign_type = "RSA2";
	
	// 字符编码格式
	public static String charset = "utf-8";
	
	// 支付宝网关
	public static String gatewayUrl = "https://openapi.alipaydev.com/gateway.do";
	
	// 支付宝网关
	public static String log_path = "C:\\";


//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    /** 
     * 写日志，方便测试（看网站需求，也可以改成把记录存入数据库）
     * @param sWord 要写入日志里的文本内容
     */
   /* public static void logResult(String sWord) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(log_path + "alipay_log_" + System.currentTimeMillis()+".txt");
            writer.write(sWord);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }*/
}

