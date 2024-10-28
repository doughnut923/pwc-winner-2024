package com.examapp.controllers;

import com.examapp.service.ExamStatusService;
import com.examapp.utils.SecurityContextHolderUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin
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
     * The corresponding image path and timestamp are stored in Redis.
     *
     * @param imageFile The image file uploaded as part of the request, representing
     *                  the user's face for verification (required).
     * @param classname The name of the class associated with the user (required).
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
    @PostMapping(value = "/checkFaces", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    ResponseEntity<Boolean> checkFaces(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestPart("classname") String classname
    )throws Exception{
        List<String> permission = SecurityContextHolderUtil.getPermissionsFromSecurityContextHolder();

        if(! permission.contains(classname)){
            // student not in the class t_user
            return ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).build();
        }
        if (imageFile.isEmpty()) {
            return ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).build();
        }
        boolean faceMatch = examStatusService.checkFaces(imageFile.getBytes(), classname);
        if (faceMatch) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }
    /**
     * GET - Retrieves a list of suspicious images for a specified class and user.
     *
     * This method processes GET requests to the "/suspiciousImage" endpoint.
     * It fetches a list of images flagged as suspicious based on the provided
     * class name and username. The method returns the list of suspicious images
     * in a structured format.
     *
     * @param classname The name of the class for which to retrieve suspicious images (required).
     * @param username The username of the user for whom suspicious images are being retrieved (required).
     * @return A ResponseEntity containing a list of maps, where each map represents
     *         a suspicious image with relevant details.
     *
     *      <p>Note: This operation can only be performed by a teacher.</p>
     *
     * <p>Example response:</p>
     * <pre>
     * [
     *     {
     *         "imageFile": suspicious image (in byte[]),
     *         "timestamp": timestamp which the image is taken (in epoch milli)
     *     },
     *     {
     *         "imageFile": suspicious image (in byte[]),
     *         "timestamp": timestamp which the image is taken (in epoch milli)
     *     }
     * ]
     * </pre>
     */
    @GetMapping("/suspiciousImage")
    public ResponseEntity<List<Map>> getSuspiciousImageList(@RequestParam String classname, @RequestParam String username){
        return ResponseEntity.ok(examStatusService.getSuspiciousImageList(classname, username));
    }
    /**
     * GET - Retrieves a list of student with suspicious marked.
     *
     * This method processes GET requests to the "/suspcious/list" endpoint.
     * Retrieves a list of students from a specified class along with their suspicious status.
     *
     * @param classname the name of the class for which to retrieve the suspicious student list
     * @return a list of maps, where each map contains the username of a student and a boolean indicating
     *         whether the student has suspicious images
     *      <p>Note: This operation can only be performed by a teacher.</p>
     *
     * <p>Example response:</p>
     * <pre>
     * [
     *     {
     *         "username": "student name 1",
     *         "suspicious": true
     *     },
     *     {
     *         "username": "student name 2",
     *         "suspicious": false
     *     }
     * ]
     * </pre>
     */
    @GetMapping("/suspicious/list")
    public ResponseEntity<List<Map>> getSuspiciousList(@RequestParam String classname){
        return ResponseEntity.ok(examStatusService.getSuspiciousStudentList(classname));
    }
}
