package dto;

public record UpdatePasswordDto(
        String oldPassword,
        String newPassword
) {
}
