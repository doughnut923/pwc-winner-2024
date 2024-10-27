package com.examapp;


import com.examapp.entity.User;
import com.examapp.mapper.UserMapper;
import com.examapp.service.impl.UserServiceImpl;
import com.examapp.utils.ComparingFaces;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.util.FileUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@SpringBootTest
@Slf4j
class ExamAppApplicationTests {
    @Resource
    UserMapper userMapper;
    @Resource
    ComparingFaces comparingFaces;
    @Autowired
    private UserServiceImpl userServiceImpl;
    @Resource
    S3Client s3Client;
    @Test
    void contextLoads() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encode = encoder.encode("123456");
        log.info(encode);
        boolean matches = encoder.matches("123456", "$2a$10$VwgOZzM/LNiKrHrsrU55zONE3tMW1TA2pPorFvfXEhD36ZXnVrMZa");
        log.info("{}",matches);

    }
    @Test
    void testSql(){
        User user = userMapper.selectById(1);
        log.info("{}",user);
    }
    @Test
    void testConvertImageBinary() throws IOException {
        String filepath = "chenglong.jpg"; // File in classpath
        String outputFilePath = "output/chenglong_copy.jpg"; // Output file path

        // Create output directory if it doesn't exist
        new File("output").mkdirs();

        try (InputStream inputStream = FileUtil.class.getClassLoader().getResourceAsStream(filepath);
             FileOutputStream outputStream = new FileOutputStream(outputFilePath)) {

            if (inputStream == null) {
                System.err.println("File not found: " + filepath);
                return;
            }

            // Read all bytes from the input stream
            byte[] bytes = inputStream.readAllBytes();

            // Write bytes to the output file
            outputStream.write(bytes);
            System.out.println("File written successfully to " + outputFilePath);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

//    @Test
//    void testUpload() throws Exception {
//        String filepath = "Jacky.jpg";
//
//        // Using try-with-resources to ensure InputStream is closed properly
//        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(filepath)) {
//            if (inputStream == null) {
//                throw new IllegalArgumentException("File not found: " + filepath);
//            }
//
//            User user = new User();
//            // Read all bytes from the InputStream and set it to the user
//            user.setImageData(inputStream.readAllBytes());
//            user.setPassword("111111");
//            user.setUsername("Jacky");
//
//            // Save the user object
//            userServiceImpl.register(user);
//        } catch (Exception e) {
//            e.printStackTrace(); // Log the exception for debugging
//            throw e; // Rethrow the exception if needed
//        }
//    }

    @Test
    void svaeImageToS3() throws Exception {

        String fileName = "Jacky.jpg";
        InputStream inputStream = ExamAppApplicationTests.class.getClassLoader().getResourceAsStream(fileName);

        if (inputStream == null) {
            System.out.println("File not found: " + fileName);
            return; // Exit if the file is not found
        }

        // Create a temporary file to upload
        try {
            Path tempFile = Files.createTempFile("upload-", ".jpg");
            Files.copy(inputStream, tempFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            File file = tempFile.toFile();

            // Create a PutObjectRequest
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket("examappbucket")
                    .key(fileName)
                    .build();

            // Upload the file
            s3Client.putObject(request, RequestBody.fromFile(file));

            System.out.println("File uploaded successfully to S3.");

            // Optionally delete the temporary file
            Files.delete(tempFile);

        } catch (IOException e) {
            System.out.println("Error while processing the file: " + e.getMessage());
        } finally {
            // Close the S3 client
            s3Client.close();
        }
    }
}
