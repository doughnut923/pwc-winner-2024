package com.examapp.entity;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

/**
 * @TableName t_exam
 * Represents an exam in the system.
 *
 * <p>This class maps to the <code>t_exam</code> table in the SQL database.</p>
 *
 * <h3>Fields:</h3>
 * <ul>
 *     <li><code>String classname</code>: The name of the class for which the exam is designated.</li>
 *     <li><code>Date startingTime</code>: The date and time when the exam starts.</li>
 *     <li><code>Date endingTime</code>: The date and time when the exam ends.</li>
 *     <li><code>String content</code>: The content or details of the exam.</li>
 * </ul>
 */
@Data
public class Exam implements Serializable {
    @TableId(type = IdType.NONE)
    private String classname;

    private Date startingTime;

    private Date endingTime;

    private String content;

    private static final long serialVersionUID = 1L;
}