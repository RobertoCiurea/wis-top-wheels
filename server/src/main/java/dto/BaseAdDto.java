package dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public abstract class BaseAdDto {

    @NotBlank(message = "Titlul anunțului este obligatoriu.")
    @Size(min = 16, max = 70, message = "Titlul trebuie să aibă între 16 și 70 de caractere.")
        public String title;
    @NotBlank(message = "Descrierea este obligatorie.")
    @Size(min = 40, max = 9000, message ="Descrierea trebuie să aibă minim 40 de caractere." )
        public String description;

    @Positive(message = "Prețul nu poate fi negativ")
    public double price;

    public String state; //new / used

    public List<String> imageUrls;
}
