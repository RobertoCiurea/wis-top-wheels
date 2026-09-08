package dto;


public record CreateUserDto(
        String username,
        String firstName,
        String lastName,
        String email,
        String password,
        String role
) {
}
