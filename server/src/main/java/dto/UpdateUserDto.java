package dto;

public record UpdateUserDto(
        String username,
        String firstName,
        String lastName,
        String role
) {
}
