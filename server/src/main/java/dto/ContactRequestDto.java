package dto;

public record ContactRequestDto(
        String name,
        String phoneNumber,
        String email,
        String subject,
        String message,
        String recaptchaToken
) {
}
