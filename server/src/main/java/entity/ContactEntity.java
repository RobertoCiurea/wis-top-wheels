package entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "contact")
public class ContactEntity extends PanacheEntity {

    @NotBlank(message = "Numele este obligatoriu.")
    @Size(min = 5, max = 100, message = "Numele trebuie să aibă între 5 și 100 de caractere.")
    public String name;

    @NotBlank(message = "Numărul de telefon este obligatoriu.")
    @Size(max = 20, message = "Numărul de telefon este prea lung.")
    @Pattern(
            regexp = "^\\+?[0-9\\s().-]+$",
            message = "Numărul de telefon nu este valid."
    )
    public String phoneNumber;

    @NotBlank(message = "Email-ul este obligatoriu.")
    @Email(message = "Email-ul trebuie să fie valid.")
    public String email;

    @NotBlank(message = "Subiectul este obligatoriu.")
    @Size(max = 200, message = "Subiectul este prea lung.")
    public String subject;

    @NotBlank(message = "Mesajul este obligatoriu.")
    @Size(min = 10, max = 4000, message = "Mesajul trebuie să aibă între 10 și 4000 de caractere.")
    public String message;
}
