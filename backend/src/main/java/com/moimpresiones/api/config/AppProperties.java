package com.moimpresiones.api.config;

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

    /** URL publica del sitio, sin barra final. Necesaria para el sitemap. */
    private String publicUrl = "";

    private Jwt jwt = new Jwt();

    private Contact contact = new Contact();

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

    /** Datos de contacto de la imprenta, usados por el menu y por el cotizador. */
    public static class Contact {

        /** Numero de WhatsApp en formato internacional sin signos: 549351XXXXXXX. */
        private String whatsappNumber = "";

        private String instagramUrl = "";

        private String email = "";

        public String getWhatsappNumber() {
            return whatsappNumber;
        }

        public void setWhatsappNumber(String whatsappNumber) {
            this.whatsappNumber = whatsappNumber;
        }

        public String getInstagramUrl() {
            return instagramUrl;
        }

        public void setInstagramUrl(String instagramUrl) {
            this.instagramUrl = instagramUrl;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
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

    public String getPublicUrl() {
        return publicUrl;
    }

    public void setPublicUrl(String publicUrl) {
        this.publicUrl = publicUrl;
    }

    public Jwt getJwt() {
        return jwt;
    }

    public void setJwt(Jwt jwt) {
        this.jwt = jwt;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }
}
