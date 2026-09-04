package service;

import client.CaptchaClient;
import dto.RecaptchaRequestDto;
import dto.RecaptchaResponseDto;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.resteasy.reactive.ClientWebApplicationException;

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class RecaptchaValidationService {

    @Inject
            @RestClient
    CaptchaClient captchaClient;

    @ConfigProperty(name = "google.recaptcha.site-key")
    String siteKey;

    @ConfigProperty(name = "google.recaptcha.secret-key")
    String secretKey;

    @ConfigProperty(name="google.recaptcha.api-key")
    String apiKey;

    @ConfigProperty(name = "google.recaptcha.project-id")
    String projectId;

    public void validateToken(String token){

        if(token == null || token.trim().isEmpty())
            throwBadRequest("Token-ul de validare reCaptcha lipsește.");
        try {
            RecaptchaRequestDto recaptchaPayload = new RecaptchaRequestDto(token, siteKey);
            RecaptchaResponseDto response = captchaClient.createAssessment(projectId, apiKey, recaptchaPayload);
            if (response.tokenProperties == null || response.tokenProperties.valid == false) {
                String reason = response.tokenProperties != null ? response.tokenProperties.invalidReason : "Necunoscut";
                System.out.println("Validare respinsă. Motiv: " + reason);

                throwBadRequest("Validarea de securitate a eșuat. Vă rugăm să reluați procedura de verificare.");
            }
        }catch (ClientWebApplicationException e ){
        String errorResponse = e.getResponse().readEntity(String.class);
        Log.error("Eroare la validarea reCaptcha: " + errorResponse);
        }catch (WebApplicationException e){
            throw e;
        }catch (Exception e){
            throwServerError("Eroare de rețea. Te rugăm să încerci din nou.");
        }
    }

    private void throwBadRequest(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", 400);
        error.put("error", message);
        throw new WebApplicationException(Response.status(400).entity(error).build());
    }

    private void throwServerError(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", 500);
        error.put("error", message);
        throw new WebApplicationException(Response.status(500).entity(error).build());
    }
}
