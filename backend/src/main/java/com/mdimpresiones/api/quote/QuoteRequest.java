package com.mdimpresiones.api.quote;

import com.mdimpresiones.api.catalog.Product;
import jakarta.persistence.*;
import java.time.Instant;

/**
 * Pedido de cotizacion enviado desde la pagina "Cotiza tu proyecto".
 * Se guarda para que la imprenta no dependa solo del chat de WhatsApp.
 */
@Entity
@Table(name = "quote_requests")
public class QuoteRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 160)
    private String fullName;

    @Column(length = 180)
    private String email;

    @Column(nullable = false, length = 60)
    private String phone;

    @Column(length = 180)
    private String company;

    /** Producto elegido del catalogo, si el pedido salio de una ficha. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    /** Nombre del producto tal como lo escribio el cliente, si no eligio uno del catalogo. */
    @Column(name = "product_name", length = 180)
    private String productName;

    @Column(length = 120)
    private String quantity;

    @Column(name = "format", length = 180)
    private String format;

    @Column(length = 180)
    private String material;

    @Column(length = 500)
    private String finishings;

    @Column(columnDefinition = "text")
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuoteStatus status = QuoteStatus.PENDIENTE;

    /** Notas del equipo sobre el pedido. Nunca se muestran al cliente. */
    @Column(name = "internal_notes", columnDefinition = "text")
    private String internalNotes;

    @Column(name = "answered_at")
    private Instant answeredAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getFinishings() {
        return finishings;
    }

    public void setFinishings(String finishings) {
        this.finishings = finishings;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public QuoteStatus getStatus() {
        return status;
    }

    public void setStatus(QuoteStatus status) {
        this.status = status;
    }

    public String getInternalNotes() {
        return internalNotes;
    }

    public void setInternalNotes(String internalNotes) {
        this.internalNotes = internalNotes;
    }

    public Instant getAnsweredAt() {
        return answeredAt;
    }

    public void setAnsweredAt(Instant answeredAt) {
        this.answeredAt = answeredAt;
    }
}
