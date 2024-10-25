package com.examapp;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@MapperScan(basePackages = "com.examapp.mapper")
@EnableAspectJAutoProxy(exposeProxy = true)
public class ExamAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExamAppApplication.class, args);
    }

}
