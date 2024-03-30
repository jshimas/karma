package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.GeoPointDTO;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GeoPointMapper {
    @Mapping(target = "lat", source = "x")
    @Mapping(target = "lng", source = "y")
    GeoPointDTO pointToGeoPointDto(Point point);

    default Point geoPointDtoToPoint(GeoPointDTO geoPointDTO) {
        if (geoPointDTO == null) {
            return null;
        }

        GeometryFactory geometryFactory = new GeometryFactory();
        return geometryFactory.createPoint(
                new Coordinate(geoPointDTO.lat(), geoPointDTO.lng())
        );
    }
}
