package jz.dao;

import jz.entities.po.ProjectInfo;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface ProjectInfoDao {
    //按条件查询项目
    // Hot为热度 如zx zr |pageNum和pageSize固定的分页插件值
    List<ProjectInfo> findProject(@Param("projectInfo") ProjectInfo projectInfo,
                                  @Param("myPageSize") MyPageSize myPageSize, @Param("Hot") String hot);

    //根据一堆id查询项目
    List<ProjectInfo> findProjectByIds(@Param("ids") List<Integer> ids,
                                       @Param("myPageSize") MyPageSize myPageSize);

    //更新项目
    int upDateProject(@Param("projectInfo") ProjectInfo projectInfo);

    //插入项目
    int insertProject(@Param("projectInfo") ProjectInfo projectInfo);

    //删除项目
    boolean deleteProject(@Param("projectInfo") ProjectInfo projectInfo);


}
