package com.photolax.service;

import com.photolax.dto.ContestDTO;
import com.photolax.dto.PutContestDTO;
import com.photolax.error.ContestNotFoundException;
import com.photolax.model.Contest;
import com.photolax.repository.ContestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .startDate(contest.getStartDate())
                .endDate(contest.getEndDate())
                .maxParticipants(contest.getMaxParticipants())
                .build();
    }

    @Transactional
    public ContestDTO createContest(ContestDTO contestDTO) {
        if (contestDTO.getStartDate() != null && contestDTO.getEndDate() != null && 
            contestDTO.getStartDate().isAfter(contestDTO.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date.");
        }

        Contest contest = Contest.builder()
                .title(contestDTO.getTitle())
                .startDate(contestDTO.getStartDate())
                .endDate(contestDTO.getEndDate())
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
    public Contest getContestEntityById(Long id) {
        return contestRepository.findById(id)
                .orElseThrow(() -> new ContestNotFoundException(id));
    }

    @Transactional
    public ContestDTO updateContest(Long id, PutContestDTO putContestDTO) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ContestNotFoundException(id));

        if (putContestDTO.getStartDate() != null && putContestDTO.getEndDate() != null &&
            putContestDTO.getStartDate().isAfter(putContestDTO.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date.");
        }
        if (putContestDTO.getStartDate() != null && contest.getEndDate() != null && 
            putContestDTO.getStartDate().isAfter(contest.getEndDate())){
             throw new IllegalArgumentException("New start date cannot be after existing end date.");   
        }
        if (putContestDTO.getEndDate() != null && contest.getStartDate() != null && 
            putContestDTO.getEndDate().isBefore(contest.getStartDate())){
             throw new IllegalArgumentException("New end date cannot be before existing start date.");   
        }

        contest.setTitle(putContestDTO.getTitle());
        contest.setStartDate(putContestDTO.getStartDate() != null ? putContestDTO.getStartDate() : contest.getStartDate());
        contest.setEndDate(putContestDTO.getEndDate() != null ? putContestDTO.getEndDate() : contest.getEndDate());
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