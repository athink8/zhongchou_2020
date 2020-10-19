package jz.dao;

import jz.entities.po.Role;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 权限dao
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface RoleDao {
    List<Role> findRole(@Param("role") Role role,
                        @Param("myPageSize") MyPageSize myPageSize);

    int updateRole(@Param("role") Role role);

    int insertRole(@Param("role") Role role);

    boolean deleteRole(@Param("role") Role role);
}
