package jz.dao;

import jz.entities.po.ProjectReport;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 項目回报dao
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface ProjectReportDao {

    List<ProjectReport> findProjectReport(@Param("projectReport") ProjectReport projectReport, @Param("myPageSize") MyPageSize myPageSize);

    int updateProjectReport(@Param("projectReport") ProjectReport projectReport);

    int insertProjectReport(@Param("projectReport") ProjectReport projectReport);

    boolean deleteProjectReport(@Param("projectReport") ProjectReport projectReport);

}
