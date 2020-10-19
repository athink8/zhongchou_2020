package jz.dao;

import jz.entities.po.UserInfo;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户dao
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface UserInfoDao {

    List<UserInfo> findUserInfo(@Param("userInfo") UserInfo userInfo,
                                @Param("myPageSize") MyPageSize myPageSize);

    //根据一堆id查询项目
    List<UserInfo> findUserInfoByIds(@Param("ids") List<Integer> ids,
                                     @Param("myPageSize") MyPageSize myPageSize);


    int updateUserInfo(@Param("userInfo") UserInfo userInfo);

    int insertUserInfo(@Param("userInfo") UserInfo userInfo);

    boolean deleteUserInfo(@Param("userInfo") UserInfo userInfo);
}
