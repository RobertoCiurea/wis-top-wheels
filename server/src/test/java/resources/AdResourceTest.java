package resources;

import client.OlxAdClient;
import dto.*;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import service.OlxMapperService;
import service.OlxTokenManager;

import static org.hamcrest.Matchers.equalTo;
import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.mockito.Mockito.*;

@QuarkusTest
public class AdResourceTest {

    @Inject
    OlxMapperService mapper;

    @InjectMock
    OlxTokenManager tokenManager;

    @InjectMock
    @RestClient
    OlxAdClient adClient;

    @BeforeEach
    void setUp(){
        reset(adClient, tokenManager);
    }

    @Test
    void shouldRejectUnauthenticatedUserWhenGettingAds(){
        given()
                .when()
                .get("/api/ad/admin/wheels")
                .then()
                .statusCode(401);

    }

    @Test
    @TestSecurity(user = "test-user", roles = {"user"})
    void shouldRejectWrongUserRoleWhenGettingAds(){
        given()
                .when()
                .get("/api/ad/admin/wheels")
                .then()
                .statusCode(403);

    }

    @Test
    @TestSecurity(user = "admin-test-user", roles = {"admin"})
    void shouldGetAllStatusesAdsWhenAdmin(){
        OlxAdResponseDto active = new OlxAdResponseDto();
        active.id=1L;
        active.status="active";

        OlxAdResponseDto disabled = new OlxAdResponseDto();
        active.id=1L;
        active.status="disabled";

        OlxAdResponseDto limited = new OlxAdResponseDto();
        active.id=1L;
        active.status="limited";

        OlxAdListResponseDto response = new OlxAdListResponseDto();
        response.data= List.of(active, disabled, limited);

        when(tokenManager.getAccessToken()).thenReturn("test-token");
        when(adClient.getAds(
                "Bearer test-token",
                "2.0"
        )).thenReturn(response);

        given()
                .when()
                .get("/api/ad/admin/wheels")
                .then()
                .statusCode(200)
                .body("data.size()", equalTo(3));


    }
    @Test
    @TestSecurity(user = "moderator-test-user", roles = {"moderator"})
    void shouldGetAllStatusesAdsWhenModerator(){
        OlxAdResponseDto active = new OlxAdResponseDto();
        active.id=1L;
        active.status="active";

        OlxAdResponseDto disabled = new OlxAdResponseDto();
        active.id=1L;
        active.status="disabled";

        OlxAdResponseDto limited = new OlxAdResponseDto();
        active.id=1L;
        active.status="limited";

        OlxAdListResponseDto response = new OlxAdListResponseDto();
        response.data= List.of(active, disabled, limited);

        when(tokenManager.getAccessToken()).thenReturn("test-token");
        when(adClient.getAds(
                "Bearer test-token",
                "2.0"
        )).thenReturn(response);

        given()
                .when()
                .get("/api/ad/admin/wheels")
                .then()
                .statusCode(200)
                .body("data.size()", equalTo(3));

    }

    @Test
    void shouldRejectUnauthenticatedUserWhenTakingAction(){

    AdActionDto adAction = new AdActionDto();
    adAction.action=OlxAdAction.ACTIVATE;
    adAction.isSuccess=true;
    Long advertId = 123L;
        given()
                .pathParam("id", advertId)
                .contentType("application/json")
                .body(adAction)
                .when()
                .post("/api/ad/wheels/{id}/action")
                .then()
                .statusCode(401);
    }

    @Test
    @TestSecurity(user = "default-test-user", roles = {"default"})
    void shouldRejectRolesNotAllowedUserWhenTakingAction(){
        AdActionDto adAction = new AdActionDto();
        adAction.action=OlxAdAction.ACTIVATE;
        adAction.isSuccess=true;
        Long advertId = 123L;
        given()
                .pathParam("id", advertId)
                .contentType("application/json")
                .body(adAction)
                .when()
                .post("/api/ad/wheels/{id}/action")
                .then()
                .statusCode(403);
    }

    @Test
    @TestSecurity(user = "test-user", roles = {"admin", "moderator"})
    void shouldTakeActionOnAdvert(){
        when(tokenManager.getAccessToken()).thenReturn("test-token");
        AdActionDto adAction = new AdActionDto();
        adAction.action=OlxAdAction.ACTIVATE;
        adAction.isSuccess=true;
        Long advertId = 123L;

        given()
                .pathParam("id", advertId)
                .contentType("application/json")
                .body(adAction)
                .post("/api/ad/wheels/{id}/action")
                .then()
                .statusCode(200)
                .body("message", equalTo("Acțiunea a fost aplicată cu succes."));

        verify(tokenManager, times(1)).getAccessToken();
        verify(adClient, times(1)).sendCommand(
                eq("Bearer test-token"),
                eq("2.0"),
                eq(advertId),
                anyMap()
        );
    }



