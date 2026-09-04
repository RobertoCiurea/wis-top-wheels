package dto;

import java.util.List;

public record UserResponseDto(
        String id,
        String username,
        String firstName,
        String lastName,
        String email,
        List<String> roles
) {
}
