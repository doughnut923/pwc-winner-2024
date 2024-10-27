package com.examapp.controllers;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.examapp.entity.Exam;
import com.examapp.mapper.ExamMapper;
import com.examapp.service.ExamService;
import com.examapp.utils.SecurityContextHolderUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


import static com.examapp.predefinedConstant.AuthorityConstants.STUDENT;
import static com.examapp.predefinedConstant.AuthorityConstants.TEACHER;

@RestController
@CrossOrigin
@RequestMapping("exam")
public class ExamController {
    @Resource
    private ExamService examService;
    @Autowired
    private ExamMapper examMapper;

    /**
     * Handles PUT requests to update an existing exam or create a new exam if it doesn't exist.
     *
     * This method uses the examService to perform the save or update operation.
     * If the operation is successful, it returns a 200 OK response. If the operation
     * fails due to an unexpected condition (e.g., server crash or programming bug),
     * it returns a 500 Internal Server Error response.
     *
     *      <p>Note: This operation can only be performed by a teacher.</p>
     *
     * @param exam The Exam object containing the exam details to be updated.
     *             Example JSON representation:
     *             <pre>
     *             {
     *                 "classname": "Mathematics",
     *                 "startingTime": "2023-10-30T10:00:00Z",
     *                 "endingTime": "2023-10-30T12:00:00Z",
     *                 "content": "Final exam covering chapters 1-5."
     *             }
     *             </pre>
     *
     * @return ResponseEntity<Void> A response entity indicating the result of the update operation.
     *         - Returns 200 OK if the update is successful.
     *         - Returns 500 Internal Server Error if an unexpected error occurs during the update.
     *
     */
    @PutMapping("update")
    public ResponseEntity<Void> update(@RequestBody Exam exam) {
        boolean flag = examService.saveOrUpdate(exam);
        if (flag) {
            return ResponseEntity.ok().build();
        }
        // should not happen except server crashes or programming bugs
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    /**
     * GET - retrieve a list of exam class names based on user authority.
     *
     * This method maps to the "/examList" endpoint and retrieves the user's
     * authorities from the security context. If the authority list is empty,
     * it returns a 401 Unauthorized response. If the user has the "TEACHER"
     * authority, it fetches and returns a list of complete exam class names from the
     * database. If the user is not a teacher, the method only returns the relevant exam class
     *
     * <p>Return values:</p>
     * <ul>
     *     <li>200 OK with a list of exam class names if the user has the
     *         appropriate authority.</li>
     *     <li>401 Unauthorized if the user has no authorities.</li>
     * </ul>
     *
     * <p>Example response for a teacher:</p>
     * <pre>
     * [
     *     "Mathematics",
     *     "Science",
     *     "History"
     * ]
     * </pre>
     *
     * @return A ResponseEntity containing a list of exam class names as strings
     *         for teachers or an updated authority list for non-teachers.
     */
    @GetMapping("examList")
    public ResponseEntity<List<String>> getExamList() {
        List<String> permissionlist = SecurityContextHolderUtil.getPermissionsFromSecurityContextHolder();
        if(permissionlist.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if(permissionlist.contains(TEACHER)){
            LambdaQueryWrapper<Exam> wrapper = new LambdaQueryWrapper<>();
            wrapper.select(Exam::getClassname);
            permissionlist = examService.list(wrapper).stream()
                    .map(Exam::getClassname).toList();
        }else{
            /*
             permission field in Authority store info exam options and the role as teacher / student
             exam options are permission list with student / teacher removed
             */
            permissionlist.remove(STUDENT);
        }
        return ResponseEntity.ok(permissionlist);
    }
    /**
     * GET - Retrieve exam content for a specified class.
     *
     * This method processes POST requests to the "examContent" endpoint. It checks
     * the user's authority to determine whether the request is made by a teacher or a student,
     * and then fetches the corresponding exam content.
     *
     * @param classname
     *
     * @return A ResponseEntity containing the Exam object if found and accessible, or
     *         an appropriate HTTP status code:
     *         <ul>
     *             <li>200 OK if the exam is successfully retrieved.</li>
     *             <li>401 UNAUTHORIZED if the user has no authority.</li>
     *             <li>403 FORBIDDEN if the exam is not accessible (e.g., due to timing or lack of permissions).</li>
     *         </ul>
     *
     * <p>Example response for a successful retrieval:</p>
     * <pre>
     * {
     *     "className": "Mathematics",
     *     "startingTime": "2024-10-01T09:00:00.000+00:00",
     *     "endingTime": "2024-11-25T11:00:00.000+00:00",
     *     "content": "Final Exam covering chapters 1-10."
     * }
     * </pre>
     */
    @GetMapping("examContent/{classname}")
    public ResponseEntity<Exam> getExamContent(@PathVariable String classname) {

        List<String> authorityList = SecurityContextHolderUtil.getPermissionsFromSecurityContextHolder();
        if(authorityList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // call corresponding method for teachers and students
        Exam exam = null;
        if(authorityList.contains(TEACHER)){
             exam = examService.getExamContentAsTeacher(classname);
        }else{
            authorityList.remove(STUDENT);
                exam = examService.getExamContentAsStudent(classname, authorityList);
        }
        if(exam == null){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(exam);
    }
}
