package jz.dao;

import jz.entities.po.UserRole;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户权限dao
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface UserRoleDao {
    List<UserRole> findUserRole(@Param("userRole") UserRole userRole,
                                @Param("myPageSize") MyPageSize myPageSize);

    int updateUserRole(@Param("userRole") UserRole userRole);

    int insertUserRole(@Param("userRole") UserRole userRole);

    boolean deleteUserRole(@Param("userRole") UserRole userRole);
}
