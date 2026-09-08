package dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OlxAdResponseDto {
    public Long id;
    public String status;
    public String url;
    public String title;
    public String description;

    @JsonProperty("created_at")
    public String createdAt;

    @JsonProperty("activated_at")
    public String activatedAt;

    @JsonProperty("valid_to")
    public String validTo;

    @JsonProperty("category_id")
    public Integer categoryId;

    @JsonProperty("advertiser_type")
    public String advertiserType;

    @JsonProperty("external_id")
    public String externalId;

    @JsonProperty("external_url")
    public String externalUrl;

    @JsonProperty("auto_extend_enabled")
    public Boolean autoExtendEnabled;

    public OlxContactResponse contact;
    public Map<String, Object> location;
    public List<OlxImageResponse> images;
    public OlxPriceResponse price;
    public List<OlxAttributeResponse> attributes;


    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OlxContactResponse {
        public String name;
        public String phone;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OlxImageResponse {
        public Long id;
        public String url;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OlxPriceResponse {
        public Double value;
        public String currency;
        public boolean negotiable;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OlxAttributeResponse {
        public String code;
        public Object value;

    }
}