    @Test
    @TestSecurity(user = "test-user", roles = {"admin", "moderator"})
    void shouldRejectMissingAction(){
        Long advertId = 123L;
        AdActionDto adAction = new AdActionDto();
        adAction.action=null;
        adAction.isSuccess=true;

        given()
                .when()
                .pathParam("id", advertId)
                .contentType("application/json")
                .body(adAction)
                .post("/api/ad/wheels/{id}/action")
                .then()
                .statusCode(400)
                .body("error", equalTo("ID-ul anunțului și acțiunea sunt obligatorii."));
        verifyNoInteractions(tokenManager);
        verifyNoInteractions(adClient);

    }

//    @Test
//    @TestSecurity(user = "test-user", roles = {"admin", "moderator"})
//    void shouldThrowOlxExceptionWhenTakingAction(){
//        Long advertId =123L;
//        AdActionDto adAction = new AdActionDto();
//        adAction.action=OlxAdAction.ACTIVATE;
//        adAction.isSuccess=true;
//
//        Response errorResponse = Response
//                .status(400)
//                        .entity("OLX unavailable")
//                                .build();
//        when(tokenManager.getAccessToken()).thenReturn("test-access-token");
//        when(adClient.sendCommand(
//                eq("Bearer test-access-token"),
//                eq("2.0"),
//                eq(advertId),
//                anyMap()
//        )).thenThrow(new WebApplicationException(errorResponse));
//
//        given()
//                .when()
//                .pathParam("id", advertId)
//                .contentType("application/json")
//                .body(adAction)
//                .post("/api/ad/wheels/{id}/action")
//                .then()
//                .statusCode(400)
//                .body("error", equalTo(
//                        "Eroare de comunicare la nivelul rețelei OLX."
//                ));
//    }

    @Test
    @TestSecurity(user = "test-user", roles = {"admin", "moderator"})
    void shouldReturn500StatusWhenUnexpectedExceptionOccursTakingAction(){
        Long advertId = 123L;
        AdActionDto adAction = new AdActionDto();
        adAction.action=OlxAdAction.FINISH;
        adAction.isSuccess=true;

        when(tokenManager.getAccessToken()).thenThrow(new RuntimeException("Something went wrong"));

        given()
                .when()
                .pathParam("id", advertId)
                .contentType("application/json")
                .body(adAction)
                .post("/api/ad/wheels/{id}/action")
                .then()
                .statusCode(500)
                .body("status", equalTo(500), "error", equalTo("Eroare internă a serverului la executarea acțiunii."));

    }

    @Test
    void shouldRejectUnauthenticatedUserWhenCreatingWheelAd(){
        WheelAdDto advert = new WheelAdDto();
        advert.title="Test title";
        advert.description="Test description";
        advert.wheelType=WheelType.RIMS_ONLY;

        given()
                .when()
                .contentType("application/json")
                .body(advert)
                .post("/api/ad/wheels")
                .then()
                .statusCode(401);

        verifyNoInteractions(tokenManager);
        verifyNoInteractions(adClient);
    }

    @Test
    @TestSecurity(user = "default-test-user", roles = {"user"})
    void shouldRejectRoleNotAllowedUserWhenCreatingWheelAd(){
        WheelAdDto advert = new WheelAdDto();
        advert.title="Test title";
        advert.description="Test description";
        advert.wheelType=WheelType.RIMS_ONLY;

        given()
                .when()
                .contentType("application/json")
                .body(advert)
                .post("/api/ad/wheels")
                .then()
                .statusCode(403);

        verifyNoInteractions(tokenManager);
        verifyNoInteractions(adClient);
    }

