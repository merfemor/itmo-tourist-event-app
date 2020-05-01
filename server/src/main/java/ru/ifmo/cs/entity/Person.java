package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
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
    private SportsCategory tourismSportsCategory;

    private String university;
    private AcademicDegree studyingAcademicDegree;
    private String itmoEducationGroup;
    private String itmoDepartment;
    private Integer itmoIsuNumber;


    protected Person() {
        /* for ORM */
    }

    @JsonCreator
    public Person(Long id, String email, @JsonProperty("password") String password, String firstName, String lastName, String middleName, @JsonProperty("isMale") boolean isMale, Date birthDate, UserRole role, SportsCategory tourismSportsCategory, String university, AcademicDegree studyingAcademicDegree, String itmoEducationGroup, String itmoDepartment, Integer itmoIsuNumber) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.isMale = isMale;
        this.birthDate = birthDate;
        this.role = role;
        this.tourismSportsCategory = tourismSportsCategory;
        this.university = university;
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

    public String getUniversity() {
        return university;
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
                ", tourismSportsCategory=" + tourismSportsCategory +
                ", university='" + university + '\'' +
                ", studyingAcademicDegree=" + studyingAcademicDegree +
                ", itmoEducationGroup='" + itmoEducationGroup + '\'' +
                ", itmoDepartment='" + itmoDepartment + '\'' +
                ", itmoIsuNumber=" + itmoIsuNumber +
                '}';
    }

    public void updateFields(Person newPerson) {
        this.email = newPerson.email;
        this.password = newPerson.password;
        this.firstName = newPerson.firstName;
        this.lastName = newPerson.lastName;
        this.middleName = newPerson.middleName;
        this.isMale = newPerson.isMale;
        this.birthDate = newPerson.birthDate;
        this.role = newPerson.role;
        this.tourismSportsCategory = newPerson.tourismSportsCategory;
        this.university = newPerson.university;
        this.studyingAcademicDegree = newPerson.studyingAcademicDegree;
        this.itmoEducationGroup = newPerson.itmoEducationGroup;
        this.itmoDepartment = newPerson.itmoDepartment;
        this.itmoIsuNumber = newPerson.itmoIsuNumber;
    }
}
