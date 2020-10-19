package jz.dao;

import jz.entities.po.DictionaryType;
import jz.entities.po.DictionaryType;
import jz.entities.vo.MyPageSize;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 类型数据字典
 * author: jz
 * Time: 2020/3/14 23:30
 **/
@Mapper
public interface DictionaryTypeDao {

    List<DictionaryType> findDictionaryType(@Param("dictionaryType") DictionaryType dictionaryType,
                                            @Param("myPageSize") MyPageSize myPageSize);

    int updateDictionaryType(@Param("dictionaryType") DictionaryType dictionaryType);

    int insertDictionaryType(@Param("dictionaryType") DictionaryType dictionaryType);

    boolean deleteDictionaryType(@Param("dictionaryType") DictionaryType dictionaryType);
}
