package com.examapp.entity;

import java.io.Serializable;
import java.util.Set;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @TableName t_authority
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Authority implements Serializable {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String  username;

    private String permission;
    @TableField(exist = false)
    private Set<User> users;

    private static final long serialVersionUID = 1L;
}