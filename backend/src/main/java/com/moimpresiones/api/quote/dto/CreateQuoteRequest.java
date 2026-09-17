package com.moimpresiones.api.quote.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Datos que carga el visitante en la pagina "Cotiza tu proyecto". */
public record CreateQuoteRequest(
        @NotBlank(message = "Contanos tu nombre")
        @Size(max = 160, message = "El nombre es demasiado largo")
        String fullName,

        @NotBlank(message = "Necesitamos un telefono para responderte")
        @Size(max = 60, message = "El telefono es demasiado largo")
        String phone,

        @Email(message = "El email no parece valido")
        @Size(max = 180)
        String email,

        @Size(max = 180)
        String company,

        /** Slug del producto elegido del catalogo, si vino desde una ficha. */
        @Size(max = 140)
        String productSlug,

        /** Producto escrito a mano, cuando no se eligio uno del catalogo. */
        @Size(max = 180)
        String productName,

        @Size(max = 120)
        String quantity,

        @Size(max = 180)
        String format,

        @Size(max = 180)
        String material,

        @Size(max = 500)
        String finishings,

        @Size(max = 4000, message = "El detalle es demasiado largo")
        String message) {
}
