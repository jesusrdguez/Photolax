package com.photolax.service;

import com.photolax.config.DateConfig;
import com.photolax.dto.ContestDTO;
import com.photolax.dto.PutContestDTO;
import com.photolax.error.ContestNotFoundByTitleException;
import com.photolax.error.ContestNotFoundException;
import com.photolax.model.Contest;
import com.photolax.repository.ContestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContestService {

    private final ContestRepository contestRepository;

    private ContestDTO convertToContestDTO(Contest contest) {
        return ContestDTO.builder()
                .id(contest.getId())
                .title(contest.getTitle())
                .startDate(contest.getStartDate() != null ? contest.getStartDate().toLocalDate().format(DateConfig.DATE_FORMATTER) : null)
                .endDate(contest.getEndDate() != null ? contest.getEndDate().toLocalDate().format(DateConfig.DATE_FORMATTER) : null)
                .maxParticipants(contest.getMaxParticipants())
                .build();
    }

    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null) return null;
        try {
            LocalDate date = LocalDate.parse(dateStr, DateConfig.DATE_FORMATTER);
            return LocalDateTime.of(date, LocalTime.MIDNIGHT);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use dd/MM/yyyy");
        }
    }

    @Transactional
    public ContestDTO createContest(ContestDTO contestDTO) {
        LocalDateTime startDate = parseDate(contestDTO.getStartDate());
        LocalDateTime endDate = parseDate(contestDTO.getEndDate());

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date.");
        }

        Contest contest = Contest.builder()
                .title(contestDTO.getTitle())
                .startDate(startDate)
                .endDate(endDate)
                .maxParticipants(contestDTO.getMaxParticipants())
                .build();
        Contest savedContest = contestRepository.save(contest);
        return convertToContestDTO(savedContest);
    }

    @Transactional(readOnly = true)
    public List<ContestDTO> getAllContests() {
        return contestRepository.findAll().stream()
                .map(this::convertToContestDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ContestDTO getContestById(Long id) {
        return contestRepository.findById(id)
                .map(this::convertToContestDTO)
                .orElseThrow(() -> new ContestNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public ContestDTO getContestByTitle(String title) {
        return contestRepository.findByTitle(title)
                .map(this::convertToContestDTO)
                .orElseThrow(() -> new ContestNotFoundByTitleException(title));
    }
    
    @Transactional(readOnly = true)
    public Contest getContestEntityById(Long id) {
        return contestRepository.findById(id)
                .orElseThrow(() -> new ContestNotFoundException(id));
    }

    @Transactional
    public ContestDTO updateContest(Long id, PutContestDTO putContestDTO) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ContestNotFoundException(id));

        LocalDateTime startDate = parseDate(putContestDTO.getStartDate());
        LocalDateTime endDate = parseDate(putContestDTO.getEndDate());

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date.");
        }
        if (startDate != null && contest.getEndDate() != null && 
            startDate.isAfter(contest.getEndDate())){
             throw new IllegalArgumentException("New start date cannot be after existing end date.");   
        }
        if (endDate != null && contest.getStartDate() != null && 
            endDate.isBefore(contest.getStartDate())){
             throw new IllegalArgumentException("New end date cannot be before existing start date.");   
        }

        contest.setTitle(putContestDTO.getTitle());
        contest.setStartDate(startDate != null ? startDate : contest.getStartDate());
        contest.setEndDate(endDate != null ? endDate : contest.getEndDate());
        contest.setMaxParticipants(putContestDTO.getMaxParticipants() != null ? putContestDTO.getMaxParticipants() : contest.getMaxParticipants());

        Contest updatedContest = contestRepository.save(contest);
        return convertToContestDTO(updatedContest);
    }

    @Transactional
    public void deleteContest(Long id) {
        if (!contestRepository.existsById(id)) {
            throw new ContestNotFoundException(id);
        }
        contestRepository.deleteById(id);
    }
} 