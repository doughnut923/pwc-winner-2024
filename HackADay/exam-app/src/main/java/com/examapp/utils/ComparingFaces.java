package com.examapp.utils;



import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.rekognition.RekognitionClient;
import software.amazon.awssdk.services.rekognition.model.*;

import java.util.List;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
@ConfigurationProperties(prefix = "aws.settings")
public class ComparingFaces {


    @Resource
    private AwsBasicCredentials awsCredentials;
    @Resource
    private S3Utils s3Utils;

    private float similarityThreshold;

    public boolean compareFaces(byte[] inputImage, byte[] storedImage) throws Exception{
        RekognitionClient rekognitionClient = RekognitionClient.builder()
                .region(Region.AP_NORTHEAST_1) // Change region as needed
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();


        //Load source and target images and create input parameters



        SdkBytes targetImageBytes = SdkBytes.fromByteArray(inputImage);
        SdkBytes sourceImageBytes = SdkBytes.fromByteArray(storedImage);

        Image source = Image.builder()
                .bytes(sourceImageBytes)
                .build();

        Image target = Image.builder()
                .bytes(targetImageBytes)
                .build();

        // Create CompareFacesRequest
        CompareFacesRequest request = CompareFacesRequest.builder()
                .sourceImage(source)
                .targetImage(target)
                .similarityThreshold(similarityThreshold)
                .build();

        // Call operation
        CompareFacesResponse compareFacesResponse = rekognitionClient.compareFaces(request);

        List<CompareFacesMatch> faceDetails = compareFacesResponse.faceMatches();
        List<ComparedFace> uncompared = compareFacesResponse.unmatchedFaces();

        log.debug("{}", uncompared.isEmpty());

        return uncompared.isEmpty();
    }
}
