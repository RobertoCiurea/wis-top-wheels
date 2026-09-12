package dto;

public record UpdateAccountDto(
        String username,
        String firstName,
        String lastName,
        String email
) {
}
