package com.photolax.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
// import java.util.List; // Descomentar si se añade la relación con Vote

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "photo")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob // Para campos grandes como datos binarios de imagen
    @Column(name = "file_data", nullable = false)
    private byte[] fileData; // OID se mapea a byte[] para datos binarios grandes

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PhotoStatus status;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @Column(name = "vote_count", nullable = false)
    private Integer voteCount = 0;

    // Relación con Vote (una foto puede tener muchos votos)
    // @OneToMany(mappedBy = "photo", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Vote> votes;

    @PrePersist
    protected void onCreate() {
        this.uploadDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = PhotoStatus.PENDING; // Estado por defecto al crear
        }
    }
} 