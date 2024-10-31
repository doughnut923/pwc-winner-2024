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

/**
 * <ul>
 *   <li>Handles information about exam lists and exam content.</li>
 *   <li>APIs available:
 *     <ol>
 *       <li>create or update exam info (<code>update</code>)</li>
 *       <li>get the list of exams (<code>getExamList</code>)</li>
 *       <li>retrieve exam content (<code>getExamContent</code>)</li>
 *     </ol>
 *   </li>
 *   <li>All endpoint require token obtained from logging in</li>
 *   <li>Available to teachers only:
 *     <ul>
 *       <li><code>update</code></li>
 *       <li><code>getExamList</code>: shows all exams to teachers while only permitted exams are shown to students.</li>
 *       <li><code>getExamContent</code>: shows content to teachers at all times while masking content for students outside of allowed timing.</li>
 *     </ul>
 *   </li>
 * </ul>
 */
@CrossOrigin
@RestController
@RequestMapping("exam")
public class ExamController {
    @Resource
    private ExamService examService;
    @Autowired
    private ExamMapper examMapper;

    /**
     * PUT - Update an existing exam or create a new exam if it doesn't exist.
     *
     * <p>This method maps to "/exam/update" to perform the save or update operation.</p>
     * <p>Exam content is cached in Redis with expiration time covered until 7 days after exam ended</p>
     * <p>If the exam is not present in the exam table, it will be inserted; otherwise, the existing entry will be updated.</p>
     * <p>If the operation is successful, it returns a 200 OK response.</p>
     * <p>If the operation fails due to an unexpected condition (e.g., server crash or programming bug), it returns a
     * 500 Internal Server Error response.</p>
     *
     * <p><strong>Note:</strong> <em>This operation can only be performed by a teacher.</em></p>
     *
     * <p>Ensure to include a Bearer token in the request header for authentication.</p>
     *
     * @param exam The {@link Exam} object containing the exam details to be updated.  (required)
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
     *         <ul>
     *         <li>Returns 200 OK if the update is successful.</li>
     *         <li>Returns 500 Internal Server Error if an unexpected error occurs during the update.</li>
     *         </ul>
     */
    @PutMapping("update")
    public ResponseEntity<Void> update(@RequestBody Exam exam) {
        boolean flag = examService.saveOrUpdate(exam);
        examService.cacheExamContent(exam);
        if (flag) {
            return ResponseEntity.ok().build();
        }
        // should not happen except server crashes or programming bugs
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    /**
     * GET - Retrieve a list of exam class names based on user authority.
     *
     * <p>This method maps to the "/exam/examList" endpoint.</p>
     * <p>If a teacher account accesses this endpoint, all exam classes will be retrieved from the exam table in SQL.</p>
     * <p>If a student account accesses this endpoint, only exams accessible by the student will be retrieved.</p>
     * <p>If the authority list is empty, it returns a 401 Unauthorized response.</p>
     *
     * <p><strong>High Concurrency:</strong>
     * <em>
     *     This is considered a hotspot endpoint.
     *     Note that students retrieve the exam list through SecurityContextHolder, which is cached in session storage.
     *     Frequent access to the SQL table is thus avoided.
     * </em></p>
     *
     * <p><strong>Note:</strong> <em>This operation can only be performed by a teacher.</em></p>
     *
     * <p>Ensure to include a Bearer token in the request header for authentication.</p>
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
     * <p>Example response for a student:</p>
     * <pre>
     * [
     *     "Mathematics",
     *     "Science"
     * ]
     * (only shows exams accessible by the logged-in student)
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
            // Teacher has access to all exam, retrieve all exam classes from Exam table
            LambdaQueryWrapper<Exam> wrapper = new LambdaQueryWrapper<>();
            wrapper.select(Exam::getClassname);
            permissionlist = examService.list(wrapper).stream()
                    .map(Exam::getClassname).toList();
        }else{
            /*
             permission field in Authority store info exam options and the role as teacher / student
             exam options are permission list with student / teacher removed,
             this only left the exam that the student has permission for
             */
            permissionlist.remove(STUDENT);
        }
        return ResponseEntity.ok(permissionlist);
    }
    /**
     * GET - Retrieve exam content for a specified class.
     *
     * This method maps to the "/exam/examContent/{classname}" endpoint. It checks
     * the user's authority to determine whether the request is made by a teacher or a student,
     * and then fetches the corresponding exam content.
     * If the user is student, exam content will be removed if it is not within exam time
     *
     * <p><strong>High Concurrency:</strong>
     * <em>
     *     This is considered a hotspot endpoint.
     *     Note that examContent is cache in Redis with expiration time covered until 7 days after exam ended
     *     This is expected to cover the period in which the endpoint is under frequent access
     *     Frequent access to sql is thus avoided.
     * </em></p>
     *
     * <p><strong>Note:</strong> <em>This operation can only be performed by a teacher.</em></p>
     *
     * <p>Ensure to include a Bearer token in the request header for authentication.</p>
     *
     * @param classname in url path
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
     *     "classname": "Mathematics",
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
