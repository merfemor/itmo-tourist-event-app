package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.ifmo.cs.utils.Check;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    private String middleName;
    @Column(nullable = false)
    private boolean isMale = false;
    private Date birthDate;
    @Column(nullable = false)
    private UserRole role;
    private UserRole requestedRole;
    private SportsCategory tourismSportsCategory;

    private String organization; // or university
    private AcademicDegree studyingAcademicDegree;
    private String itmoEducationGroup;
    private String itmoDepartment;
    private Integer itmoIsuNumber;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "assignee")
    private Set<Task> assignedTasks;

    protected Person() {
        /* for ORM */
    }

    @JsonCreator
    public Person(Long id, String email, @JsonProperty("password") String password, String firstName, String lastName, String middleName, @JsonProperty("isMale") boolean isMale, Date birthDate, UserRole role, UserRole requestedRole, SportsCategory tourismSportsCategory, String organization, AcademicDegree studyingAcademicDegree, String itmoEducationGroup, String itmoDepartment, Integer itmoIsuNumber) {
        Check.notNull(email, "email must not be null");
        Check.notNull(firstName, "firstName must not be null");
        Check.notNull(lastName, "lastName must not be null");
        Check.isTrue(password != null || role == UserRole.PARTICIPANT, "null passwords allowed only for " + UserRole.PARTICIPANT + " role");
        if (role == null) {
            role = UserRole.PARTICIPANT;
        }
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.isMale = isMale;
        this.birthDate = birthDate;
        this.role = role;
        this.requestedRole = requestedRole;
        this.tourismSportsCategory = tourismSportsCategory;
        this.organization = organization;
        this.studyingAcademicDegree = studyingAcademicDegree;
        this.itmoEducationGroup = itmoEducationGroup;
        this.itmoDepartment = itmoDepartment;
        this.itmoIsuNumber = itmoIsuNumber;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getMiddleName() {
        return middleName;
    }

    @JsonProperty("isMale")
    public boolean isMale() {
        return isMale;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public UserRole getRole() {
        return role;
    }

    public SportsCategory getTourismSportsCategory() {
        return tourismSportsCategory;
    }

    public String getOrganization() {
        return organization;
    }

    public AcademicDegree getStudyingAcademicDegree() {
        return studyingAcademicDegree;
    }

    public String getItmoEducationGroup() {
        return itmoEducationGroup;
    }

    public String getItmoDepartment() {
        return itmoDepartment;
    }

    public Integer getItmoIsuNumber() {
        return itmoIsuNumber;
    }

    public UserRole getRequestedRole() {
        return requestedRole;
    }

    public Set<Task> getAssignedTasks() {
        return assignedTasks;
    }

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", middleName='" + middleName + '\'' +
                ", isMale=" + isMale +
                ", birthDate=" + birthDate +
                ", role=" + role +
                ", requestedRole=" + requestedRole +
                ", tourismSportsCategory=" + tourismSportsCategory +
                ", organization='" + organization + '\'' +
                ", studyingAcademicDegree=" + studyingAcademicDegree +
                ", itmoEducationGroup='" + itmoEducationGroup + '\'' +
                ", itmoDepartment='" + itmoDepartment + '\'' +
                ", itmoIsuNumber=" + itmoIsuNumber +
                '}';
    }

    public void updateFields(Person newPerson) {
        this.email = newPerson.email;
        if (newPerson.password != null) {
            this.password = newPerson.password;
        }
        this.firstName = newPerson.firstName;
        this.lastName = newPerson.lastName;
        this.middleName = newPerson.middleName;
        this.isMale = newPerson.isMale;
        this.birthDate = newPerson.birthDate;
        this.role = newPerson.role;
        this.requestedRole = newPerson.requestedRole;
        this.tourismSportsCategory = newPerson.tourismSportsCategory;
        this.organization = newPerson.organization;
        this.studyingAcademicDegree = newPerson.studyingAcademicDegree;
        this.itmoEducationGroup = newPerson.itmoEducationGroup;
        this.itmoDepartment = newPerson.itmoDepartment;
        this.itmoIsuNumber = newPerson.itmoIsuNumber;
    }
}
