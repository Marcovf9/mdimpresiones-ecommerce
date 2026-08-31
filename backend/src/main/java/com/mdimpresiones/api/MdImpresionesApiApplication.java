package com.mdimpresiones.api;

import com.mdimpresiones.api.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class MdImpresionesApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MdImpresionesApiApplication.class, args);
    }
}
