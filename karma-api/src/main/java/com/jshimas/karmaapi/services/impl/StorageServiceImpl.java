package com.jshimas.karmaapi.services.impl;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.jshimas.karmaapi.services.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class StorageServiceImpl implements StorageService {

    @Value("${aws.bucket.name}")
    private String bucketName;

    private final AmazonS3 s3Client;

    private final List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");

    public StorageServiceImpl(
            @Value("${aws.bucket.name}") String bucketName,
            @Value("${aws.accessKeyId}") String accessKeyId,
            @Value("${aws.secretKey}") String secretKey,
            @Value("${aws.region}") String region
    ) {
        this.bucketName = bucketName;
        AWSCredentials credentials = new BasicAWSCredentials(accessKeyId, secretKey);
        this.s3Client = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region)
                .build();
    }

    @Override
    public String saveImage(MultipartFile file, String fileName) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot save empty file.");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFileName);

        if (!allowedExtensions.contains(fileExtension)) {
            throw new IllegalArgumentException("File extension not allowed.");
        }

        String storedFileName = generateFileName(fileName, fileExtension);

        try {
            if (!s3Client.doesObjectExist(bucketName, storedFileName)) {
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentLength(file.getSize());
                metadata.setContentType(file.getContentType());

                s3Client.putObject(new PutObjectRequest(bucketName, storedFileName, file.getInputStream(), metadata));
            }

            return s3Client.getUrl(bucketName, storedFileName).toString();
        } catch (IOException ex) {
            throw new IOException("Failed to store file " + originalFileName, ex);
        }
    }

    @Override
    public String savePDF(byte[] file, String fileName) {
        String fileExtension = getFileExtension(fileName);

        if (!fileExtension.equals("pdf")) {
            throw new IllegalArgumentException("File extension not allowed.");
        }

        if (!s3Client.doesObjectExist(bucketName, fileName)) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.length);

            s3Client.putObject(bucketName, fileName, new ByteArrayInputStream(file), metadata);
        }

        return s3Client.getUrl(bucketName, fileName).toString();

    }

    @Override
    public String getFileUrl(String fileName) {
        return s3Client.getUrl(bucketName, fileName).toString();
    }

    @Override
    public boolean exists(String fileName) {
        return s3Client.doesObjectExist(bucketName, fileName);
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex != -1 && dotIndex < fileName.length() - 1) {
            return fileName.substring(dotIndex + 1).toLowerCase();
        }
        throw new IllegalArgumentException("Invalid file name");
    }

    private String generateFileName(String organizationName, String extension) {
        return organizationName.replace(' ', '_') + "." + extension;
    }
}
