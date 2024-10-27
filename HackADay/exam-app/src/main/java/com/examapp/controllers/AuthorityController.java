package com.examapp.controllers;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.examapp.entity.Authority;
import com.examapp.mapper.AuthorityMapper;
import com.examapp.service.AuthorityService;
import com.examapp.utils.JwtUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;




@RestController
@CrossOrigin
@RequestMapping("authority")
public class AuthorityController {
    @Resource
    private AuthorityService authorityService;
    @Resource
    private JwtUtil jwtUtil;

    /**
     * GET - Handles requests to retrieve a list of students for a specified class.
     *
     * This method maps to the endpoint "/studentList/{className}" and retrieves
     * the student list associated with the provided class name. It uses the
     * authorityMapper to access the data layer and fetch the relevant
     * student information.
     *
     * <p>Note: This operation can only be performed by a teacher.</p>
     *
     * <p>Return values:</p>
     * <ul>
     *     <li>200 OK with a list of student names if the retrieval is successful.</li>
     *     <li>404 Not Found if no students are found for the specified class.</li>
     * </ul>
     *
     * <p>Example response for a successful retrieval:</p>
     * <pre>
     * [
     *     "Alice",
     *     "Bob",
     *     "Charlie"
     * ]
     * </pre>
     *
     * <p>Example response for no students found:</p>
     * <pre>
     * []
     * </pre>
     *
     * @param className The name of the class for which to retrieve the student list.
     * @return A ResponseEntity containing a list of student names as strings.
     */
    @GetMapping("studentList/{className}")
    public ResponseEntity<List<String>> getStudentList(@PathVariable("className") String className) {
        List<String> studentList = authorityService.getStudentListByClassname(className);
        return ResponseEntity.ok(studentList);
    }


    /**
     * PUT - Grants permissions to students for a specified class based on the provided authority list.
     *
     * This method handles requests to the "/setAuthorities" endpoint. It checks
     * the provided list of authorities to ensure that all users in the list are recorded
     * as students in the database. If any user is not found or if the input list is
     * invalid (null or empty), the request will be rejected with a 400 Bad Request response.
     *
     * <p>Note: This operation can only be performed by a teacher.</p>
     *
     * @param authorityList A list of Authority objects representing the students and
     *                      their associated permissions. Each Authority must correspond
     *                      to a valid student in the database.
     *                      Example JSON representation:
     *                      <pre>
     *                      [
     *                          {
     *                              "username": "Jacky",
     *                              "permission": "Linear algebra"
     *                          },
     *                          {
     *                              "username": "Jacky",
     *                              "permission": "University Calculus"
     *                          }
     *                      ]
     *                      </pre>
     * @return A ResponseEntity indicating the outcome of the operation:
     *         <ul>
     *             <li>200 OK if permissions were successfully granted.</li>
     *             <li>400 Bad Request if the input list is null, empty, or contains invalid users.</li>
     *         </ul>
     */
    @PutMapping("setAuthorities")
    public ResponseEntity<Void> setAuthorities(@RequestBody List<Authority> authorityList) {
        if(authorityList == null || authorityList.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        boolean flag = authorityService.insertAuthorityWithChecking(authorityList);
        if(flag) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }



}
