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

    private static final String CATEGORY_RIMS_ID = "1647";
    private static final String CATEGORY_TYRES_ID = "1649";
    private static final String AUTO_CATEGORY_ID = "5";
    private static final String CITY_ID = "60321"; // Pitesti city Id

    public Map<String, Object> toOlxWheelPayload(WheelAdDto dto) {

        // dynamically select the leaf category ID
        String targetCategoryId = (dto.wheelType == WheelType.TYRES_ONLY) ? CATEGORY_TYRES_ID : CATEGORY_RIMS_ID;

        // full wheel category doesn't accept tire brand, season, width and profile so add it to the description
        String finalDescription = dto.description;
        if (dto.wheelType == WheelType.FULL_WHEEl) {
            StringBuilder tyreInfo = new StringBuilder("\n\n--- Detalii Anvelope ---\n");
            if (dto.tyreMake != null) tyreInfo.append("Producător: ").append(dto.tyreMake.toUpperCase()).append("\n");
            if (dto.tyreSeason != null) tyreInfo.append("Sezon: ").append(dto.tyreSeason.toUpperCase()).append("\n");
            if (dto.tyreWidth != null) tyreInfo.append("Lățime: ").append(dto.tyreWidth).append("\n");
            if (dto.tyreProfile != null) tyreInfo.append("Profil: ").append(dto.tyreProfile).append("\n");

            finalDescription += tyreInfo.toString();
        }

        Map<String, Object> payload = createBasePayload(dto.title, finalDescription, dto.price, dto.imageUrls, targetCategoryId);

        List<Map<String, Object>> attributes = new ArrayList<>();

        // shared attributes for all type of wheels (rim only, tyres only, full wheel)
        if (dto.state != null) {
            // Must be "new" or "used"
            addAttribute(attributes, "state", dto.state.toLowerCase());
        }

        //add separately rim make for each category
        if(dto.wheelType == WheelType.RIMS_ONLY){
            if(dto.rimMake!=null)
                addAttribute(attributes, "donor_make", dto.rimMake.toLowerCase());
        }

        if(dto.wheelType == WheelType.FULL_WHEEl){
            if(dto.rimMake!=null)
                addAttribute(attributes, "make", dto.rimMake.toLowerCase());
        }


        // add rim attributes if the user selects it
        if (dto.wheelType == WheelType.RIMS_ONLY || dto.wheelType == WheelType.FULL_WHEEl) {

            if (dto.rimDiameter != null) {
                // formats 19.5 into "parts-rims-inches-19-5"
                String formattedInch =formatDecimalCode(dto.rimDiameter);
                addAttribute(attributes, "rims_inches", "parts-rims-inches-" + formattedInch);
            }
            if (dto.rimMaterial != null) {
                // translates material to strict OLX keys
                String materialCode = dto.rimMaterial.equalsIgnoreCase("Otel")
                        ? "parts-wheels-rims-type-steel"
                        : "parts-wheels-rims-type-alloy";
                addAttribute(attributes, "wheels_rims", materialCode);
            }
        }

        // add tyres attributes if the user selects it
        if (dto.wheelType == WheelType.TYRES_ONLY || dto.wheelType == WheelType.FULL_WHEEl) {
            if (dto.tyreMake != null) {
                addAttribute(attributes, "tire_brand", dto.tyreMake.toLowerCase());
            }
            if (dto.tyreSeason != null) {
                String seasonCode = switch (dto.tyreSeason.toLowerCase()) {
                    case "summer", "vara" -> "parts-tyres-type-summer";
                    case "winter", "iarna" -> "parts-tyres-type-winter";
                    default -> "parts-tyres-type-allseason";
                };
                addAttribute(attributes, "tyres_type", seasonCode);
            }
            if (dto.rimDiameter != null) {
                // formats 19.5 into "parts-rims-inches-19-5"
                String formattedInch =formatDecimalCode(dto.rimDiameter);
                addAttribute(attributes, "tyres_inches", "parts-tyres-inches-" + formattedInch);
            }
            if (dto.tyreWidth != null) {
                addAttribute(attributes, "tyres_width", "parts-tyres-width-" + dto.tyreWidth);
            }
            if (dto.tyreProfile != null) {
                // Formats 10.5 into "parts-tyres-profile-10-5"
                String formattedProfile = formatDecimalCode(dto.tyreProfile);
                addAttribute(attributes, "tyres_profile", "parts-tyres-profile-" + formattedProfile);
            }
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

    Map<String, Object> createBasePayload(String title, String description, double price, List<String> imageUrls, String categoryId) {
        Map<String, Object> basePayload = new HashMap<>();
        basePayload.put("title", title);
        basePayload.put("description", description);

        // Critical: IDs must be Integers in the final JSON, not Strings
        basePayload.put("category_id", Integer.parseInt(categoryId));
        basePayload.put("advertiser_type", "private");

        Map<String, Object> contact = new HashMap<>();
        contact.put("name", "Roberto");
        contact.put("phone", "+40726052030");
        basePayload.put("contact", contact);

        Map<String, Object> location = new HashMap<>();
        // Critical: IDs must be Integers in the final JSON, not Strings
        location.put("city_id", Integer.parseInt(CITY_ID));
        basePayload.put("location", location);

        // custom price payload (value & currency)
        Map<String, Object> pricePayload = new HashMap<>();
        pricePayload.put("value", price);
        pricePayload.put("currency", "RON");
        basePayload.put("price", pricePayload);

        // images payload
        if(imageUrls != null && !imageUrls.isEmpty()){
            List<Map<String, String>> imagePayload = new ArrayList<>();
            for(String url : imageUrls){
                Map<String, String> imageObj = new HashMap<>();
                imageObj.put("url", url);
                imagePayload.add(imageObj);
            }
            basePayload.put("images", imagePayload);
        }

        return basePayload;
    }
    private String formatDecimalCode(Double value) {
        if (value == null) return "";
        // if it's a  whole number (ex: 55.0), return "55"
        if (value == Math.floor(value)) {
            return String.valueOf(value.intValue());
        }
        // if it has a decimal (ex: 19.5), return "19-5"
        return String.valueOf(value).replace(".", "-");
    }
}