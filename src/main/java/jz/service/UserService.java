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
 * author: jz
 * Time: 2020/4/17 21:03
 **/
@Transactional
@Service
public class UserService {
    @Autowired(required = false)
    private UserInfoDao userInfoDao;

    @Autowired(required = false)
    private UserIdCardDao userIdCardDao;

    @Autowired(required = false)
    private UserPropertyDao userPropertyDao;

    @Autowired(required = false)
    private UserRoleDao userRoleDao;

    @Autowired(required = false)
    private RoleDao roleDao;

    /*--重构方法-----------------------*/
    //为了计算偏移量
    private MyPageSize calOffset(MyPageSize myPageSize) {
        if (myPageSize != null && myPageSize.getSize() != 0) {
            myPageSize.setOffset(myPageSize.getSize() * myPageSize.getPage());
        }
        return myPageSize;
    }

    /*-----用户基本信息*/
    public List<UserInfo> findUserInfo(UserInfo userInfo, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return userInfoDao.findUserInfo(userInfo, myPageSize);
    }

    //根据一堆id查询项目
    public List<UserInfo> findUserInfoByIds(List<Integer> ids, MyPageSize myPageSize) {
        calOffset(myPageSize);
        if (ids != null) {
            if (ids.size() > 0) {
                return userInfoDao.findUserInfoByIds(ids, myPageSize);
            }
        }
        return Collections.emptyList(); //尝试返回空的list
    }


    public int updateUserInfo(UserInfo userInfo) {
        if (userInfo != null) {
            int i = userInfoDao.updateUserInfo(userInfo);
            if (i != 0) {
                return userInfo.getId();
            }
        }
        return -1;
    }

    public int insertUserInfo(UserInfo userInfo) {
        if (userInfo != null) {
            int i = userInfoDao.insertUserInfo(userInfo);
            if (i != 0) {
                return userInfo.getId();
            }
        }
        return -1;
    }

    public boolean deleteUserInfo(UserInfo userInfo) {
        return userInfoDao.deleteUserInfo(userInfo);
    }

    /*-----用户身份证信息*/
    public List<UserIdCard> findUserIdCard(UserIdCard userIdCard, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return userIdCardDao.findUserIdCard(userIdCard, myPageSize);
    }

    public int updateUserIdCard(UserIdCard userIdCard) {
        if (userIdCard != null) {
            int i = userIdCardDao.updateUserIdCard(userIdCard);
            if (i != 0) {
                return userIdCard.getId();
            }
        }
        return -1;
    }

    public int insertUserIdCard(UserIdCard userIdCard) {
        if (userIdCard != null) {
            int i = userIdCardDao.insertUserIdCard(userIdCard);
            if (i != 0) {
                return userIdCard.getId();
            }
        }
        return -1;
    }

    public boolean deleteUserIdCard(UserIdCard userIdCard) {
        return userIdCardDao.deleteUserIdCard(userIdCard);
    }

    /*-----用户财产*/
    public List<UserProperty> findUserProperty(UserProperty userProperty, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return userPropertyDao.findUserProperty(userProperty, myPageSize);
    }

    public int updateUserProperty(UserProperty userProperty) {
        if (userProperty != null) {
            int i = userPropertyDao.updateUserProperty(userProperty);
            if (i != 0) {
                return userProperty.getId();
            }
        }
        return -1;
    }

    public int insertUserProperty(UserProperty userProperty) {
        if (userProperty != null) {
            int i = userPropertyDao.insertUserProperty(userProperty);
            if (i != 0) {
                return userProperty.getId();
            }
        }
        return -1;
    }

    public boolean deleteUserProperty(UserProperty userProperty) {
        return userPropertyDao.deleteUserProperty(userProperty);
    }

    /*-----用户权限对应*/
    public List<UserRole> findUserRole(UserRole userRole, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return userRoleDao.findUserRole(userRole, myPageSize);
    }

    public int updateUserRole(UserRole userRole) {
        if (userRole != null) {
            int i = userRoleDao.updateUserRole(userRole);
            if (i != 0) {
                return userRole.getId();
            }
        }
        return -1;
    }

    public int insertUserRole(UserRole userRole) {
        if (userRole != null) {
            int i = userRoleDao.insertUserRole(userRole);
            if (i != 0) {
                return userRole.getId();
            }
        }
        return -1;
    }

    public boolean deleteUserRole(UserRole userRole) {
        return userRoleDao.deleteUserRole(userRole);
    }

    /*-----权限信息*/
    public List<Role> findRole(Role role, MyPageSize myPageSize) {
        calOffset(myPageSize);
        return roleDao.findRole(role, myPageSize);
    }

    public int updateRole(Role role) {
        if (role != null) {
            int i = roleDao.updateRole(role);
            if (i != 0) {
                return role.getId();
            }
        }
        return -1;
    }

    public int insertRole(Role role) {
        if (role != null) {
            int i = roleDao.insertRole(role);
            if (i != 0) {
                return role.getId();
            }
        }
        return -1;
    }

    public boolean deleteRole(Role role) {
        return roleDao.deleteRole(role);
    }
}
