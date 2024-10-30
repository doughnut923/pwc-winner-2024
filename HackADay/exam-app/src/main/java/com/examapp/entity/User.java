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
 * Represents a user in the system.
 *
 * <p>This class maps to the <code>t_user</code> table in the SQL database.</p>
 *
 * <h3>Fields:</h3>
 * <ul>
 *     <li><code>Long id</code>: The unique identifier for the user.</li>
 *     <li><code>String username</code>: The username of the user.</li>
 *     <li><code>String password</code>: The password of the user (will be encrypted by bcrypt in sql for security).</li>
 *     <li><code>Set&lt;{@link Authority}&gt; authorities</code>: A set of authorities/roles assigned to the user (not persisted in the database).</li>
 * </ul>
 **/
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


    private static final long serialVersionUID = 1L;

}