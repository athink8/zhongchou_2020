package jz.dao;

import jz.entities.po.ProjectExpand;
import jz.entities.po.ProjectInfo;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 项目拓展dao
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface ProjectExpandDao {

    //按条件查询项目
    List<ProjectInfo> findProject(@Param("projectExpand") ProjectExpand projectExpand,
                                  @Param("projectInfo") ProjectInfo projectInfo,
                                  @Param("myPageSize") MyPageSize myPageSize);

    //查询项目拓展所有属性
    List<ProjectExpand> findProjectExpand(@Param("projectExpand") ProjectExpand projectExpand,
                                          @Param("myPageSize") MyPageSize myPageSize);

    //更新拓展条件
    int updateProjectExpand(@Param("projectExpand") ProjectExpand projectExpand);

    //插入拓展条件
    int insertProjectExpand(@Param("projectExpand") ProjectExpand projectExpand);

    //删除拓展条件
    boolean deleteProjectExpand(@Param("projectExpand") ProjectExpand projectExpand);

}
