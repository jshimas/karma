package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserEditDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.repositories.UserRoleRepository;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class UserMapper {
    @Autowired
    private UserRoleRepository userRoleRepository;

    @Mapping(source = "role", target = "role", qualifiedByName = "stringToRole")
    public abstract User create(UserCreateDTO userCreateDTO);

    @Mapping(source = "role", target = "role", qualifiedByName = "stringToRole")
    public abstract User create(UserCreateDTO userCreateDTO, String role);

    public abstract UserViewDTO toDTO(User user);
    @Mapping(source = "organizationId", target = "organizationId")
    public abstract UserViewDTO toDTO(User user, UUID organizationId);

    @Mapping(source = "role", target = "role", qualifiedByName = "stringToRole")
    public abstract void updateEntityFromDTO(UserEditDTO userEditDTO, @MappingTarget User user);

    @Named("stringToRole")
    protected UserRole stringToRole(String role) {
        return userRoleRepository.findByRoleIgnoreCase(role)
                .orElseThrow(() -> new NotFoundException(
                        String.format("User role %s not found. " +
                                "User role options are: volunteer, organizer, admin", role)));
    }
}
