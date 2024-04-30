package com.jshimas.karmaapi.domain.dto;

import java.util.List;

public record ResolveActivityRequest(
        List<VolunteerEarning> volunteerEarnings
) {

}
