package com.examapp.utils;

import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@Component
public class S3Util {
    @Resource
    private S3Client s3Client;

    public void storeInS3(byte [] imageData, String fileName){
        try (InputStream inputStream = new ByteArrayInputStream(imageData)) {
            if (inputStream.available() == 0) {
                log.warn("No data found in the input stream for file: {}", fileName);
                return; // Exit if the input stream is empty
            }

            // Create a temporary file to upload
            Path tempFile = Files.createTempFile("upload-", ".jpg");
            Files.copy(inputStream, tempFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Create a PutObjectRequest
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket("examappbucket")
                    .key(fileName)
                    .build();

            // Upload the file
            s3Client.putObject(request, RequestBody.fromFile(tempFile));


            log.info("File {} uploaded successfully to S3.", fileName);

            // Optionally delete the temporary file
            Files.delete(tempFile);
        } catch (IOException e) {
            log.error("Error while processing the file {}: {}", fileName, e.getMessage());
        }

    }

    public byte[] retrieveFromS3(String fileName) {
        try {
            // Create a GetObjectRequest
            GetObjectRequest request = GetObjectRequest.builder()
                    .bucket("examappbucket")
                    .key(fileName)
                    .build();

            // Retrieve the object from S3
            ResponseInputStream<?> s3Object = s3Client.getObject(request);

            // Read the object data into a byte array
            return readInputStreamToByteArray(s3Object);
        } catch (IOException e) {
            log.error("Error while retrieving the file {}: {}", fileName, e.getMessage());
            return null; // Consider returning an Optional<byte[]> or throwing a custom exception
        }
    }

    private byte[] readInputStreamToByteArray(InputStream inputStream) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[65536];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
            return baos.toByteArray(); // Convert to byte array
        }
    }
}
