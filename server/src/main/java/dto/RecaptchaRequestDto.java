package dto;

public class RecaptchaRequestDto {
    public Event event;

    public RecaptchaRequestDto(String token, String siteKey) {
        this.event = new Event();
        this.event.token = token;
        this.event.siteKey = siteKey;
    }

    public static class Event {
        public String token;
        public String siteKey;
    }
}