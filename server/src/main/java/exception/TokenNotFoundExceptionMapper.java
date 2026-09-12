package exception;

import dto.ErrorResponse;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class TokenNotFoundExceptionMapper implements ExceptionMapper<TokenNotFoundException> {
    @Override
    public Response toResponse(TokenNotFoundException e) {
        String errorMessage = e.getMessage();
        ErrorResponse error = new ErrorResponse(
                Response.Status.UNAUTHORIZED.getStatusCode(),
                "Unauthorized error",
                errorMessage
        );
        return Response.status(Response.Status.UNAUTHORIZED).entity(error).build();
    }
}
