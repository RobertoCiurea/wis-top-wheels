package resources;

import entity.ContactEntity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/api/contact")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"admin", "moderator"})
public class ContactResource {

    @GET
    public Response getContactMessage(){
        List<ContactEntity> contacts = ContactEntity.listAll();
        return Response.ok().entity(contacts).build();
    }

    @GET
    @Path("/id")
    public Response getContactById(@PathParam("id")Long id){
        ContactEntity contact = ContactEntity.findById(id);
        if(contact == null){
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 400);
            errorResponse.put("message", "Mesajul nu a fost gasit");
            return Response.status(Response.Status.NOT_FOUND).entity(errorResponse).build();
        }
        return Response.ok().entity(contact).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteMessage(@PathParam("id") Long id){
        ContactEntity contact = ContactEntity.findById(id);
        if(contact == null){
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 400);
            errorResponse.put("message", "Mesajul nu a fost gasit");
            return Response.status(Response.Status.NOT_FOUND).entity(errorResponse).build();
        }
        contact.delete();
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("status", 200);
        successResponse.put("message", "Mesajul a fost sters cu succes!");
        return Response.ok().entity(successResponse).build();
    }
}
