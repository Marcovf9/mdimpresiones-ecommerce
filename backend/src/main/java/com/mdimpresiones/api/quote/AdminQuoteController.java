package com.mdimpresiones.api.quote;

import com.mdimpresiones.api.common.NotFoundException;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

/** Bandeja de pedidos de cotizacion recibidos. Requiere token de administrador. */
@RestController
@RequestMapping("/api/admin/quotes")
public class AdminQuoteController {

    private static final int MAX_PAGE_SIZE = 100;

    private final QuoteRequestRepository quotes;

    public AdminQuoteController(QuoteRequestRepository quotes) {
        this.quotes = quotes;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public Page<QuoteSummary> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        int safeSize = Math.clamp(size, 1, MAX_PAGE_SIZE);
        return quotes.findAllByOrderByCreatedAtDesc(PageRequest.of(Math.max(page, 0), safeSize))
                .map(AdminQuoteController::toSummary);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!quotes.existsById(id)) {
            throw NotFoundException.of("la cotizacion", id);
        }
        quotes.deleteById(id);
    }

    private static QuoteSummary toSummary(QuoteRequest quote) {
        return new QuoteSummary(
                quote.getId(),
                quote.getFullName(),
                quote.getCompany(),
                quote.getPhone(),
                quote.getEmail(),
                quote.getProductName(),
                quote.getQuantity(),
                quote.getFormat(),
                quote.getMaterial(),
                quote.getFinishings(),
                quote.getMessage(),
                quote.getCreatedAt());
    }

    public record QuoteSummary(
            Long id,
            String fullName,
            String company,
            String phone,
            String email,
            String productName,
            String quantity,
            String format,
            String material,
            String finishings,
            String message,
            Instant createdAt) {
    }
}
