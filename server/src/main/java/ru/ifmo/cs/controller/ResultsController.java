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
import ru.ifmo.cs.database.ContestPatricipantGroupRepository;
import ru.ifmo.cs.database.ContestParticipantRepository;
import ru.ifmo.cs.database.ContestRepository;
import ru.ifmo.cs.entity.*;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
public class ResultsController {

    private final ContestRepository contestRepository;
    private final ContestParticipantRepository patricipantRepository;
    private final ContestPatricipantGroupRepository patricipantGroupRepository;

    public ResultsController(ContestRepository contestRepository,
                             ContestParticipantRepository patricipantRepository,
                             ContestPatricipantGroupRepository patricipantGroupRepository) {
        this.contestRepository = contestRepository;
        this.patricipantRepository = patricipantRepository;
        this.patricipantGroupRepository = patricipantGroupRepository;
    }

    @GetMapping(value = "/download/results")
    public void downloadResultsFile(
            @RequestParam long contestId,
            @RequestParam ResultParticipantsType participantGender,
            @RequestParam(required = false) ItmoStudentsResultFilter itmoStudentsResultFilter,
            @RequestParam(required = false) String itmoDepartment,
            @RequestParam(required = false) String filename,
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
            csvData = getSingleParticipantResults(contestId, isMale, itmoStudentsResultFilter, itmoDepartment);
        } else {
            writeTextResponse(httpServletResponse, HttpStatus.NOT_IMPLEMENTED, "group participants not implemented");
            return;
        }

        writeMetaToResponse(filename, httpServletResponse);
        try (OutputStreamWriter outputStreamWriter = new OutputStreamWriter(httpServletResponse.getOutputStream())) {
            writeDataToCsvFile(csvData, outputStreamWriter);
        }
    }

    private void writeTextResponse(HttpServletResponse httpServletResponse, HttpStatus httpStatus, String message) throws IOException {
        httpServletResponse.setStatus(httpStatus.value());
        httpServletResponse.setContentType(MediaType.TEXT_PLAIN_VALUE);
        try (PrintWriter printWriter = new PrintWriter(httpServletResponse.getOutputStream())) {
            printWriter.print(message);
        }
    }

    private List<String[]> getSingleParticipantResults(long contestId, boolean isMale, ItmoStudentsResultFilter itmoStudentsResultFilter, String itmoDepartment) {
        final List<AcademicDegree> academicDegrees;
        if (itmoStudentsResultFilter == null) {
            academicDegrees = null;
        } else {
            switch (itmoStudentsResultFilter) {
                case FIRST_YEAR_BACHELOR:
                    academicDegrees = Arrays.asList(AcademicDegree.BACHELOR, AcademicDegree.SPECIALIST);
                    break;
                case ALL:
                    academicDegrees = Arrays.asList(AcademicDegree.values());
                    break;
                case GRADUATE:
                    academicDegrees = Arrays.asList(AcademicDegree.POST_GRADUATE);
                    break;
                default:
                    throw new IllegalStateException("missing switch branch for " + itmoStudentsResultFilter);
            }
        }
        List<ContestParticipant> results = patricipantRepository.findResults(contestId, isMale, itmoDepartment, null, academicDegrees);


        List<String[]> strResults = new ArrayList<>(results.size());
        String[] headerValues =  { "№", "Номер участника", "ФИО", "Пол", "Организация", "Статус", "Время", "Баллы", "Штраф", "Место" };
        strResults.add(headerValues);

        for (int i = 0; i < results.size(); i++) {
            ContestParticipant result = results.get(i);
            List<String> row = new ArrayList<>(headerValues.length);
            row.add(Integer.toString(i + 1));
            row.add(Long.toString(result.getParticipantId()));
            row.add(getPersonFullName(result.getParticipant()));
            row.add(getGenderString(result.getParticipant().isMale()));
            row.add(emptyIfNull(result.getParticipant().getUniversity()));
            row.add(toStringNullable(result.getParticipant().getStudyingAcademicDegree()));
            row.add(toStringNullable(result.getResult().getTime()));
            row.add(toStringNullable(result.getResult().getPoints()));
            row.add(toStringNullable(result.getResult().getPenalty()));
            row.add(getCompetitionPlaceString(i + 1));
            String[] rowStr = new String[row.size()];
            row.toArray(rowStr);
            strResults.add(rowStr);
        }

        return strResults;
    }

    private static String emptyIfNull(String s) {
        return s == null ? "" : s;
    }

    private static String toStringNullable(Object o) {
        if (o == null) {
            return "";
        }
        return o.toString();
    }

    private static String getCompetitionPlaceString(int place) {
        if (place == 1) {
            return "I";
        }
        if (place == 2) {
            return "II";
        }
        if (place == 3) {
            return "III";
        }
        return Integer.toString(place);
    }

    private static String getGenderString(boolean isMale) {
        return isMale ? "Мужской" :  "Женский";
    }

    private static String getPersonFullName(Person person) {
        String s = person.getLastName() + " " + person.getFirstName();
        if (person.getMiddleName() != null) {
            s += " " + person.getMiddleName();
        }
        return s;
    }

    private void writeMetaToResponse(String requestedFilename, HttpServletResponse httpServletResponse) {
        final String filename;
        if (requestedFilename == null || requestedFilename.isEmpty()) {
            filename = "results.csv";
        } else {
            filename = requestedFilename + ".csv";
        }
        final String contentDisposition = String.format("attachment; filename=\"%s\"", filename);
        httpServletResponse.setContentType("text/csv");
        httpServletResponse.setHeader(HttpHeaders.CONTENT_DISPOSITION, contentDisposition);
    }


    private void writeDataToCsvFile(List<String[]> data, Writer writer) throws IOException {
        try (CSVWriter csvWriter = new CSVWriter(writer)) {
            csvWriter.writeAll(data);
        }
    }
}
