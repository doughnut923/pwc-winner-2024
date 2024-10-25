package com.examapp.entity;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

/**
 * @TableName t_exam
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