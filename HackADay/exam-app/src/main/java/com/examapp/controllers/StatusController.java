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
/**
 * <ul>
 *   <li>Handles operations related to student verification and suspicious image management.</li>
 *   <li>APIs available:
 *     <ol>
 *       <li>check if the input image matches the stored user image (<code>checkFaces</code>)</li>
 *       <li>retrieve a list of suspicious images for a specific user and class (<code>getSuspiciousImageList</code>)</li>
 *       <li>retrieve a list of students along with their suspicious status (<code>getSuspiciousList</code>)</li>
 *     </ol>
 *   </li>
 *   <li>Available to teachers only:
 *     <ul>
 *       <li><code>getSuspiciousImageList</code>:
 *       <li><code>getSuspiciousList</code>
 *     </ul>
 *   </li>
 * </ul>
 */
@CrossOrigin
@RestController
@RequestMapping("status")
public class StatusController {

    @Resource
    private ExamStatusService examStatusService;
    /**
     * GET - Checks if the input face image matches the image stored during examination.
     *
     * <p>This method maps to the "/status/suspicious/checkFaces" endpoint.</p>
     * <p>
     *     It compares the input image with the stored image. If the faces do not match,
     * or if multiple people are present in the image, the image will be stored in S3 for one month.
     * </p>
     * <p>Additionally, the username and the image path will be stored in Redis as part of the "suspicious list."</p>
     *
     * @param imageFile The image file uploaded for comparison (required).
     * @param classname The name of the exam class (required).
     *
     * @return A ResponseEntity containing a boolean indicating whether the image is suspicious.
     *
     * <p>Ensure to include a Bearer token in the request header for authentication.</p>
     *
     * <p>Note: This operation can only be performed by a teacher.</p>
     *
     * <p>Example response:</p>
     * <pre>
     *      false
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
     * This method maps to the "/status/suspiciousImage" endpoint.
     * It fetches a list of suspicious image stored in Redis based on the provided
     * class name and username.
     *
     * <p>Ensure to include a Bearer token in the request header for authentication.</p>
     *
     * <p>Note: This operation can only be performed by a teacher.</p>
     *
     * @param classname The name of the class for which to retrieve suspicious images (required).
     * @param username The username of the user for whom suspicious images are being retrieved (required).
     * @return A ResponseEntity containing a list of maps, where each map represents
     *         a suspicious image with relevant details.
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
     * This method maps to the "/status/suspicious/list" endpoint.
     * Retrieves a list of students from a specified class along with their suspicious status.
     *
     * <p>Ensure to include a Bearer token in the request header for authentication.</p>
     *
     * <p>Note: This operation can only be performed by a teacher.</p>
     *
     * @param classname the name of the class for which to retrieve the suspicious student list
     * @return a list of maps, where each map contains the username of a student and a boolean indicating
     *         whether the student has suspicious images
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
