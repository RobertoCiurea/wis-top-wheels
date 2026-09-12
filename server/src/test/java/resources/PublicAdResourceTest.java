package resources;

import client.OlxAdClient;
import dto.OlxAdListResponseDto;
import dto.OlxAdResponseDto;
import dto.OlxSingleAdResponseDto;
import io.quarkus.cache.CacheManager;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import service.OlxTokenManager;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;

@QuarkusTest
public class PublicAdResourceTest {

    @Inject
    CacheManager cacheManager;

    @InjectMock
    OlxTokenManager tokenManager;

    @InjectMock
    @RestClient
    OlxAdClient adClient;

    @BeforeEach
    void setUp(){
        reset(tokenManager, adClient);

        cacheManager.getCache("public-ads-list")
                .ifPresent(cache -> cache.invalidateAll().await().indefinitely());
        cacheManager.getCache("public-ad-details")
                .ifPresent(cache -> cache.invalidateAll().await().indefinitely());
    }

    @Test
    void shouldGetWheelAd(){
        Long advertId = 123L;

        OlxSingleAdResponseDto response = new OlxSingleAdResponseDto();
        when(tokenManager.getAccessToken()).thenReturn("test-token");
        when(adClient.getAd(
                "Bearer test-token",
                "2.0",
                advertId
                )).thenReturn(response);

        given().pathParam("id", advertId)
                .get("/api/ad/wheels/{id}")
                .then().statusCode(200);
        verify(tokenManager, times(1)).getAccessToken();
        verify(adClient, times(1)).getAd(
                "Bearer test-token",
                "2.0",
                advertId
        );
    }

    @Test
    void shouldThrowOlxErrorWhenGettingWheelAd(){
        Long advertId = 123L;

        when(tokenManager.getAccessToken()).thenReturn("test-token");

        Response errorResponse = Response
                .status(Response.Status.NOT_FOUND)
                .entity("Advert not found")
                .build();
        when(adClient.getAd(
                "Bearer test-token",
                "2.0",
                    advertId
                )).thenThrow(new WebApplicationException(errorResponse));
        given()
                .pathParam("id", advertId)
                .get("api/ad/wheels/{id}").then()
                .statusCode(404)
                .body(equalTo("Advert not found"));
    }

    @Test
    void shouldReturn500StatusWhenUnexpectedErrorOccurs(){
        Long advertId = 123L;
        when(tokenManager.getAccessToken()).thenThrow(new RuntimeException("Something went wrong"));
        given()
                .pathParam("id", advertId)
                .get("api/ad/wheels/{id}").then()
                .statusCode(500)
                .body(equalTo("Networking error. Try again!"));
    }

    @Test
    void shouldReturnOnlyActiveAds(){
        OlxAdResponseDto active = new OlxAdResponseDto();
        active.id=1L;
        active.status="active";

        OlxAdResponseDto disabled = new OlxAdResponseDto();
        disabled.id=2L;
        disabled.status="disabled";

        OlxAdResponseDto limited = new OlxAdResponseDto();
        disabled.id=3L;
        disabled.status="limited";

        OlxAdListResponseDto response = new OlxAdListResponseDto();

        response.data = List.of(active, disabled, limited);

        when(tokenManager.getAccessToken()).thenReturn("test-token");
        when(adClient.getAds(
                "Bearer test-token",
                "2.0"
        )).thenReturn(response);

        given().
                when().get("/api/ad/wheels").then()
                .statusCode(200)
                .body(
                        "data.size()", equalTo(1),
                        "data.status", hasItem("active")
                );

    }

    @Test
    void shouldThrowOlxExceptionWhenGettingActiveWheelAds(){
        when(tokenManager.getAccessToken()).thenReturn("test-token");
        Response errorResponse = Response.
                status(Response.Status.BAD_REQUEST).
                entity("OLX unavailable").
                build();
        when(adClient.getAds(
                "Bearer test-token",
                "2.0"
        )).thenThrow(new WebApplicationException(errorResponse));

        given()
                .when()
                .get("/api/ad/wheels")
                .then()
                .statusCode(400)
                .body(equalTo("OLX unavailable"));
    }

    @Test
    void shouldReturn500WhenUnexpectedExceptionOccurs(){
        when(tokenManager.getAccessToken()).thenThrow(new RuntimeException("Token not able to generate"));
        given()
                .when()
                .get("/api/ad/wheels")
                .then()
                .statusCode(500)
                .body(equalTo("Networking error. Try again!"));
    }
}
