package co.edu.iudigital.library.infrastructure.entry_point.user;


import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import co.edu.iudigital.library.domain.usecase.user.UserUseCase;
import co.edu.iudigital.library.infrastructure.entry_point.user.dto.request.LoginUserRequestDTO;
import co.edu.iudigital.library.infrastructure.entry_point.user.dto.request.RegisterUserRequestDTO;
import co.edu.iudigital.library.infrastructure.entry_point.user.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;


@Component
@RequiredArgsConstructor
@Tag(name = "User", description = "Operaciones relacionadas con los login y creacion de usuarios")
public class UserHandler {

    private final UserUseCase userUseCase;
    private final UserMapper mapper;

       @Operation(
        summary = "Registrar un nuevo usuario",
        description = "Permite crear un usuario registrando email, nombre, contraseña, rol y número de documento",
        requestBody = @RequestBody(
            required = true,
            description = "Datos del nuevo usuario",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = RegisterUserRequestDTO.class)
            )
        ),
        responses = {
            @ApiResponse(responseCode = "200", description = "Usuario registrado con éxito"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
        }
    )

    public Mono<ServerResponse> registerUser(ServerRequest request) {
        return request.bodyToMono(RegisterUserRequestDTO.class)
                .map(mapper::registerUserRequestDTOToUserModel)
                .flatMap(userUseCase::registerUser)
                .map(mapper::UserModelToRegisterUserResponseDTO)
                .flatMap(responseDTO -> ServerResponse.ok().bodyValue(responseDTO));

    }

    @Operation(
        summary = "Login de usuario",
        description = "Autenticación de usuario con email y contraseña",
        requestBody = @RequestBody(
            required = true,
            description = "Credenciales del usuario",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = LoginUserRequestDTO.class)
            )
        ),
        responses = {
            @ApiResponse(responseCode = "200", description = "Inicio de sesión exitoso"),
            @ApiResponse(responseCode = "400", description = "Credenciales inválidas")
        }
    )


    public Mono<ServerResponse> loginUser(ServerRequest request){
        return request.bodyToMono(LoginUserRequestDTO.class)
                .flatMap(userUseCase::loginUser)
                .flatMap(loginResponse -> ServerResponse.ok()
                        .bodyValue(mapper.authResponseToLoginUserResponseDTO(loginResponse))
                );
    }

    Mono<ServerResponse> searchUsers(ServerRequest request) {
        return Mono.justOrEmpty(request.queryParam("documentNumber"))
                .doOnNext(hola -> System.out.println("Hola: " + hola))
                .flatMapMany(userUseCase::searchUsers)
                .doOnNext(hola -> System.out.println("ese es la respuesta: " + hola))
                .collectList()
                .map(authors -> authors.stream()
                .map(mapper::UserModelToRegisterUserResponseDTO)
                .toList())
                .flatMap(users -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(users));

    }
}
