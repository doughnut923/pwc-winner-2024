package com.examapp.controllers;

import com.examapp.service.ExamService;
import com.examapp.service.ExamStatusService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("status")
public class StatusController {

    @Resource
    private ExamStatusService examStatusService;
    /**
     * POST - Checks if the input image matches the user's stored image retrieved from S3.
     *
     * This method retrieves the user's image from S3 based on the username obtained
     * from the security context. It then compares the provided image file. If the faces
     * do not match, the input image is uploaded to S3 and remains there for 30 days.
     * The corresponding image path is stored in Redis.
     *
     * @param imageFile The byte array representation of the image to be checked.
     * @return A ResponseEntity containing true if the faces match; false if they do not match.
     * @throws Exception If any error occurs during image retrieval, comparison,
     *                   or storage operations.
     *
     * <p>Example response for successful face match:</p>
     * <pre>
     * {
     *     "result": true
     * }
     * </pre>
     *
     * <p>Example response for face mismatch:</p>
     * <pre>
     * {
     *     "result": false
     * }
     * </pre>
     */
    @PostMapping
    ResponseEntity<Boolean> checkFaces(
            @RequestParam("imageFile") MultipartFile imageFile
    )throws Exception{
        if (imageFile.isEmpty()) {
            return ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).build();
        }
        boolean faceMatch = examStatusService.checkFaces(imageFile.getBytes());
        if (faceMatch) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }

}
