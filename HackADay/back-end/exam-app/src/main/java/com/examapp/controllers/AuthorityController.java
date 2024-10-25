package com.examapp.controllers;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.examapp.entity.Authority;
import com.examapp.service.AuthorityService;
import com.examapp.utils.JwtUtil;
import jakarta.annotation.Resource;
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

    @GetMapping("list/{className}")
    public ResponseEntity<List<Authority>> getAuthority(@PathVariable("className") String className) {
        LambdaQueryWrapper<Authority> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Authority::getAuthority, className);
        return ResponseEntity.ok(authorityService.list(wrapper));
    }
    @GetMapping("examOptions")
    public ResponseEntity<List<Authority>> getExamOptions(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token);
        LambdaQueryWrapper<Authority> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Authority::getUsername, username);
        List<Authority> list = authorityService.list(wrapper);
        return ResponseEntity.ok(list);
    }

}
