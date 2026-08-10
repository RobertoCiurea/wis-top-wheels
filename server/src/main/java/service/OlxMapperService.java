package service;

import dto.WheelAdDto;
import dto.WheelType;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class OlxMapperService {

    private static final String WHEEL_CATEGORY_ID = "1647";
    private static final String AUTO_CATEGORY_ID = "5";
    private static final String CITY_ID = "60321"; // Pitesti city Id

    public Map<String, Object> toOlxWheelPayload(WheelAdDto dto) {
        Map<String, Object> payload = createBasePayload(dto.title, dto.description, dto.price, WHEEL_CATEGORY_ID);

        List<Map<String, Object>> attributes = new ArrayList<>();

        // Add rim attributes if the user selects it
        if (dto.wheelType == WheelType.RIMS_ONLY || dto.wheelType == WheelType.FULL_WHEEl) {
            if (dto.rimMake != null) addAttribute(attributes, "rim_make", dto.rimMake);
            if (dto.rimDiameter != null) addAttribute(attributes, "rim_diameter", String.valueOf(dto.rimDiameter));
            if (dto.boltPattern != null) addAttribute(attributes, "bolt_pattern", dto.boltPattern);
            if (dto.rimMaterial != null) addAttribute(attributes, "rim_material", dto.rimMaterial);
        }

        // Add tyres attributes if the user selects it
        if (dto.wheelType == WheelType.TYRES_ONLY || dto.wheelType == WheelType.FULL_WHEEl) {
            if (dto.tyreMake != null) addAttribute(attributes, "tyre_make", dto.tyreMake);
            if (dto.tyreSeason != null) addAttribute(attributes, "tyre_season", dto.tyreSeason);
            if (dto.tyreWidth != null) addAttribute(attributes, "tyre_width", String.valueOf(dto.tyreWidth));
            if (dto.tyreProfile != null) addAttribute(attributes, "tyre_profile", String.valueOf(dto.tyreProfile));
        }

        payload.put("attributes", attributes);
        return payload;
    }

    private void addAttribute(List<Map<String, Object>> attributesList, String code, Object value) {
        Map<String, Object> attr = new HashMap<>();
        attr.put("code", code);
        attr.put("value", value);
        attributesList.add(attr);
    }

    Map<String, Object> createBasePayload(String title, String description, double price, String categoryId) {
        Map<String, Object> basePayload = new HashMap<>();
        basePayload.put("title", title);
        basePayload.put("description", description);
        basePayload.put("category_id", categoryId);
        basePayload.put("advertiser_type", "private"); // Excellent fix!

        Map<String, Object> contact = new HashMap<>();
        contact.put("name", "Roberto");
        contact.put("phone", "+40726052030");
        basePayload.put("contact", contact);

        Map<String, Object> location = new HashMap<>();
        location.put("city_id", CITY_ID);
        basePayload.put("location", location);

        // custom price payload (value & currency)
        Map<String, Object> pricePayload = new HashMap<>();
        pricePayload.put("value", price);
        pricePayload.put("currency", "RON");
        basePayload.put("price", pricePayload);

        return basePayload;
    }
}

