package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.GoogleAccountData;

public interface GoogleService {
    String generateAuthorizationCodeRequestUrl(String redirectUri);
    GoogleAccountData getAccountData(String authCode, String redirectUri);
}
