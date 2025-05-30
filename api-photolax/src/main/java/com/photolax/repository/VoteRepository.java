package com.photolax.repository;

import com.photolax.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUser_IdAndPhoto_Id(Long userId, Long photoId);
    long countByPhoto_Id(Long photoId);
    long countByUser_IdAndPhoto_Contest_Id(Long userId, Long contestId);
} 