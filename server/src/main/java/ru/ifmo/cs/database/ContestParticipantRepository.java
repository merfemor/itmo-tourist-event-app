package ru.ifmo.cs.database;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import ru.ifmo.cs.entity.AcademicDegree;
import ru.ifmo.cs.entity.Contest;
import ru.ifmo.cs.entity.ContestParticipant;

import java.util.List;

public interface ContestParticipantRepository
        extends CrudRepository<ContestParticipant, ContestParticipant.ContestParticipantId> {
    @Query("select cp from ContestParticipant cp where " +
            "cp.contestId = :contestId " +
            "and cp.participant.isMale = :isMale " +
            "and (:itmoDepartment is null or cp.participant.itmoDepartment = :itmoDepartment) " +
            "and (:organization is null or cp.participant.organization = :organization) " +
            "and (:studyingAcademicDegrees is null or cp.participant.studyingAcademicDegree in :studyingAcademicDegrees) " +
            "and cp.result is not null " +
            "order by cp.result.time")
    List<ContestParticipant> findResults(@Param("contestId") long contestId,
                                         @Param("isMale") boolean isMale,
                                         @Param("itmoDepartment") String itmoDepartment,
                                         @Param("organization") String organization,
                                         @Param("studyingAcademicDegrees") List<AcademicDegree> studyingAcademicDegrees);
}
