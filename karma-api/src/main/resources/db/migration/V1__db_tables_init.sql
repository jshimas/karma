CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL
);

INSERT INTO user_roles (role) VALUES
    ('VOLUNTEER'),
    ('UNVERIFIED_ORGANIZER'),
    ('ORGANIZER'),
    ('ADMIN');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT role_fk FOREIGN KEY (role_id) REFERENCES user_roles (id)
);

CREATE TABLE IF NOT EXISTS organization_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL
);

INSERT INTO organization_types (type_name) VALUES
    ('nonprofit'),
    ('community'),
    ('educational'),
    ('other');

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    type_id INT NOT NULL,
    mission TEXT,
    address TEXT,
    website VARCHAR(255),
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    linkedin VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT type_fk FOREIGN KEY (type_id) REFERENCES organization_types (id)
);

CREATE TABLE IF NOT EXISTS organizers (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    organization_id uuid NOT NULL,
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT organization_fk FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    geo_location GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT organizations_fk FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID PRIMARY KEY,
    comment TEXT NOT NULL,
    event_id UUID NOT NULL,
    user_id UUID NOT NULL,
    CONSTRAINT event_fk FOREIGN KEY (event_id) REFERENCES events (id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id)
);