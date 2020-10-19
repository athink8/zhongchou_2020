package jz.dao;

import jz.entities.po.ProjectConnectionInfo;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface ProjectConnectionInfoDao {

    List<ProjectConnectionInfo> findProjectConnectionInfo(@Param("projectConnectionInfo") ProjectConnectionInfo projectConnectionInfo, @Param("myPageSize") MyPageSize myPageSize);

    int updateProjectConnectionInfo(@Param("projectConnectionInfo") ProjectConnectionInfo projectConnectionInfo);

    int insertProjectConnectionInfo(@Param("projectConnectionInfo") ProjectConnectionInfo projectConnectionInfo);

    boolean deleteProjectConnectionInfo(@Param("projectConnectionInfo") ProjectConnectionInfo projectConnectionInfo);
}
