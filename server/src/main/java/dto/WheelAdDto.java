package dto;

import jakarta.validation.constraints.NotNull;

public class WheelAdDto extends BaseAdDto {
    @NotNull(message = "You must select the wheel type")
    public WheelType wheelType;

    public String rimMake;
    public Integer rimDiameter;
    public String boltPattern;
    public String rimMaterial;

    public String tyreMake;
    public String tyreSeason;
    public Integer tyreWidth;
    public Integer tyreProfile;

}
