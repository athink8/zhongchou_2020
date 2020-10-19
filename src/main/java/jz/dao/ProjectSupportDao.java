package jz.dao;

import jz.entities.po.ProjectSupport;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface ProjectSupportDao {

    List<ProjectSupport> findProjectSupport(@Param("projectSupport") ProjectSupport projectSupport,
                                            @Param("myPageSize") MyPageSize myPageSize);

    int updateProjectSupport(@Param("projectSupport") ProjectSupport projectSupport);

    int insertProjectSupport(@Param("projectSupport") ProjectSupport projectSupport);

    boolean deleteProjectSupport(@Param("projectSupport") ProjectSupport projectSupport);

}
