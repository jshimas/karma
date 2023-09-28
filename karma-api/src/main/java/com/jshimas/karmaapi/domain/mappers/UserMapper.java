package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.repositories.UserRoleRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class UserMapper {
    @Autowired
    private UserRoleRepository userRoleRepository;

    @Mapping(source = "role", target = "role", qualifiedByName = "stringToRole")
    public abstract User create(UserCreateDTO userCreateDTO);

    @Mapping(source = "role", target = "role", qualifiedByName = "userRoleToString")
    public abstract UserViewDTO toDTO(User user);

    @Named("stringToRole")
    protected UserRole stringToRole(String role) {
        return userRoleRepository.findByRoleIgnoreCase(role)
                .orElseThrow(() -> new NotFoundException(
                        String.format("User role %s not found. " +
                                "User role options are: volunteer, organizer, admin", role)
                ));
    }

    @Named("userRoleToString")
    protected String userRoleToString(UserRole role) {
        return role.getRole().toLowerCase();
    }
}
