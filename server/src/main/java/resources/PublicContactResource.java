package resources;

import dto.ContactRequestDto;
import entity.ContactEntity;
import io.quarkus.logging.Log;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import service.RecaptchaValidationService;

import java.util.HashMap;
import java.util.Map;

@Path("/api/contact")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@PermitAll
public class PublicContactResource {
    @Inject
    RecaptchaValidationService recaptchaValidationService;

    @POST
    @Transactional
    public Response sendContactForm(@Valid ContactRequestDto contact){
        recaptchaValidationService.validateToken(contact.recaptchaToken());
        //if it passes => captcha successfully

        //parse from dto to entity
        ContactEntity contactEntity = new ContactEntity();
        contactEntity.name = contact.name();
        contactEntity.phoneNumber = contact.phoneNumber();
        contactEntity.email = contact.email();
        contactEntity.subject = contact.subject();
        contactEntity.message = contact.message();
        ContactEntity.persist(contactEntity);
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("status", 200);
        successResponse.put("message", "Mesajul a fost trimis cu succes!");
        Log.info("Contact form submitted successfully.");
        return Response.ok().entity(successResponse).build();
    }

}