    @Test
    @TestSecurity(user = "test-user", roles = {"admin", "moderator"})
    void shouldCreateWheelAd() {
        when(tokenManager.getAccessToken())
                .thenReturn("test-access-token");

        WheelAdDto advert = new WheelAdDto();
        advert.title = "Test Audi 18 inch wheels";
        advert.description = "Test description for a valid wheel advertisement.";
        advert.wheelType = WheelType.RIMS_ONLY;
        advert.price = 1000.0;
        advert.state = "new";
        advert.rimMake = "Audi";
        advert.rimDiameter = 18.0;
        advert.rimMaterial = "Aliaj";

        OlxAdResponseDto responseAd = new OlxAdResponseDto();
        responseAd.id = 123L;
        responseAd.status = "active";
        responseAd.title = "Test Audi 18 inch wheels";
        responseAd.description = "Test description for a valid wheel advertisement.";

        OlxSingleAdResponseDto response = new OlxSingleAdResponseDto();
        response.data = responseAd;

        when(adClient.createAd(
                eq("Bearer test-access-token"),
                eq("2.0"),
                anyMap()
        )).thenReturn(response);

        given()
                .contentType("application/json")
                .body(advert)
                .when()
                .post("/api/ad/wheels")
                .then()
                .statusCode(200)
                .body("data.id", equalTo(123));

        verify(tokenManager, times(1))
                .getAccessToken();

        verify(adClient, times(1)).createAd(
                eq("Bearer test-access-token"),
                eq("2.0"),
                anyMap()
        );
    }
    @Test
    @TestSecurity(user = "test-moderator-user", roles = {"moderator"})
    void shouldCreateWheelAdWhenModerator() {
        when(tokenManager.getAccessToken())
                .thenReturn("test-access-token");

        WheelAdDto advert = new WheelAdDto();
        advert.title = "Test Audi 18 inch wheels";
        advert.description = "Test description for a valid wheel advertisement.";
        advert.wheelType = WheelType.RIMS_ONLY;
        advert.price = 1000.0;
        advert.state = "new";
        advert.rimMake = "Audi";
        advert.rimDiameter = 18.0;
        advert.rimMaterial = "Aliaj";

        OlxAdResponseDto responseAd = new OlxAdResponseDto();
        responseAd.id = 123L;
        responseAd.status = "active";
        responseAd.title = "Test Audi 18 inch wheels";
        responseAd.description = "Test description for a valid wheel advertisement.";

        OlxSingleAdResponseDto response = new OlxSingleAdResponseDto();
        response.data = responseAd;

        when(adClient.createAd(
                eq("Bearer test-access-token"),
                eq("2.0"),
                anyMap()
        )).thenReturn(response);

        given()
                .contentType("application/json")
                .body(advert)
                .when()
                .post("/api/ad/wheels")
                .then()
                .statusCode(200)
                .body("data.id", equalTo(123));

        verify(tokenManager, times(1))
                .getAccessToken();

        verify(adClient, times(1)).createAd(
                eq("Bearer test-access-token"),
                eq("2.0"),
                anyMap()
        );
    }

    @Test
    @TestSecurity(user = "test-user", roles = {"admin", "moderator"})
    void shouldRejectInvalidWheelAd(){
        WheelAdDto advert = new WheelAdDto();
        advert.title = "Short";
        advert.description = "Short";
        advert.wheelType = WheelType.RIMS_ONLY;
        advert.price = -1000.0;

        given()
                .contentType("application/json")
                .body(advert)
                .when()
                .post("/api/ad/wheels")
                .then()
                .statusCode(400)
                .body("error", equalTo("Eroare de validare a datelor. Verificați câmpurile completate."));


        verifyNoInteractions(tokenManager);
        verifyNoInteractions(adClient);
    }

    @Test
    @TestSecurity(user="test-user", roles = {"admin", "moderator"})
    void shouldThrowOlxExceptionWhenCreatingWheelAd(){
        when(tokenManager.getAccessToken())
                .thenReturn("test-access-token");

        WheelAdDto advert = new WheelAdDto();
        advert.title = "Test Audi 18 inch wheels";
        advert.description = "Test description for a valid wheel advertisement.";
        advert.wheelType = WheelType.RIMS_ONLY;
        advert.price = 1000.0;
        advert.state = "new";
        advert.rimMake = "Audi";
        advert.rimDiameter = 18.0;
        advert.rimMaterial = "Aliaj";

        Response errorResponse = Response.status(400).entity("OLX unavailable").build();

        when(adClient.createAd(
                eq("Bearer test-access-token"),
                eq("2.0"),
                anyMap()
        )).thenThrow(new WebApplicationException(errorResponse));

        given()
                .contentType("application/json")
                .body(errorResponse)
                .when()
                .post("/api/ad/wheels")
                .then()
                .statusCode(400);


    }

    @Test
    @TestSecurity(user = "test-user", roles = {"admin", "moderator"})
    void throw500ErrorWhenUnExpectedExceptionOccursWhenCreatingWheelAd(){
        when(tokenManager.getAccessToken()).thenThrow(new RuntimeException("Something went wrong."));

        WheelAdDto advert = new WheelAdDto();
        advert.title = "Test Audi 18 inch wheels";
        advert.description = "Test description for a valid wheel advertisement.";
        advert.wheelType = WheelType.RIMS_ONLY;
        advert.price = 1000.0;
        advert.state = "new";
        advert.rimMake = "Audi";
        advert.rimDiameter = 18.0;
        advert.rimMaterial = "Aliaj";

        given()
                .when()
                .contentType("application/json")
                .body(advert)
                .post("/api/ad/wheels")
                .then()
                .statusCode(500)
                .body(equalTo("Networking error. Try again!"));

        verifyNoInteractions(adClient);
    }



}
