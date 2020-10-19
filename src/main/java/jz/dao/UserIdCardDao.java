package jz.dao;

import jz.entities.po.UserIdCard;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface UserIdCardDao {
    List<UserIdCard> findUserIdCard(@Param("userIdCard") UserIdCard userIdCard,
                                    @Param("myPageSize") MyPageSize myPageSize);

    int updateUserIdCard(@Param("userIdCard") UserIdCard userIdCard);

    int insertUserIdCard(@Param("userIdCard") UserIdCard userIdCard);

    boolean deleteUserIdCard(@Param("userIdCard") UserIdCard userIdCard);
}
