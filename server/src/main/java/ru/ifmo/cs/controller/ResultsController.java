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
import ru.ifmo.cs.database.ContestPatricipantRepository;
import ru.ifmo.cs.database.ContestRepository;
import ru.ifmo.cs.entity.Contest;
import ru.ifmo.cs.entity.ParticipantType;

import javax.servlet.http.HttpServletResponse;
import java.io.*;

@RestController
public class ResultsController {

    private final ContestRepository contestRepository;
    private final ContestPatricipantRepository patricipantRepository;
    private final ContestPatricipantGroupRepository patricipantGroupRepository;

    public ResultsController(ContestRepository contestRepository,
                             ContestPatricipantRepository patricipantRepository,
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
            writeNotFoundResponse(httpServletResponse, "contest not found");
            return;
        }

        ParticipantType participantType = contest.getParticipantType();
        boolean isSingle = participantType == ParticipantType.SINGLE;

        // TODO: get real results from
        final String[][] csvData = getCsvData();

        writeMetaToResponse(filename, httpServletResponse);
        try (OutputStreamWriter outputStreamWriter = new OutputStreamWriter(httpServletResponse.getOutputStream())) {
            writeDataToCsvFile(csvData, outputStreamWriter);
        }
    }

    private void writeNotFoundResponse(HttpServletResponse httpServletResponse, String message) throws IOException {
        httpServletResponse.setStatus(HttpStatus.NOT_FOUND.value());
        httpServletResponse.setContentType(MediaType.TEXT_PLAIN_VALUE);
        PrintWriter printWriter = new PrintWriter(httpServletResponse.getOutputStream());
        printWriter.print(message);
    }

    private String[][] getCsvData() {
        return new String[][] {
                { "this", "is", "stub"},
                { "4", "5", "6"}
        };
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


    private void writeDataToCsvFile(String[][] data, Writer writer) throws IOException {
        try (CSVWriter csvWriter = new CSVWriter(writer)) {
            for (String[] datum : data) {
                csvWriter.writeNext(datum);
            }
        }
    }
}
