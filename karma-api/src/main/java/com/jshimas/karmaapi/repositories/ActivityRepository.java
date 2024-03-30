package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.Activity;
import org.locationtech.jts.algorithm.Distance;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    // PostGIS swaps longitude and latitude
    @Query(value = "SELECT ST_DWithin(ST_GeographyFromText('POINT(' || :lng1 || ' ' || :lat1 || ')'), ST_GeographyFromText('POINT(' || :lng2 || ' ' || :lat2 || ')'), :range)", nativeQuery = true)
    Boolean arePointsWithin(@Param("lat1") String lat1, @Param("lng1") String lng1, @Param("lat2") String lat2, @Param("lng2") String lng2, @Param("range") int range);
}
