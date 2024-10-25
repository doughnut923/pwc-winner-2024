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
    @Autowired
    private AuthorityMapper authorityMapper;

    @GetMapping("list/{className}")
    public ResponseEntity<List<Authority>> getAuthority(@PathVariable("className") String className) {
        LambdaQueryWrapper<Authority> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Authority::getPermission, className);
        return ResponseEntity.ok(authorityService.list(wrapper));
    }


    /**
     * Grant students permission to class,
     * If in input list there are user who are not recorded as student in database,
     * the request will be considered abnormal and be rejected
     * @see Authority: teacher only
     * @param authorityList
     * @return
     */
    @PutMapping("setAuthorities")
    public ResponseEntity setAuthorities(@RequestBody List<Authority> authorityList) {
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
