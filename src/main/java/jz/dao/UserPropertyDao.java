package jz.dao;

import jz.entities.po.UserProperty;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户财产dao
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface UserPropertyDao {
    List<UserProperty> findUserProperty(@Param("userProperty") UserProperty userProperty,
                                        @Param("myPageSize") MyPageSize myPageSize);

    int updateUserProperty(@Param("userProperty") UserProperty userProperty);

    int insertUserProperty(@Param("userProperty") UserProperty userProperty);

    boolean deleteUserProperty(@Param("userProperty") UserProperty userProperty);
}
