package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.GeoPointDTO;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GeoPointMapper {
    @Mapping(target = "lat", source = "y")
    @Mapping(target = "lng", source = "x")
    GeoPointDTO pointToGeoPointDto(Point point);

    default Point geoPointDtoToPoint(GeoPointDTO geoPointDTO) {
        if (geoPointDTO == null) {
            return null;
        }
        GeometryFactory geometryFactory = new GeometryFactory();
        return geometryFactory.createPoint(new Coordinate(geoPointDTO.lat(), geoPointDTO.lng()));
    }
}
