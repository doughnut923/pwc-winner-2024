package com.examapp.service;

public interface ExamStatusService {
    /**
     * Checks if the input image matches the user's stored image retrieved from S3.
     *
     * This method retrieves the user's image from S3 based on the username obtained
     * from the security context. It then compares the input image with the retrieved
     * image using a face comparison utility. If the faces do not match, the input
     * image is uploaded to S3 and stay there for 30 days. The corresponding image
     * path is store in redis.
     *
     * @param inputImage The byte array representation of the image to be checked.
     * @return true if the faces match; false if they do not match.
     * @throws Exception If any error occurs during image retrieval, comparison,
     *                   or storage operations.
     */
    boolean checkFaces(byte[] inputImage) throws Exception;
}
