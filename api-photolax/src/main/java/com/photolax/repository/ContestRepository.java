package com.photolax.repository;

import com.photolax.model.Contest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Long> {
    // Aquí se podrían añadir métodos de consulta específicos para Contest si son necesarios más adelante
    // Ejemplo: List<Contest> findByEndDateBefore(LocalDateTime date);
} 