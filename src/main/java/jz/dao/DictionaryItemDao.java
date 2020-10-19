package jz.dao;

import jz.entities.po.DictionaryItem;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 具体类型数据字典
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface DictionaryItemDao {

    List<DictionaryItem> findDictionaryItem(@Param("dictionaryItem") DictionaryItem dictionaryItem,
                                            @Param("myPageSize") MyPageSize myPageSize);

    int updateDictionaryItem(@Param("dictionaryItem") DictionaryItem dictionaryItem);

    int insertDictionaryItem(@Param("dictionaryItem") DictionaryItem dictionaryItem);

    boolean deleteDictionaryItem(@Param("dictionaryItem") DictionaryItem dictionaryItem);
}
