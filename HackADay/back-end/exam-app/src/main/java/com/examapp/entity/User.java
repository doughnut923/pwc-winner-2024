package com.examapp.entity;

import java.io.Serializable;
import java.util.Set;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.examapp.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.annotations.Many;

/**
 * @TableName t_user
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User implements Serializable {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String username;

    private String password;

    @TableField(exist = false)
    private Set<Authority> authorities;

    @TableField(exist = false)
    private byte[] imageData;

    private static final long serialVersionUID = 1L;

    public User(UserDto userDto) {
        this.username = userDto.getUsername();
        this.password = userDto.getPassword();
        this.authorities = userDto.getAuthorities();
        this.imageData = userDto.getImageData().getBytes();
    }
}