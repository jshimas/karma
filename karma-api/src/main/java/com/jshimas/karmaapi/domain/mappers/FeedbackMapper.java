package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.FeedbackEditDTO;
import com.jshimas.karmaapi.domain.dto.FeedbackViewDTO;
import com.jshimas.karmaapi.entities.Activity;
import com.jshimas.karmaapi.entities.Feedback;
import com.jshimas.karmaapi.entities.User;
import org.mapstruct.*;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FeedbackMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "activityId", source = "activity.id")
    FeedbackViewDTO toDTO(Feedback feedback);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", source = "user")
    @Mapping(target = "activity", source = "activity")
    Feedback create(FeedbackEditDTO feedbackDTO, Activity activity, User user);

    @BeanMapping(nullValueCheckStrategy = ALWAYS, nullValuePropertyMappingStrategy = IGNORE)
    void updateEntityFromDTO(FeedbackEditDTO feedbackEditDTO, @MappingTarget Feedback feedback);
}