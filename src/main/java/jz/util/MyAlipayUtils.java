package jz.util;

import cn.hutool.core.util.RandomUtil;
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.request.AlipayTradePagePayRequest;
import jz.entities.po.ProjectOrder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/*
 * 支付宝调用方法
 * 问题：这里有个坑 就是上线后如果没解决跨域的问题时 你的sessin数据会丢失
 * 解决：勾选自动登录后会生成cookie 或者使用jwt等token验证
 * */
@Service
public class MyAlipayUtils {
    public static String aliPay(ProjectOrder projectOrder, int type) throws AlipayApiException {
        AlipayClient alipayClient = new DefaultAlipayClient(AlipayConfig.gatewayUrl, AlipayConfig.app_id,
                AlipayConfig.merchant_private_key, "json", AlipayConfig.charset, AlipayConfig.alipay_public_key,
                AlipayConfig.sign_type);

        // 设置请求参数
        AlipayTradePagePayRequest alipayRequest = new AlipayTradePagePayRequest();
        //这里我修改了判断是支付还是充值
        if (type == 1) {
            alipayRequest.setReturnUrl(AlipayConfig.return_url);
            alipayRequest.setNotifyUrl(AlipayConfig.notify_url);
        } else if (type == 2) {
            projectOrder.setOName("个人金额充值");
            projectOrder.setOId(RandomUtil.randomString(20));
            alipayRequest.setReturnUrl(AlipayConfig.return_url2);
            alipayRequest.setNotifyUrl(AlipayConfig.notify_url2);
        }


        // 商户订单号，商户网站订单系统中唯一订单号，必填
        String out_trade_no = projectOrder.getOId();
        // 付款金额，必填
        String total_amount = projectOrder.getOMoney();
        // 订单名称，必填
        String subject = "梦想众筹系统-" + projectOrder.getOName();
        // 商品描述，可空
        String body = "梦想众筹系统支付服务";

        alipayRequest.setBizContent("{\"out_trade_no\":\"" + out_trade_no + "\"," + "\"total_amount\":\"" + total_amount
                + "\"," + "\"subject\":\"" + subject + "\"," + "\"body\":\"" + body + "\","
                + "\"product_code\":\"FAST_INSTANT_TRADE_PAY\"}");

        //返回结果是 html代码
        return alipayClient.pageExecute(alipayRequest).getBody();
    }

    public static ProjectOrder aliPayReturn(HttpServletRequest request, HttpServletRequest response) throws AlipayApiException, UnsupportedEncodingException {
        System.out.println("支付成功, 进入同步通知接口...");
        //获取支付宝GET过来反馈信息
        Map<String, String> params = new HashMap<String, String>();
        Map<String, String[]> requestParams = request.getParameterMap();
        for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext(); ) {
            String name = (String) iter.next();
            String[] values = (String[]) requestParams.get(name);
            String valueStr = "";
            for (int i = 0; i < values.length; i++) {
                valueStr = (i == values.length - 1) ? valueStr + values[i]
                        : valueStr + values[i] + ",";
            }
            //乱码解决，这段代码在出现乱码时使用
            valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
            params.put(name, valueStr);
        }

        //调用SDK验证签名
        boolean signVerified = AlipaySignature.rsaCheckV1(params, AlipayConfig.alipay_public_key, AlipayConfig.charset, AlipayConfig.sign_type);

        //——请在这里编写您的程序（以下代码仅作参考）——
        if (signVerified) {
            //商户订单号
            String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"), "UTF-8");
            //支付宝交易号
            String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"), "UTF-8");
            //付款金额
            String total_amount = new String(request.getParameter("total_amount").getBytes("ISO-8859-1"), "UTF-8");
            ProjectOrder projectOrder = new ProjectOrder();
            projectOrder.setOId(out_trade_no).setOMoney(total_amount).setOTradeId(trade_no);
            return projectOrder;
        } else {
            System.out.println("支付, 验签失败...");
        }
        return null;
    }

    public static ProjectOrder alipayNotifyNotice(HttpServletRequest request, HttpServletRequest response) throws Exception {

        System.out.println("支付成功, 进入异步通知接口...");
        //获取支付宝POST过来反馈信息
        Map<String, String> params = new HashMap<String, String>();
        Map<String, String[]> requestParams = request.getParameterMap();
        for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext(); ) {
            String name = (String) iter.next();
            String[] values = (String[]) requestParams.get(name);
            String valueStr = "";
            for (int i = 0; i < values.length; i++) {
                valueStr = (i == values.length - 1) ? valueStr + values[i]
                        : valueStr + values[i] + ",";
            }
            //乱码解决，这段代码在出现乱码时使用
            /*valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");*/
            params.put(name, valueStr);
        }

        //调用SDK验证签名
        boolean signVerified = AlipaySignature.rsaCheckV1(params, AlipayConfig.alipay_public_key, AlipayConfig.charset, AlipayConfig.sign_type);

        //——请在这里编写您的程序（以下代码仅作参考）——

   /* 实际验证过程建议商户务必添加以下校验：
   1、需要验证该通知数据中的out_trade_no是否为商户系统中创建的订单号，
   2、判断total_amount是否确实为该订单的实际金额（即商户订单创建时的金额），
   3、校验通知中的seller_id（或者seller_email) 是否为out_trade_no这笔单据的对应的操作方（有的时候，一个商户可能有多个seller_id/seller_email）
   4、验证app_id是否为该商户本身。
   */
        //验证成功
        if (signVerified) {
            //商户订单号
            String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"), "UTF-8");

            //支付宝交易号
            String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"), "UTF-8");

            //交易状态
            String trade_status = new String(request.getParameter("trade_status").getBytes("ISO-8859-1"), "UTF-8");

            //付款金额
            String total_amount = new String(request.getParameter("total_amount").getBytes("ISO-8859-1"), "UTF-8");

            if (trade_status.equals("TRADE_FINISHED")) {
                //判断该笔订单是否在商户网站中已经做过处理
                //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
                //如果有做过处理，不执行商户的业务程序

                //注意： 尚自习的订单没有退款功能, 这个条件判断是进不来的, 所以此处不必写代码
                //退款日期超过可退款期限后（如三个月可退款），支付宝系统发送该交易状态通知
            } else if (trade_status.equals("TRADE_SUCCESS")) {
                //判断该笔订单是否在商户网站中已经做过处理
                //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
                //如果有做过处理，不执行商户的业务程序

                //注意：
                //付款完成后，支付宝系统发送该交易状态通知

                // 修改叮当状态，改为 支付成功，已付款; 同时新增支付流水
            }
            System.out.println("支付成功...");
            ProjectOrder projectOrder = new ProjectOrder();
            projectOrder.setOId(out_trade_no).setOMoney(total_amount).setOTradeId(trade_no);
            return projectOrder;
        } else {//验证失败
            System.out.println("支付, 验签失败...");
        }
        return null;
    }

}
