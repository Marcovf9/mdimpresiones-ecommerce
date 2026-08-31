package com.mdimpresiones.api.quote;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class WhatsAppLinkBuilderTest {

    private static QuoteRequest sampleQuote() {
        QuoteRequest quote = new QuoteRequest();
        quote.setFullName("Juana Perez");
        quote.setPhone("351 555 1234");
        quote.setCompany("Grafica del Sur");
        quote.setProductName("Carpetas Institucionales");
        quote.setQuantity("250");
        quote.setFormat("A4");
        return quote;
    }

    @Test
    void armaElMensajeSoloConLosCamposCompletos() {
        String message = WhatsAppLinkBuilder.buildMessage(sampleQuote());

        assertThat(message)
                .contains("*Producto:* Carpetas Institucionales")
                .contains("*Cantidad:* 250")
                .contains("*Formato:* A4")
                .contains("*Nombre:* Juana Perez")
                .contains("*Empresa:* Grafica del Sur");
        // Material y Terminaciones quedaron vacios: no deben aparecer.
        assertThat(message).doesNotContain("*Material:*").doesNotContain("*Terminaciones:*");
    }

    @Test
    void limpiaElNumeroYCodificaElTexto() {
        String link = WhatsAppLinkBuilder.buildQuoteLink("+54 9 351 123-4567", sampleQuote());

        assertThat(link).startsWith("https://wa.me/5493511234567?text=");
        // El mensaje viaja url-encoded: sin espacios ni saltos de linea crudos.
        assertThat(link).doesNotContain(" ").doesNotContain("\n");
    }

    @Test
    void sinNumeroConfiguradoNoDevuelveEnlace() {
        assertThat(WhatsAppLinkBuilder.buildQuoteLink("", sampleQuote())).isNull();
        assertThat(WhatsAppLinkBuilder.buildQuoteLink(null, sampleQuote())).isNull();
        assertThat(WhatsAppLinkBuilder.buildPlainLink("  ")).isNull();
    }
}
