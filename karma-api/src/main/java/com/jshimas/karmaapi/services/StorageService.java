package com.jshimas.karmaapi.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    String saveImage(MultipartFile file, String fileName) throws IOException;
    String savePDF(byte[] file, String fileName) throws IOException;
    String getFileUrl(String fileName);
    boolean exists(String fileName);
}
