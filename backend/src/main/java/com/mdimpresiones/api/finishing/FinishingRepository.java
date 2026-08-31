package com.mdimpresiones.api.finishing;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinishingRepository extends JpaRepository<Finishing, Long> {

    List<Finishing> findAllByOrderByDisplayOrderAscNameAsc();

    Optional<Finishing> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
