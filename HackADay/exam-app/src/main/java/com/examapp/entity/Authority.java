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
 * Represents an authority or permission assigned to users in the system.
 *
 * <p>This class maps to the <code>t_authority</code> table in the SQL database.</p>
 *
 * <h3>Fields:</h3>
 * <ul>
 *     <li><code>Long id</code>: The unique identifier for the authority.</li>
 *     <li><code>String username</code>: The username associated with this authority.</li>
 *     <li><code>String permission</code>: The specific permission granted to the user.</li>
 *     <li><code>Set&lt;{@link User&gt; users</code>: A set of users who have this authority (not persisted in the database).</li>
 * </ul>
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