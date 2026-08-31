package com.mdimpresiones.api.media;

import com.mdimpresiones.api.config.AppProperties;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Guarda en disco las imagenes que sube el panel y devuelve la URL publica.
 *
 * <p>El nombre original que manda el navegador nunca se usa como ruta: se genera
 * un UUID y la extension sale del tipo de contenido, de modo que no hay forma de
 * escribir fuera de la carpeta configurada.
 */
@Service
public class MediaStorageService {

    private static final Logger log = LoggerFactory.getLogger(MediaStorageService.class);

    /** Unicos tipos aceptados, con la extension que les corresponde. */
    private static final Map<String, String> ALLOWED_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/avif", ".avif",
            "video/mp4", ".mp4");

    private final AppProperties properties;
    private Path storageRoot;

    public MediaStorageService(AppProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    void init() throws IOException {
        this.storageRoot = Paths.get(properties.getMediaStoragePath()).toAbsolutePath().normalize();
        Files.createDirectories(storageRoot);
        log.info("Las imagenes del panel se guardan en {}", storageRoot);
    }

    /**
     * @return la URL publica del archivo guardado, lista para persistir en la base.
     * @throws InvalidMediaException si el archivo viene vacio o con un tipo no permitido.
     */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidMediaException("El archivo esta vacio");
        }

        String contentType = file.getContentType() == null
                ? ""
                : file.getContentType().toLowerCase(Locale.ROOT).trim();
        String extension = ALLOWED_TYPES.get(contentType);
        if (extension == null) {
            throw new InvalidMediaException(
                    "Formato no admitido. Se aceptan JPG, PNG, WebP, AVIF y MP4.");
        }

        String filename = UUID.randomUUID() + extension;
        Path target = storageRoot.resolve(filename).normalize();
        if (!target.startsWith(storageRoot)) {
            throw new InvalidMediaException("Ruta de destino invalida");
        }

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new InvalidMediaException("No pudimos guardar el archivo: " + ex.getMessage());
        }

        return properties.getMediaPublicPath() + "/" + filename;
    }

    /** Borra el archivo asociado a una URL publica. No falla si ya no existe. */
    public void delete(String publicUrl) {
        if (publicUrl == null || !publicUrl.startsWith(properties.getMediaPublicPath() + "/")) {
            return;
        }
        String filename = publicUrl.substring(properties.getMediaPublicPath().length() + 1);
        Path target = storageRoot.resolve(filename).normalize();
        if (!target.startsWith(storageRoot)) {
            return;
        }
        try {
            Files.deleteIfExists(target);
        } catch (IOException ex) {
            log.warn("No se pudo borrar {}: {}", target, ex.getMessage());
        }
    }
}
