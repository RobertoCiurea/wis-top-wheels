package client;

import dto.RecaptchaRequestDto;
import dto.RecaptchaResponseDto;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(configKey = "recaptcha-enterprise")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path("/v1/projects")
public interface CaptchaClient {

    @POST
    @Path("/{projectId}/assessments")
    RecaptchaResponseDto createAssessment(
            @PathParam("projectId") String projectId,
            @QueryParam("key") String apiKey,
            RecaptchaRequestDto recaptchaPayload
    );

}
