package com.mdimpresiones.api.catalog;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Solo trae el rubro en el fetch: sumar specs e images haria que Hibernate
     * intentara traer dos colecciones a la vez (MultipleBagFetchException).
     * Ambas se cargan al mapear, dentro de la misma transaccion de lectura.
     */
    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Product> findByActiveTrueOrderByDisplayOrderAscNameAsc();

    List<Product> findByCategorySlugAndActiveTrueOrderByDisplayOrderAscNameAsc(String categorySlug);

    /** Buscador del menu: por nombre, resumen o rubro. */
    @Query("""
            SELECT p FROM Product p
            JOIN p.category c
            WHERE p.active = TRUE
              AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :term, '%'))
                OR LOWER(COALESCE(p.summary, '')) LIKE LOWER(CONCAT('%', :term, '%'))
                OR LOWER(COALESCE(p.description, '')) LIKE LOWER(CONCAT('%', :term, '%'))
                OR LOWER(c.name) LIKE LOWER(CONCAT('%', :term, '%')))
            ORDER BY p.displayOrder ASC, p.name ASC
            """)
    List<Product> search(@Param("term") String term);
}
