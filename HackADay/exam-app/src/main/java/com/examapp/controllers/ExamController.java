package com.examapp.controllers;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.examapp.entity.Exam;
import com.examapp.securityConfig.securityDto.SecurityAuthority;
import com.examapp.service.ExamService;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.examapp.predefinedConstant.AuthorityConstants.STUDENT;
import static com.examapp.predefinedConstant.AuthorityConstants.TEACHER;

@RestController
@CrossOrigin
@RequestMapping("exam")
public class ExamController {
    @Resource
    private ExamService examService;
    /**
     * Updates an existing exam or creates a new exam if it doesn't exist.
     *
     * @param exam The Exam object containing the exam details to be updated.
     * @return ResponseEntity<Void> A response entity indicating the result of the update operation.
     *         - Returns 200 OK if the update is successful.
     *         - Returns 500 Internal Server Error if an unexpected error occurs during the update.
     *
     * This method uses the examService to perform the save or update operation.
     * If the operation is successful, it returns a 200 OK response. If the operation
     * fails due to an unexpected condition (e.g., server crash or programming bug),
     * it returns a 500 Internal Server Error response.
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
    @GetMapping("examList")
    public ResponseEntity<List<String>> getExamList() {
        List<String> authorityList = getAuthoritiesFromSecurityContextHolder();
        if(authorityList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
//        String username = jwtUtil.extractUsername(token);
//        LambdaQueryWrapper<Authority> wrapper = new LambdaQueryWrapper<>();
//        wrapper.eq(Authority::getUsername, username);
//        List<Authority> authorities = authorityService.list(wrapper);

        if(authorityList.contains(TEACHER)){
            LambdaQueryWrapper<Exam> wrapper = new LambdaQueryWrapper<>();
            wrapper.select(Exam::getClassname);
            authorityList = examService.list(wrapper).stream()
                    .map(Exam::getClassname).toList();
        }else{
            /*
             authority store info exam options and the role as teacher / student
             exam options are authority list with student / teacher removed
             */
            authorityList.remove(STUDENT);
        }
        return ResponseEntity.ok(authorityList);
    }
    /**
     * Handles HTTP GET requests to retrieve exam content for a specified class.
     * This method checks the user's authority and determines whether the request
     * is made by a teacher or a student, then fetches the corresponding exam content.
     *
     * @param className The name of the class for which the exam content is requested.
     * @return A ResponseEntity containing the Exam object if found and accessible,
     *         or an appropriate HTTP status code:
     *         - 200 OK if the exam is successfully retrieved.
     *         - 401 UNAUTHORIZED if the user has no authority.
     *         - 403 FORBIDDEN if the exam is not accessible (e.g., due to timing or lack of permissions).
     */
    @GetMapping("examContent/{className}")
    public ResponseEntity<Exam> getExamContent(@PathVariable("className") String className) {
        List<String> authorityList = getAuthoritiesFromSecurityContextHolder();
        if(authorityList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // call corresponding method for teachers and students
        Exam exam = null;
        if(authorityList.contains(TEACHER)){
             exam = examService.getExamContentAsTeacher(className);
        }else{
            authorityList.remove(STUDENT);
                exam = examService.getExamContentAsStudent(className, authorityList);
        }
        if(exam == null){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(exam);
    }

    /**
     * Retrieve a string representing authorities from {@link SecurityContextHolder}, which is assigned in the security filter
     *
     *  @return List<String> a list of string containing authorities
     *         - empty string if {@link SecurityContextHolder} is not assigned
     */
    protected List<String> getAuthoritiesFromSecurityContextHolder(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // should be checked already by security filters, this is a double check
        if (authentication == null) {
            return List.of(); // Return an empty list if no authentication is found
        }
        Collection<? extends GrantedAuthority> authorityList = authentication.getAuthorities();
        /*
         Upcasting should be possible as SecurityAuthority is the only subclass used in GrantedAuthority
         Use filters to confirm upcasting is possible
         */
        return  authorityList.stream()
                .filter(authority -> authority instanceof SecurityAuthority)
                .map(authority -> ((SecurityAuthority) authority).getAuthority())
                .collect(Collectors.toList());
    }

}
