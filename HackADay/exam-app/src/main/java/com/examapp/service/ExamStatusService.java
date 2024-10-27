package com.examapp.service;

import java.util.List;
import java.util.Map;

public interface ExamStatusService {
    /**
     * Checks if the input image matches the user's stored image retrieved from S3.
     *
     * This method retrieves the user's image from S3 based on the username obtained
     * from the security context. It then compares the input image with the retrieved
     * image using a face comparison utility. If the faces do not match, the input
     * image is uploaded to S3 and stay there for 30 days. The corresponding image
     * path and timestamp is store in redis.
     *
     * @param inputImage The byte array representation of the image to be checked.
     * @return true if the faces match; false if they do not match.
     * @throws Exception If any error occurs during image retrieval, comparison,
     *                   or storage operations.
     */
    boolean checkFaces(byte[] inputImage, String classname) throws Exception;
    /**
     * Retrieves a list of suspicious images for a specified class and user.
     *
     * This method fetches images that have been flagged as suspicious based on
     * the provided class name and username. The images are returned in a structured
     * format, including relevant details such as the image URL, timestamp, and reason
     * for being flagged.
     *
     * @param classname The name of the class for which to retrieve suspicious images (required).
     * @param username The username of the user for whom suspicious images are being retrieved (required).
     * @return A list of maps, where each map contains details of a suspicious image.
     *         Each map may include:
     *         <ul>
     *             <li>imageFile: suspicious image (in byte[])</li>
     *             <li>timestamp: timestamp which the image is taken (in epoch milli)</li>
     *         </ul>
     *
     */
    List<Map> getSuspiciousImageList(String classname, String username);
    /**
     * Retrieves a list of students from a specified class along with their suspicious status.
     *
     * @param classname the name of the class for which to retrieve the suspicious student list
     * @return a list of maps, where each map contains the username of a student and a boolean indicating
     *         whether the student has suspicious images
     *         <ul>
     *             <li>username: student name</li>
     *             <li>suspicious: true/ false</li>
     *         </ul>
     */
    List<Map> getSuspiciousStudentList(String classname);
}
