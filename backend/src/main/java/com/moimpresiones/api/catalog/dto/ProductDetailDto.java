package com.moimpresiones.api.catalog.dto;

import java.util.List;

/** Ficha completa del producto: descripcion, fotos y ficha tecnica. */
public record ProductDetailDto(
        Long id,
        String slug,
        String name,
        String summary,
        String description,
        String categorySlug,
        String categoryName,
        boolean active,
        List<ImageDto> images,
        List<SpecDto> specs) {
}
