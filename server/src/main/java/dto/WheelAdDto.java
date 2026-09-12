package dto;

import jakarta.validation.constraints.NotNull;

public class WheelAdDto extends BaseAdDto {
    @NotNull(message = "Trebuie să selectați tipul (Jante, Anvelope sau Roți Complete).")
    public WheelType wheelType;

    public String rimMake;
    public Double rimDiameter;
    public String rimMaterial;

    public String tyreMake;
    public String tyreSeason;
    public Integer tyreWidth;
    public Double tyreProfile;

}
