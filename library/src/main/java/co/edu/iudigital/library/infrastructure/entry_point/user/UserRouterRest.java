package co.edu.iudigital.library.infrastructure.entry_point.user;


import org.springdoc.core.annotations.RouterOperation;
import org.springdoc.core.annotations.RouterOperations;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;
import org.springframework.web.reactive.function.server.RouterFunction;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import org.springframework.web.reactive.function.server.ServerResponse;

import co.edu.iudigital.library.infrastructure.entry_point.properties.RouteProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class UserRouterRest {

    private final RouteProperties route;

    @Bean
    @RouterOperations({
            @RouterOperation(path = "/product/api/v1/auth/userlogin", produces = {MediaType.APPLICATION_JSON_VALUE}, beanClass = UserHandler.class, beanMethod = "loginUser", operation = @Operation(operationId = "loginUser", responses = {
                    @ApiResponse(responseCode = "200", description = "Inicio de sesión exitoso"),
                    @ApiResponse(responseCode = "400", description = "Credenciales inválidas")
            })),
            @RouterOperation(path = "/product/api/v1/register/user", produces = {MediaType.APPLICATION_JSON_VALUE}, beanClass = UserHandler.class, beanMethod = "registerUser", operation = @Operation(operationId = "registerUser", responses = {
                    @ApiResponse(responseCode = "200", description = "Usuario registrado con éxito"),
                    @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
            }))
    })



    public RouterFunction<ServerResponse> routerFunction (UserHandler handler){

        System.out.println("Login route: " + route.buildLogin());

        return route()
                .POST(route.buildLogin(), accept(MediaType.APPLICATION_JSON), handler::loginUser)
                .POST(route.buildRegister(), accept(MediaType.APPLICATION_JSON), handler::registerUser)
                .GET("product/api/v1/user", accept(MediaType.APPLICATION_JSON), handler::searchUsers)
                .build();
    }
}
