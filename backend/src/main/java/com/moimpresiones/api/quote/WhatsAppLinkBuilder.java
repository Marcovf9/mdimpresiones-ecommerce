package com.moimpresiones.api.quote;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/** Arma el enlace wa.me con el pedido de cotizacion ya redactado. */
public final class WhatsAppLinkBuilder {

    private WhatsAppLinkBuilder() {
    }

    /**
     * @param number numero en formato internacional sin signos (ej: 5493511234567).
     *               Si viene vacio se devuelve null: el frontend muestra los datos
     *               de contacto alternativos en lugar del boton.
     */
    public static String buildQuoteLink(String number, QuoteRequest quote) {
        if (number == null || number.isBlank()) {
            return null;
        }
        return "https://wa.me/" + sanitizeNumber(number)
                + "?text=" + URLEncoder.encode(buildMessage(quote), StandardCharsets.UTF_8);
    }

    public static String buildPlainLink(String number) {
        if (number == null || number.isBlank()) {
            return null;
        }
        return "https://wa.me/" + sanitizeNumber(number);
    }

    static String buildMessage(QuoteRequest quote) {
        List<String> lines = new ArrayList<>();
        lines.add("Hola MO Impresiones! Quiero cotizar un proyecto.");
        lines.add("");
        addLine(lines, "Producto", productLabel(quote));
        addLine(lines, "Cantidad", quote.getQuantity());
        addLine(lines, "Formato", quote.getFormat());
        addLine(lines, "Material", quote.getMaterial());
        addLine(lines, "Terminaciones", quote.getFinishings());
        addLine(lines, "Detalle", quote.getMessage());
        lines.add("");
        addLine(lines, "Nombre", quote.getFullName());
        addLine(lines, "Empresa", quote.getCompany());
        addLine(lines, "Telefono", quote.getPhone());
        addLine(lines, "Email", quote.getEmail());
        return String.join("\n", lines).trim();
    }

    private static String productLabel(QuoteRequest quote) {
        if (quote.getProduct() != null) {
            return quote.getProduct().getName();
        }
        return quote.getProductName();
    }

    private static void addLine(List<String> lines, String label, String value) {
        if (value != null && !value.isBlank()) {
            lines.add("*" + label + ":* " + value.trim());
        }
    }

    /** WhatsApp solo acepta digitos en la ruta del enlace. */
    private static String sanitizeNumber(String number) {
        return number.replaceAll("\\D", "");
    }
}
