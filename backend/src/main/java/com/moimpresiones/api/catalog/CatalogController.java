package com.moimpresiones.api.catalog;

import com.moimpresiones.api.catalog.dto.CategoryDto;
import com.moimpresiones.api.catalog.dto.ProductDetailDto;
import com.moimpresiones.api.catalog.dto.ProductSummaryDto;
import java.util.List;
import org.springframework.web.bind.annotation.*;

/** Endpoints publicos del catalogo. No requieren autenticacion. */
@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService catalog;

    public CatalogController(CatalogService catalog) {
        this.catalog = catalog;
    }

    /** Rubros con sus productos. Alimenta la pagina Productos y el submenu desplegable. */
    @GetMapping("/categories")
    public List<CategoryDto> categories() {
        return catalog.listCategoriesWithProducts();
    }

    @GetMapping("/products")
    public List<ProductSummaryDto> products(@RequestParam(required = false) String category) {
        return catalog.listProducts(category);
    }

    @GetMapping("/products/{slug}")
    public ProductDetailDto product(@PathVariable String slug) {
        return catalog.getProduct(slug);
    }

    /** Buscador del menu hamburguesa. */
    @GetMapping("/search")
    public List<ProductSummaryDto> search(@RequestParam(name = "q", required = false) String query) {
        return catalog.search(query);
    }
}
