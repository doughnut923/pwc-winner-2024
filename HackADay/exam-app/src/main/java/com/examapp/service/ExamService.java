package com.examapp.service;

import com.examapp.entity.Exam;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;


public interface ExamService extends IService<Exam> {

    /**
     * Retrieves the exam content for a specified class when accessed by a teacher.
     *
     * @param classname The name of the class for which the exam content is requested.
     * @return An Exam object containing the exam content for the specified class, or null if not found.
     */
    Exam getExamContentAsTeacher(String classname);
    /**
     * Retrieves the exam content for a specified class when accessed by a student.
     * This method checks if the student has the required authority to access the exam content
     * for the given class. Also checks if the current time falls within the allowed exam time range.
     *
     * @param classname The name of the class for which the exam content is requested.
     * @param authorityList A list of authorities associated with the student, used for access control.
     * @return An Exam object containing the exam content if the student has access rights
     *         and the current time is within the exam time range;
     *         otherwise, returns null.
     */
    Exam getExamContentAsStudent(String classname, List<String> authorityList);

    void cacheExamContent(Exam exam);
}
