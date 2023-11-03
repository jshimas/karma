package com.jshimas.karmaapi;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class KarmaApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(KarmaApiApplication.class, args);
    }

    @Bean
    public JtsModule jtsModule() {
        return new JtsModule();
    }
}
