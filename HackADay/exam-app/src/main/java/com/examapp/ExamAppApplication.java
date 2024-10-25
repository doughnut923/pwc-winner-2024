package com.examapp;

import com.examapp.utils.ComparingFaces;
import lombok.Data;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@SpringBootApplication
@MapperScan(basePackages = "com.examapp.mapper")
@EnableAspectJAutoProxy(exposeProxy = true)
@ConfigurationProperties(prefix = "aws.credentials")
@Data
public class ExamAppApplication {
    private String accessKey;
    private String secretKey;

    public static void main(String[] args) {
        SpringApplication.run(ExamAppApplication.class, args);
    }
    @Bean
    public AwsBasicCredentials awsBasicCredentials() {
        return AwsBasicCredentials.create(accessKey, secretKey);
    }
    @Bean("s3Client")
    public S3Client S3Client(AwsBasicCredentials awsCredentials) {
        return S3Client.builder()
                .region(Region.AP_NORTHEAST_1)
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }
}
