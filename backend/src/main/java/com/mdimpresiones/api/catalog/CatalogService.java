package com.mdimpresiones.api.catalog;

import com.mdimpresiones.api.catalog.dto.CategoryDto;
import com.mdimpresiones.api.catalog.dto.ProductDetailDto;
import com.mdimpresiones.api.catalog.dto.ProductSummaryDto;
import com.mdimpresiones.api.common.NotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Consultas de solo lectura del catalogo publico. */
@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CategoryRepository categories;
    private final ProductRepository products;

    public CatalogService(CategoryRepository categories, ProductRepository products) {
        this.categories = categories;
        this.products = products;
    }

    /** Rubros con sus productos: alimenta la pagina de Productos y el submenu. */
    public List<CategoryDto> listCategoriesWithProducts() {
        return categories.findAllWithActiveProducts().stream()
                .map(CatalogMapper::toDto)
                .toList();
    }

    public List<ProductSummaryDto> listProducts(String categorySlug) {
        List<Product> found = (categorySlug == null || categorySlug.isBlank())
                ? products.findByActiveTrueOrderByDisplayOrderAscNameAsc()
                : products.findByCategorySlugAndActiveTrueOrderByDisplayOrderAscNameAsc(categorySlug);
        return found.stream().map(CatalogMapper::toSummary).toList();
    }

    public ProductDetailDto getProduct(String slug) {
        return products.findBySlug(slug)
                .filter(Product::isActive)
                .map(CatalogMapper::toDetail)
                .orElseThrow(() -> NotFoundException.of("el producto", slug));
    }

    /** Buscador del menu hamburguesa. Devuelve vacio si el termino es muy corto. */
    public List<ProductSummaryDto> search(String term) {
        if (term == null || term.trim().length() < 2) {
            return List.of();
        }
        return products.search(term.trim()).stream()
                .map(CatalogMapper::toSummary)
                .toList();
    }
}
