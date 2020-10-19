package jz.service;

import jz.dao.*;
import jz.entities.po.*;
import jz.entities.vo.MyPageSize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

/**
 * 项目拓展Service
 * author: jz
 * Time: 2020/3/29 14:49
 **/

@Service
@Transactional
public class ProjectService {

    //数据字典值
    @Autowired(required = false)
    protected DictionaryItemDao dictionaryItemDao;

    //数据字典类型
    @Autowired(required = false)
    protected DictionaryTypeDao dictionaryTypeDao;

    //项目拓展dao
    @Autowired(required = false)
    protected ProjectExpandDao projectExpandDao;

    //项目基本dao
    @Autowired(required = false)
    protected ProjectInfoDao projectInfoDao;

    //项目回报dao
    @Autowired(required = false)
    protected ProjectReportDao projectReportDao;

    //项目回报dao
    @Autowired(required = false)
    protected ProjectConnectionInfoDao projectConnectionInfoDao;

    //项目回报dao
    @Autowired(required = false)
    protected ProjectSupportDao projectSupportDao;

    //项目订单dao
    @Autowired(required = false)
    protected ProjectOrderDao projectOrderDao;

    //评论评论dao
    @Autowired(required = false)
    protected CommentDao commentDao;


    //定时更新项目的阶段
    void updateState() {
        //s使用定时器？
    }

    /*--重构方法-----------------------*/
    //为了计算偏移量
    private MyPageSize calOffset(MyPageSize myPageSize) {
        if (myPageSize != null && myPageSize.getSize() != 0) {
            myPageSize.setOffset(myPageSize.getSize() * myPageSize.getPage());
        }
        return myPageSize;
    }

    /*--项目拓展------------------------*/
    //查询项目拓展的所有属性
    public List<ProjectExpand> findProjectExpand(ProjectExpand projectExpand, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return projectExpandDao.findProjectExpand(projectExpand, myPageSize);

    }

    //按拓展条件查询项目
    public List<ProjectInfo> findProject(ProjectExpand projectExpand, ProjectInfo projectInfo, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return projectExpandDao.findProject(projectExpand, projectInfo, myPageSize);
    }

    //更新拓展条件
    public int updateProjectExpand(ProjectExpand projectExpand) {
        if (projectExpand != null) {
            int i = projectExpandDao.updateProjectExpand(projectExpand);
            if (i != 0) {
                return projectExpand.getId();
            }
        }
        return -1;
    }

    //插入拓展条件
    public int insertProjectExpand(ProjectExpand projectExpand) {
        if (projectExpand != null) {
            int i = projectExpandDao.insertProjectExpand(projectExpand);
            if (i != 0) {
                return projectExpand.getId();
            }
        }
        return -1;
    }

    //删除拓展条件
    public boolean deleteProjectExpand(ProjectExpand projectExpand) {
        return projectExpandDao.deleteProjectExpand(projectExpand);
    }


    /*--具体的字典值-----------------------*/
    public List<DictionaryItem> findDictionaryItem(DictionaryItem dictionaryItem, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return dictionaryItemDao.findDictionaryItem(dictionaryItem, myPageSize);
    }

    public int updateDictionaryItem(DictionaryItem dictionaryItem) {
        if (dictionaryItem != null) {
            int i = dictionaryItemDao.updateDictionaryItem(dictionaryItem);
            if (i != 0) {
                return dictionaryItem.getId();
            }
        }
        return -1;
    }

    public int insertDictionaryItem(DictionaryItem dictionaryItem) {
        if (dictionaryItem != null) {
            int i = dictionaryItemDao.insertDictionaryItem(dictionaryItem);
            if (i != 0) {
                return dictionaryItem.getId();
            }
        }
        return -1;
    }

    public boolean deleteDictionaryItem(DictionaryItem dictionaryItem) {
        return dictionaryItemDao.deleteDictionaryItem(dictionaryItem);
    }

    /*--字典类型-----------------------*/
    public List<DictionaryType> findDictionaryType(DictionaryType dictionaryType, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return dictionaryTypeDao.findDictionaryType(dictionaryType, myPageSize);
    }

    public int updateDictionaryType(DictionaryType dictionaryType) {
        if (dictionaryType != null) {
            int i = dictionaryTypeDao.updateDictionaryType(dictionaryType);
            if (i != 0) {
                return dictionaryType.getId();
            }
        }
        return -1;
    }

    public int insertDictionaryType(DictionaryType dictionaryType) {
        if (dictionaryType != null) {
            int i = dictionaryTypeDao.insertDictionaryType(dictionaryType);
            if (i != 0) {
                return dictionaryType.getId();
            }
        }
        return -1;
    }

    public boolean deleteDictionaryType(DictionaryType dictionaryType) {
        return dictionaryTypeDao.deleteDictionaryType(dictionaryType);
    }

    /*--项目基本------------------------*/
    //按基本条件查询项目
    public List<ProjectInfo> findProject(ProjectInfo projectInfo,
                                         MyPageSize myPageSize, String hot) {
        calOffset(myPageSize);
        List<ProjectInfo> projects = null;
        //控制是否为模糊查询因子
        int isPName = 0;
        //检测是否模糊查询，使用 假分页
        if (projectInfo != null) {
            if (projectInfo.getPName() != null && !projectInfo.getPName().equals("")) {
                projects = projectInfoDao.findProject(projectInfo, null, hot);
                int i = myPageSize.getOffset() + myPageSize.getSize();
                if (i >= projects.size() || i == 0) {
                    i = projects.size();
                }
                projects = projects.subList(myPageSize.getOffset(), i);
                isPName = 1;
            }
        }
        //正常查询
        if (isPName != 1) {
            projects = projectInfoDao.findProject(projectInfo, myPageSize, hot);

        }
        return projects;
    }

