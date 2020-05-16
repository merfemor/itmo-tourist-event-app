package ru.ifmo.cs.controller;

import com.opencsv.CSVWriter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.ifmo.cs.api.dto.ItmoStudentsResultFilter;
import ru.ifmo.cs.api.dto.ResultParticipantsType;
import ru.ifmo.cs.database.ContestParticipantRepository;
import ru.ifmo.cs.database.ContestParticipantGroupRepository;
import ru.ifmo.cs.database.ContestRepository;
import ru.ifmo.cs.entity.AcademicDegree;
import ru.ifmo.cs.entity.Contest;
import ru.ifmo.cs.entity.ContestParticipant;
import ru.ifmo.cs.entity.ParticipantType;
import ru.ifmo.cs.localization.LocalizationUtils;
import ru.ifmo.cs.utils.Check;
import ru.ifmo.cs.utils.StringUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
public class ResultsController {

    private static final String DEFAULT_RESULTS_FILENAME = "results.csv";
    private static final String CONTENT_TYPE_TEXT_CSV = "test/csv";

    private final ContestRepository contestRepository;
    private final ContestParticipantRepository patricipantRepository;

    public ResultsController(ContestRepository contestRepository,
                             ContestParticipantRepository patricipantRepository,
                             ContestParticipantGroupRepository patricipantGroupRepository) {
        this.contestRepository = contestRepository;
        this.patricipantRepository = patricipantRepository;
    }

    @GetMapping(value = "/download/results")
    public void downloadResultsFile(
            @RequestParam long contestId,
            @RequestParam ResultParticipantsType participantGender,
            @RequestParam(required = false) ItmoStudentsResultFilter itmoStudentsResultFilter,
            @RequestParam(required = false) String organization,
            @RequestParam(required = false) String itmoDepartment,
            HttpServletResponse httpServletResponse) throws IOException {

        Contest contest = contestRepository.findById(contestId).orElse(null);
        if (contest == null) {
            writeTextResponse(httpServletResponse, HttpStatus.NOT_FOUND, "contest not found");
            return;
        }

        ParticipantType participantType = contest.getParticipantType();
        boolean isSingle = participantType == ParticipantType.SINGLE;

        final List<String[]> csvData;

        if (isSingle) {
            if (participantGender == ResultParticipantsType.MIXED_GROUPS) {
                writeTextResponse(httpServletResponse, HttpStatus.BAD_REQUEST, "contest has single participant, but mixed groups requested");
                return;
            }
            boolean isMale = participantGender == ResultParticipantsType.MEN;
            csvData = getSingleParticipantResults(contestId, isMale, itmoStudentsResultFilter, organization, itmoDepartment);
        } else {
            // TODO: implement group results
            writeTextResponse(httpServletResponse, HttpStatus.NOT_IMPLEMENTED, "group participants not implemented");
            return;
        }

        writeMetaToResponse(httpServletResponse);
        try (OutputStreamWriter outputStreamWriter = new OutputStreamWriter(httpServletResponse.getOutputStream())) {
            writeDataToCsvFile(csvData, outputStreamWriter);
        }
    }

    private List<String[]> getSingleParticipantResults(long contestId, boolean isMale, ItmoStudentsResultFilter itmoStudentsResultFilter, String organization, String itmoDepartment) {
        final List<AcademicDegree> academicDegrees = getAcademicDegreesForStudentsFilter(itmoStudentsResultFilter);
        final List<ContestParticipant> results = patricipantRepository.findResults(contestId, isMale, itmoDepartment, organization, academicDegrees);

        final List<String[]> strResults = new ArrayList<>(results.size());

        strResults.add(LocalizationUtils.SINGLE_RESULT_TABLE_HEADER_VALUES);

        for (int i = 0; i < results.size(); i++) {
            ContestParticipant result = results.get(i);
            List<String> row = new ArrayList<>(LocalizationUtils.SINGLE_RESULT_TABLE_HEADER_VALUES.length);
            row.add(Integer.toString(i + 1));
            row.add(Long.toString(result.getParticipantId()));
            row.add(LocalizationUtils.getPersonFullName(result.getParticipant()));
            row.add(LocalizationUtils.getGenderString(result.getParticipant().isMale()));
            row.add(StringUtils.emptyIfNull(result.getParticipant().getOrganization()));
            row.add(LocalizationUtils.academicDegreeToResultTableStatus(result.getParticipant().getStudyingAcademicDegree()));
            row.add(StringUtils.toStringNullable(result.getResult().getTime()));
            row.add(StringUtils.toStringNullable(result.getResult().getPoints()));
            row.add(StringUtils.toStringNullable(result.getResult().getPenalty()));
            row.add(LocalizationUtils.getCompetitionPlaceString(i + 1));
            String[] rowStr = new String[row.size()];
            row.toArray(rowStr);
            strResults.add(rowStr);
        }
        return strResults;
    }

    private static void writeTextResponse(HttpServletResponse httpServletResponse, HttpStatus httpStatus, String message) throws IOException {
        httpServletResponse.setStatus(httpStatus.value());
        httpServletResponse.setContentType(MediaType.TEXT_PLAIN_VALUE);
        try (PrintWriter printWriter = new PrintWriter(httpServletResponse.getOutputStream())) {
            printWriter.print(message);
        }
    }

    private static List<AcademicDegree> getAcademicDegreesForStudentsFilter(ItmoStudentsResultFilter itmoStudentsResultFilter) {
        if (itmoStudentsResultFilter == null) {
            return null;
        } else {
            switch (itmoStudentsResultFilter) {
                case FIRST_YEAR_BACHELOR:
                    return Arrays.asList(AcademicDegree.FIRST_YEAR_BACHELOR, AcademicDegree.FIRST_YEAR_SPECIALIST);
                case ALL:
                    return Arrays.asList(AcademicDegree.values());
                case GRADUATE:
                    return Collections.singletonList(AcademicDegree.GRADUATE);
                default:
                    return Check.failMissingSwitchBranch(itmoStudentsResultFilter, null);
            }
        }
    }

    private static void writeMetaToResponse(HttpServletResponse httpServletResponse) {
        final String contentDisposition = String.format("attachment; filename=\"%s\"", DEFAULT_RESULTS_FILENAME);
        httpServletResponse.setContentType(CONTENT_TYPE_TEXT_CSV);
        httpServletResponse.setHeader(HttpHeaders.CONTENT_DISPOSITION, contentDisposition);
    }


    private static void writeDataToCsvFile(List<String[]> data, Writer writer) throws IOException {
        try (CSVWriter csvWriter = new CSVWriter(writer)) {
            csvWriter.writeAll(data);
        }
    }
}
