package com.moimpresiones.api.quote;

import com.moimpresiones.api.catalog.ProductRepository;
import com.moimpresiones.api.config.AppProperties;
import com.moimpresiones.api.quote.dto.ContactInfo;
import com.moimpresiones.api.quote.dto.CreateQuoteRequest;
import com.moimpresiones.api.quote.dto.QuoteCreatedResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuoteService {

    private static final Logger log = LoggerFactory.getLogger(QuoteService.class);

    private final QuoteRequestRepository quotes;
    private final ProductRepository products;
    private final AppProperties properties;

    public QuoteService(QuoteRequestRepository quotes, ProductRepository products, AppProperties properties) {
        this.quotes = quotes;
        this.products = products;
        this.properties = properties;
    }

    /**
     * Guarda el pedido y devuelve el enlace de WhatsApp con el mensaje armado.
     * Si el slug del producto no existe se guarda igual: no queremos perder el
     * contacto por un dato del catalogo.
     */
    @Transactional
    public QuoteCreatedResponse create(CreateQuoteRequest request) {
        QuoteRequest quote = new QuoteRequest();
        quote.setFullName(request.fullName().trim());
        quote.setPhone(request.phone().trim());
        quote.setEmail(trimToNull(request.email()));
        quote.setCompany(trimToNull(request.company()));
        quote.setQuantity(trimToNull(request.quantity()));
        quote.setFormat(trimToNull(request.format()));
        quote.setMaterial(trimToNull(request.material()));
        quote.setFinishings(trimToNull(request.finishings()));
        quote.setMessage(trimToNull(request.message()));
        quote.setProductName(trimToNull(request.productName()));

        if (request.productSlug() != null && !request.productSlug().isBlank()) {
            products.findBySlug(request.productSlug().trim()).ifPresentOrElse(
                    product -> {
                        quote.setProduct(product);
                        quote.setProductName(product.getName());
                    },
                    () -> log.warn("Cotizacion recibida con un producto desconocido: {}", request.productSlug()));
        }

        QuoteRequest saved = quotes.save(quote);
        String whatsappUrl = WhatsAppLinkBuilder.buildQuoteLink(
                properties.getContact().getWhatsappNumber(), saved);
        return new QuoteCreatedResponse(saved.getId(), whatsappUrl);
    }

    public ContactInfo contactInfo() {
        AppProperties.Contact contact = properties.getContact();
        return new ContactInfo(
                emptyToNull(contact.getWhatsappNumber()),
                WhatsAppLinkBuilder.buildPlainLink(contact.getWhatsappNumber()),
                emptyToNull(contact.getInstagramUrl()),
                emptyToNull(contact.getEmail()));
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static String emptyToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
