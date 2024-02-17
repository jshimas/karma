package com.jshimas.karmaapi.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.people.v1.model.Person;
import com.jshimas.karmaapi.domain.dto.GoogleAccountData;
import com.jshimas.karmaapi.domain.exceptions.UnauthorizedGoogleAccessException;
import com.jshimas.karmaapi.services.GoogleService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoogleServiceImpl implements GoogleService {
    private final ObjectMapper objectMapper;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Override
    public String generateAuthorizationCodeRequestUrl() {
        return new GoogleAuthorizationCodeRequestUrl(
                googleClientId,
                "http://localhost:5173/oauth2/callback/google",
                List.of("email", "profile", "openid")
        ).setAccessType("offline").build();
    }

    private String getAccessToken(String authCode) {
        String token;
        try {
            token = new GoogleAuthorizationCodeTokenRequest(
                    new NetHttpTransport(),
                    new GsonFactory(),
                    googleClientId,
                    googleClientSecret,
                    authCode,
                    "http://localhost:5173/oauth2/callback/google"
            ).execute().getAccessToken();
        } catch (IOException ex) {
            System.out.println(ExceptionUtils.getStackTrace(ex));
            throw new UnauthorizedGoogleAccessException();
        }

        if (token == null) {
            throw new RuntimeException("Failed to retrieve access token");
        }

        return token;
    }

    @Override
    public GoogleAccountData getAccountData(String authCode) {
        String token = getAccessToken(authCode);

        WebClient webClient = WebClient.builder()
                .baseUrl("https://people.googleapis.com/v1").build();

        Person person = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/people/me")
                        .queryParam("personFields", "names,coverPhotos,emailAddresses")
                        .build())
                .header("Authorization", "Bearer " + token)
                .header("Accept", "application/json")
                .retrieve()
                .bodyToMono(Person.class)
                .block();

        if (person == null) {
            throw new RuntimeException("Couldn't retrieve Google profile data");
        }

        return extractGoogleAccountData(person);
    }

    private GoogleAccountData extractGoogleAccountData(Person person) {
        var name = objectMapper.convertValue(person.getNames().get(0), LinkedHashMap.class);
        var email = objectMapper.convertValue(person.getEmailAddresses().get(0), LinkedHashMap.class);
        var coverPhoto = objectMapper.convertValue(person.getCoverPhotos().get(0), LinkedHashMap.class);

        return new GoogleAccountData(
                (String) name.get("givenName"),
                (String) name.get("familyName"),
                (String) coverPhoto.get("url"),
                (String) email.get("value")
        );
    }
}
