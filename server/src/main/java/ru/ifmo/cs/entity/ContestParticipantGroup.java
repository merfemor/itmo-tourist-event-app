package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ru.ifmo.cs.utils.Check;
import ru.ifmo.cs.utils.JsonUtils;

import javax.persistence.*;
import java.util.Date;
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
    private Date startDateTime;
    @ManyToMany
    @JoinTable
    @JsonIgnoreProperties(JsonUtils.HIBERNATE_LAZY_INITIALIZER)
    private Set<Person> members;
    @OneToOne(cascade = CascadeType.ALL)
    private Result result;

    protected ContestParticipantGroup() {
        /* for ORM */
    }

    public ContestParticipantGroup(Long id, long associatedContestId, String name, Date startDateTime, Set<Person> members, Result result) {
        Check.minSize(members, 2, "at least 2 members should be in group");
        this.id = id;
        this.associatedContestId = associatedContestId;
        this.name = name;
        this.startDateTime = startDateTime;
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

    public Date getStartDateTime() {
        return startDateTime;
    }

    public Set<Person> getMembers() {
        return members;
    }

    public Result getResult() {
        return result;
    }

    public void modify(String name, Set<Person> members, Result result) {
        this.name = name;
        this.members = members;
        if (this.result == null) {
            this.result = result;
        } else if (result == null) {
            this.result = null;
        } else {
            this.result.updateFields(result);
        }
    }
}
