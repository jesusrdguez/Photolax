package com.photolax.repository;

import com.photolax.model.Photo;
import com.photolax.model.PhotoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByUser_Id(Long userId);
    List<Photo> findByContest_Id(Long contestId);
    List<Photo> findByStatus(PhotoStatus status);
    List<Photo> findByUser_IdAndContest_Id(Long userId, Long contestId);
    List<Photo> findByContest_IdAndStatus(Long contestId, PhotoStatus status);
    List<Photo> findAllByOrderByUploadDateDesc(); 
    List<Photo> findByStatusOrderByUploadDateDesc(PhotoStatus status);
} 