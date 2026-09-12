package service;

import dto.WheelAdDto;
import dto.WheelType;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Map;


@QuarkusTest
public class OlxMapperTest {
    @Inject
     OlxMapperService mapper;

    @ConfigProperty(name="olx.contact.name")
     String contactName;

    @ConfigProperty(name="olx.contact.phone")
     String contactPhone;

    @Test
    void shouldCreateRimsOnlyTest(){
        WheelAdDto dto = new WheelAdDto();
        dto.title="Jante Audi";
        dto.description="Jante originale Audi";
        dto.price=1500;
        dto.state="new";
        dto.wheelType= WheelType.RIMS_ONLY;
        dto.rimMake="Audi";
        dto.rimDiameter=18.0;
        dto.rimMaterial="Otel";

        Map<String, Object> payload = mapper.toOlxWheelPayload(dto);
        assertEquals("Jante Audi", payload.get("title"));
        assertEquals("Jante originale Audi", payload.get("description"));
        assertEquals(1647, payload.get("category_id"));
        assertEquals("private", payload.get("advertiser_type"));

        @SuppressWarnings("unchecked")
        Map<String, Object> contact = (Map<String, Object>) payload.get("contact");
        assertEquals(contactName, contact.get("name"));
        assertEquals(contactPhone, contact.get("phone"));

        @SuppressWarnings("unchecked")
        Map<String, Object> price = (Map<String, Object>) payload.get("price");
        assertEquals(1500.0, price.get("value"));
        assertEquals("RON", price.get("currency"));

        @SuppressWarnings("unchecked")
        Map<String, Object> location = (Map<String, Object>) payload.get("location");
        assertEquals(60321, location.get("city_id"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> attributes = (List<Map<String, Object>>) payload.get("attributes");

        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "donor_make", "value", "audi"))));

        assertTrue(attributes.stream().anyMatch(attribute->
                attribute.equals(Map.of("code", "rims_inches", "value", "parts-rims-inches-18"))));

        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "wheels_rims", "value", "parts-wheels-rims-type-steel"))));

        assertFalse(attributes.stream().anyMatch(attribute ->
                "tire_brand".equals(attribute.get("code"))));

    }

    @Test
    void shouldCreateTyresOnlyTest(){
        WheelAdDto dto = new WheelAdDto();
        dto.title="Anvelope Michelin";
        dto.description="Anvelope Michelin iarna";
        dto.price=800.0;
        dto.wheelType=WheelType.TYRES_ONLY;
        dto.state="used";
        dto.tyreMake="Michelin";
        dto.tyreSeason="winter";
        dto.rimDiameter=16.0;
        dto.tyreWidth=205;
        dto.tyreProfile=55.0;

        Map<String, Object> payload = mapper.toOlxWheelPayload(dto);

        assertEquals("Anvelope Michelin", payload.get("title"));
        assertEquals("Anvelope Michelin iarna", payload.get("description"));
        assertEquals(1649, payload.get("category_id"));
        assertEquals("private", payload.get("advertiser_type"));

        @SuppressWarnings("unchecked")
        Map<String, Object> contact = (Map<String, Object>) payload.get("contact");
        assertEquals(contactName, contact.get("name"));
        assertEquals(contactPhone, contact.get("phone"));

        @SuppressWarnings("unchecked")
        Map<String, Object> price = (Map<String, Object>) payload.get("price");
        assertEquals(800.0, price.get("value"));
        assertEquals("RON", price.get("currency"));

        @SuppressWarnings("unchecked")
        Map<String, Object> location = (Map<String, Object>) payload.get("location");
        assertEquals(60321, location.get("city_id"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> attributes = (List<Map<String, Object>>) payload.get("attributes");
        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code","tyres_type", "value", "parts-tyres-type-winter"))));
        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "tyres_inches", "value", "parts-tyres-inches-16"))));

        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "tyres_width", "value", "parts-tyres-width-205"))));

        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "tyres_profile", "value", "parts-tyres-profile-55"))));

        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "tire_brand", "value", "michelin"))));

        assertFalse(attributes.stream().anyMatch(attribute->
                "donor_make".equals(attribute.get("code"))));
    }

    @Test
    void shouldCreateFullWheelTest(){
        WheelAdDto dto = new WheelAdDto();
        dto.title="Set roti Volkswagen";
        dto.description="Set roti Volkswagen pe 18 inch";
        dto.price=2000;
        dto.wheelType=WheelType.FULL_WHEEL;
        dto.state="used";
        dto.rimMake="Volkswagen";
        dto.rimDiameter=18.0;
        dto.rimMaterial="Aliaj";
        dto.tyreMake="Goodyear";
        dto.tyreSeason="vara";
        dto.tyreWidth=225;
        dto.tyreProfile=45.0;

        Map<String, Object> payload = mapper.toOlxWheelPayload(dto);

        assertEquals("Set roti Volkswagen", payload.get("title"));
        assertEquals(1647, payload.get("category_id"));
        assertEquals("private", payload.get("advertiser_type"));

        @SuppressWarnings("unchecked")
        Map<String, Object> contact = (Map<String, Object>) payload.get("contact");
        assertEquals(contactName, contact.get("name"));
        assertEquals(contactPhone, contact.get("phone"));

        @SuppressWarnings("unchecked")
        Map<String, Object> price = (Map<String, Object>) payload.get("price");
        assertEquals(2000.0, price.get("value"));
        assertEquals("RON", price.get("currency"));

        //check for description
        String description = (String) payload.get("description");
        assertTrue(description.contains("Set roti Volkswagen pe 18 inch"));
        assertTrue(description.contains("Producător: GOODYEAR"));
        assertTrue(description.contains("Sezon: VARA"));
        assertTrue(description.contains("Lățime: 225"));
        assertTrue(description.contains("Profil: 45"));

    @SuppressWarnings("unchecked")
        Map<String, Object> location = (Map<String, Object>) payload.get("location");
        assertEquals(60321, location.get("city_id"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> attributes = (List<Map<String, Object>>) payload.get("attributes");
        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "make", "value", "volkswagen"))));

        assertTrue(attributes.stream().anyMatch(attribute->
                attribute.equals(Map.of("code", "rims_inches", "value", "parts-rims-inches-18"))));
        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "wheels_rims", "value", "parts-wheels-rims-type-alloy"))));
        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code","tyres_type", "value", "parts-tyres-type-summer"))));
        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "tyres_inches", "value", "parts-tyres-inches-18"))));

        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "tyres_width", "value", "parts-tyres-width-225"))));

        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "tyres_profile", "value", "parts-tyres-profile-45"))));

        assertTrue(attributes.stream().anyMatch(attribute ->
                attribute.equals(Map.of("code", "tire_brand", "value", "goodyear"))));

        assertFalse(attributes.stream().anyMatch(attribute->
                "donor_make".equals(attribute.get("code"))));
    }

    @Test
    void shouldFormatDecimalsValuesTest(){
    WheelAdDto dto = new WheelAdDto();
    dto.title="Test";
    dto.description="Test";
    dto.price=1;
    dto.wheelType = WheelType.RIMS_ONLY;
    dto.rimMake="Seat";
    dto.rimDiameter=19.5;
    dto.rimMaterial="Otel";

    Map<String, Object> payload = mapper.toOlxWheelPayload(dto);

    @SuppressWarnings("unchecked")
    List<Map<String, Object>> attributes = (List<Map<String, Object>>) payload.get("attributes");

    assertTrue(attributes.stream().anyMatch(attribute ->
            "parts-rims-inches-19-5".equals(attribute.get("value"))));

    }


}
