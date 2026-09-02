package dto;

public record ContactRequest(
        String name,
        String phoneNumber,
        String email,
        String subject,
        String message
) {
}
