package jz.dao;

import jz.entities.po.Comment;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 评论dao
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface CommentDao {

    List<Comment> findComment(@Param("comment") Comment comment,
                              @Param("myPageSize") MyPageSize myPageSize);

    int updateComment(@Param("comment") Comment comment);

    int insertComment(@Param("comment") Comment comment);

    boolean deleteComment(@Param("comment") Comment comment);
}
