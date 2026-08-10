package dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public abstract class BaseAdDto {

    @NotBlank(message = "Title cannot be empty")
        public String title;
    @NotBlank(message = "Description cannot be empty")
        public String description;

    @Positive(message = "Price cannot be negative")
    public double price;
}
