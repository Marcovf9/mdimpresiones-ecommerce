package com.mdimpresiones.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuracion propia de la aplicacion, mapeada desde el prefijo "app" de application.yml.
 */
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    /** Origenes permitidos por CORS, separados por coma. */
    private String corsAllowedOrigins = "http://localhost:5173";

    /** Carpeta del disco donde se guardan las imagenes subidas desde el panel admin. */
    private String mediaStoragePath = "./uploads";

    /** Prefijo de URL bajo el que se publican esas imagenes. */
    private String mediaPublicPath = "/media";

    private Jwt jwt = new Jwt();

    public static class Jwt {
        private String secret = "";
        private long expirationMinutes = 480;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public long getExpirationMinutes() {
            return expirationMinutes;
        }

        public void setExpirationMinutes(long expirationMinutes) {
            this.expirationMinutes = expirationMinutes;
        }
    }

    public String[] getCorsOriginsArray() {
        return corsAllowedOrigins.split("\\s*,\\s*");
    }

    public String getCorsAllowedOrigins() {
        return corsAllowedOrigins;
    }

    public void setCorsAllowedOrigins(String corsAllowedOrigins) {
        this.corsAllowedOrigins = corsAllowedOrigins;
    }

    public String getMediaStoragePath() {
        return mediaStoragePath;
    }

    public void setMediaStoragePath(String mediaStoragePath) {
        this.mediaStoragePath = mediaStoragePath;
    }

    public String getMediaPublicPath() {
        return mediaPublicPath;
    }

    public void setMediaPublicPath(String mediaPublicPath) {
        this.mediaPublicPath = mediaPublicPath;
    }

    public Jwt getJwt() {
        return jwt;
    }

    public void setJwt(Jwt jwt) {
        this.jwt = jwt;
    }
}
