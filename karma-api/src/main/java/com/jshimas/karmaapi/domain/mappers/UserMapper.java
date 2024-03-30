package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserEditDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.entities.AccountType;
import com.jshimas.karmaapi.entities.Scope;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.repositories.AccountTypeRepository;
import com.jshimas.karmaapi.repositories.UserRoleRepository;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class UserMapper {
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private AccountTypeRepository accountTypeRepository;

    @Mapping(source = "userCreateDTO.role", target = "role", qualifiedByName = "stringToRole")
    @Mapping(source = "accountType", target = "accountType", qualifiedByName = "stringToAccountType")
    public abstract User create(UserCreateDTO userCreateDTO, String accountType);

    @Mapping(target = "scopes", source = "scopes", qualifiedByName = "scopesToStrings")
    public abstract UserViewDTO toDTO(User user);
    @Mapping(source = "organizationId", target = "organizationId")
    @Mapping(target = "scopes", source = "user.scopes", qualifiedByName = "scopesToStrings")
    public abstract UserViewDTO toDTO(User user, UUID organizationId);

    @Mapping(source = "role", target = "role", qualifiedByName = "stringToRole")
    @Mapping(target = "scopes", ignore = true)
    @Mapping(target = "locations", ignore = true)
    @BeanMapping(nullValueCheckStrategy = ALWAYS, nullValuePropertyMappingStrategy = IGNORE)
    public abstract void updateEntityFromDTO(UserEditDTO userEditDTO, @MappingTarget User user);

    @Named("stringToRole")
    protected UserRole stringToRole(String role) {
        return userRoleRepository.findByRoleIgnoreCase(role)
                .orElseThrow(() -> new NotFoundException(
                        String.format("User role %s not found. " +
                                "User role options are: volunteer, organizer, admin", role)));
    }

    @Named("stringToAccountType")
    protected AccountType stringToAccountType(String accountType) {
        return accountTypeRepository.findByTypeIgnoreCase(accountType)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Account type %s not found. " +
                                "Account type options are: email, google", accountType)));
    }

    @Named("scopesToStrings")
    protected List<String> scopesToStrings(List<Scope> scopes) {
        if (scopes == null) {
            return null;
        }

        return scopes.stream()
                .map(Scope::getName)
                .toList();
    }
}
