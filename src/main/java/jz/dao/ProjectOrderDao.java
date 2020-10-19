package jz.dao;

import jz.entities.po.ProjectOrder;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 项目订单dao
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface ProjectOrderDao {
    List<ProjectOrder> findProjectOrder(@Param("projectOrder") ProjectOrder projectOrder,
                                        @Param("myPageSize") MyPageSize myPageSize);

    int updateProjectOrder(@Param("projectOrder") ProjectOrder projectOrder);

    int insertProjectOrder(@Param("projectOrder") ProjectOrder projectOrder);

    boolean deleteProjectOrder(@Param("projectOrder") ProjectOrder projectOrder);
}