    //根据一堆id查询项目
    public List<ProjectInfo> findProjectByIds(List<Integer> ids, MyPageSize myPageSize) {
        calOffset(myPageSize);
        if (ids != null) {
            if (ids.size() > 0) {
                return projectInfoDao.findProjectByIds(ids, myPageSize);
            }
        }
        return Collections.emptyList(); //尝试返回空的list
    }

    //更新项目
    public int upDateProject(ProjectInfo projectInfo) {
        if (projectInfo != null) {
            int i = projectInfoDao.upDateProject(projectInfo);
            if (i != 0) {
                return projectInfo.getId();
            }
        }
        return -1;
    }

    //插入项目
    public int insertProject(ProjectInfo projectInfo) {
        if (projectInfo != null) {
            int i = projectInfoDao.insertProject(projectInfo);
            if (i != 0) {
                return projectInfo.getId();
            }
        }
        return -1;
    }

    //删除项目
    public boolean deleteProject(ProjectInfo projectInfo) {
        return projectInfoDao.deleteProject(projectInfo);
    }

    /*--项目回报------------------------*/
    public List<ProjectReport> findProjectReport(ProjectReport projectReport, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return projectReportDao.findProjectReport(projectReport, myPageSize);
    }

    public int updateProjectReport(ProjectReport projectReport) {
        if (projectReport != null) {
            int i = projectReportDao.updateProjectReport(projectReport);
            if (i != 0) {
                return projectReport.getId();
            }
        }
        return -1;
    }

    public int insertProjectReport(ProjectReport projectReport) {
        if (projectReport != null) {
            int i = projectReportDao.insertProjectReport(projectReport);
            if (i != 0) {
                return projectReport.getId();
            }
        }
        return -1;
    }

    public boolean deleteProjectReport(ProjectReport projectReport) {
        return projectReportDao.deleteProjectReport(projectReport);
    }

    /*--项目联系信息------------------------*/
    public List<ProjectConnectionInfo> findProjectConnectionInfo(ProjectConnectionInfo projectConnectionInfo,
                                                                 MyPageSize myPageSize) {
        calOffset(myPageSize);
        return projectConnectionInfoDao.findProjectConnectionInfo(projectConnectionInfo, myPageSize);
    }

    public int updateProjectConnectionInfo(ProjectConnectionInfo projectConnectionInfo) {
        if (projectConnectionInfo != null) {
            int i = projectConnectionInfoDao.updateProjectConnectionInfo(projectConnectionInfo);
            if (i != 0) {
                return projectConnectionInfo.getId();
            }
        }
        return -1;
    }

    public int insertProjectConnectionInfo(ProjectConnectionInfo projectConnectionInfo) {
        if (projectConnectionInfo != null) {
            int i = projectConnectionInfoDao.insertProjectConnectionInfo(projectConnectionInfo);
            if (i != 0) {
                return projectConnectionInfo.getId();
            }
        }
        return -1;
    }

    public boolean deleteProjectConnectionInfo(ProjectConnectionInfo projectConnectionInfo) {
        return projectConnectionInfoDao.deleteProjectConnectionInfo(projectConnectionInfo);
    }

    /*--项目支持-----------------------*/
    public List<ProjectSupport> findProjectSupport(ProjectSupport projectSupport,
                                                   MyPageSize myPageSize) {
        calOffset(myPageSize);
        return projectSupportDao.findProjectSupport(projectSupport, myPageSize);
    }

    public int updateProjectSupport(ProjectSupport projectSupport) {
        if (projectSupport != null) {
            int i = projectSupportDao.updateProjectSupport(projectSupport);
            if (i != 0) {
                return projectSupport.getId();
            }
        }
        return -1;
    }

    public int insertProjectSupport(ProjectSupport projectSupport) {
        if (projectSupport != null) {
            int i = projectSupportDao.insertProjectSupport(projectSupport);
            if (i != 0) {
                return projectSupport.getId();
            }
        }
        return -1;
    }

    public boolean deleteProjectSupport(ProjectSupport projectSupport) {
        return projectSupportDao.deleteProjectSupport(projectSupport);
    }

    /*--项目订单-----------------------*/
    public List<ProjectOrder> findProjectOrder(ProjectOrder projectOrder,
                                               MyPageSize myPageSize) {
        calOffset(myPageSize);
        return projectOrderDao.findProjectOrder(projectOrder, myPageSize);
    }

    public int updateProjectOrder(ProjectOrder projectOrder) {
        if (projectOrder != null) {
            int i = projectOrderDao.updateProjectOrder(projectOrder);
            if (i != 0) {
                return projectOrder.getId();
            }
        }
        return -1;
    }

    public int insertProjectOrder(ProjectOrder projectOrder) {
        if (projectOrder != null) {
            int i = projectOrderDao.insertProjectOrder(projectOrder);
            if (i != 0) {
                return projectOrder.getId();
            }
        }
        return -1;
    }

    public boolean deleteProjectOrder(ProjectOrder projectOrder) {
        return projectOrderDao.deleteProjectOrder(projectOrder);
    }

    /*--评论-----------------------*/
    public List<Comment> findComment(Comment comment, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return commentDao.findComment(comment, myPageSize);
    }

    public int updateComment(Comment comment) {
        if (comment != null) {
            int i = commentDao.updateComment(comment);
            if (i != 0 && comment.getId() != 0) {
                return comment.getId();
            }
        }
        return -1;
    }

    public int insertComment(Comment comment) {
        if (comment != null) {
            int i = commentDao.insertComment(comment);
            if (i != 0 && comment.getId() != 0) {
                return comment.getId();
            }
        }
        return -1;
    }

    public boolean deleteComment(Comment comment) {
        return commentDao.deleteComment(comment);
    }
}
