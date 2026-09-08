package exception;

import dto.ErrorResponse;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class RefreshTokenExceptionMapper implements ExceptionMapper<RefreshTokenException> {
    @Override
    public Response toResponse(RefreshTokenException e) {
        String errorMessage = e.getMessage();
        ErrorResponse error = new ErrorResponse(
                Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(),
                "Server error",
                errorMessage
        );
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
    }
}
