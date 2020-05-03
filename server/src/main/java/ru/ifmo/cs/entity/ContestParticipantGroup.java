package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
public class ContestParticipantGroup {
    @Id
    @GeneratedValue
    private Long id;
    @Column(name = "associated_contest_id")
    private long associatedContestId;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "associated_contest_id", insertable = false, updatable = false)
    @JsonIgnore
    private Contest associatedContest;
    private String name;
    private Date startDate;
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Set<Person> members;
    @OneToOne
    private Result result;

    protected ContestParticipantGroup() {
        /* for ORM */
    }

    public ContestParticipantGroup(Long id, long associatedContestId, String name, Date startDate, Set<Person> members, Result result) {
        if (members != null && members.size() < 2) {
            throw new IllegalArgumentException("at least 2 members should be in group");
        }
        this.id = id;
        this.associatedContestId = associatedContestId;
        this.name = name;
        this.startDate = startDate;
        this.members = members;
        this.result = result;
    }

    public Long getId() {
        return id;
    }

    public long getAssociatedContestId() {
        return associatedContestId;
    }

    public Contest getAssociatedContest() {
        return associatedContest;
    }

    public String getName() {
        return name;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Set<Person> getMembers() {
        return members;
    }

    public Result getResult() {
        return result;
    }

    public void modify(String name, Set<Person> members) {
        this.name = name;
        this.members = members;
    }
}
