package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.Participation;
import com.jshimas.karmaapi.entities.User;

public interface CertificationService {
    String generateCertificate(Participation participation);
}
