package dto;


public record CreateUserDto(
        String username,
        String email,
        String password,
        String role
) {
}
