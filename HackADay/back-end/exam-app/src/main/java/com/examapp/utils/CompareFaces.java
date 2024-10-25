package com.examapp.utils;



import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.rekognition.AmazonRekognition;
import com.amazonaws.services.rekognition.AmazonRekognitionClientBuilder;
import com.amazonaws.services.rekognition.model.CompareFacesRequest;
import com.amazonaws.services.rekognition.model.CompareFacesResult;
import com.amazonaws.util.IOUtils;

import com.amazonaws.services.rekognition.model.Image;
import com.amazonaws.services.rekognition.model.BoundingBox;
import com.amazonaws.services.rekognition.model.CompareFacesMatch;
import com.amazonaws.services.rekognition.model.ComparedFace;
import com.examapp.entity.User;
import com.examapp.service.UserService;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.util.List;
import java.io.InputStream;
import java.nio.ByteBuffer;

@Component
@ConfigurationProperties(prefix = "aws")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class CompareFaces {

    @Resource
    private UserService userService;
    private String accessKey;
    private String secretKey;
    private Float similarityThreshold;

    public boolean compareFaces(User user) throws Exception{

        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
        AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion(Regions.AP_NORTHEAST_1) // Change to your desired region
                .build();


        //Load source and target images and create input parameters
        byte[] retrievedImageStream = userService.getImageByUsername(user.getUsername());

  //      ByteBuffer targetImageBytes = ByteBuffer.wrap(IOUtils.toByteArray(new ByteArrayInputStream(user.getImageData())));
        ByteBuffer sourceImageBytes = ByteBuffer.wrap(retrievedImageStream);
        ByteBuffer targetImageBytes = sourceImageBytes.duplicate();
        System.out.println("targetImageBytes = " + targetImageBytes.toString());
        Image source=new Image()
                .withBytes(sourceImageBytes);
        Image target=new Image()
                .withBytes(targetImageBytes);

        CompareFacesRequest request = new CompareFacesRequest()
                .withSourceImage(source)
                .withTargetImage(target)
                .withSimilarityThreshold(similarityThreshold);

        // Call operation
        CompareFacesResult compareFacesResult=rekognitionClient.compareFaces(request);

        List<com.amazonaws.services.rekognition.model.CompareFacesMatch> faceDetails = compareFacesResult.getFaceMatches();

        List<com.amazonaws.services.rekognition.model.ComparedFace> uncompared = compareFacesResult.getUnmatchedFaces();
        log.info("{}", uncompared.isEmpty());
        return uncompared.isEmpty();
    }
}
