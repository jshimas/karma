package com.jshimas.karmaapi;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class KarmaApiApplication {
    @Value("${spring.datasource.url}")
    private static String url;
    @Value("${spring.datasource.password}")
    private static String pass;
    @Value("${spring.datasource.username}")
    private static String username;

    public static void main(String[] args) {
        SpringApplication.run(KarmaApiApplication.class, args);
        System.out.println(url);
        System.out.println(username);
        System.out.println(pass);
    }

    @Bean
    public JtsModule jtsModule() {
        return new JtsModule();
    }
}
