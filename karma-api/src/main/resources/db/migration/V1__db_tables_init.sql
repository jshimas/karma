CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS user_roles
(
    id   SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS account_types
(
    id   SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL
);

INSERT INTO account_types (type)
VALUES ('EMAIL'),
       ('GOOGLE');

INSERT INTO user_roles (role)
VALUES ('VOLUNTEER'),
       ('ORGANIZER');

CREATE TABLE IF NOT EXISTS scopes
(
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS organization_types
(
    id        SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL
);

INSERT INTO organization_types (type_name)
VALUES ('nonprofit'),
       ('community'),
       ('educational'),
       ('other');

CREATE TABLE IF NOT EXISTS organizations
(
    id         UUID PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(255) NOT NULL,
    type_id    INT          NOT NULL,
    mission    TEXT,
    address    TEXT,
    website    VARCHAR(255),
    facebook   VARCHAR(255),
    instagram  VARCHAR(255),
    youtube    VARCHAR(255),
    linkedin   VARCHAR(255),
    image_url   VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT type_fk FOREIGN KEY (type_id) REFERENCES organization_types (id)
);

CREATE TABLE IF NOT EXISTS users
(
    id              UUID PRIMARY KEY,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    role_id         INT          NOT NULL,
    account_type_id INT          NOT NULL,
    image_url       VARCHAR(255),
    bio             TEXT,
    password        VARCHAR(255),
    organization_id UUID,
    karma_points    INT                      DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT role_fk FOREIGN KEY (role_id) REFERENCES user_roles (id),
    CONSTRAINT account_type_fk FOREIGN KEY (account_type_id) REFERENCES account_types (id),
    CONSTRAINT organization_fk FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE IF NOT EXISTS user_scopes
(
    user_id  UUID NOT NULL,
    scope_id BIGINT  NOT NULL,
    PRIMARY KEY (user_id, scope_id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT scope_fk FOREIGN KEY (scope_id) REFERENCES scopes (id)
);

CREATE TABLE IF NOT EXISTS user_locations
(
    id       UUID PRIMARY KEY,
    user_id  UUID         NOT NULL,
    location GEOMETRY(Point, 4326),
    address  TEXT         NOT NULL,
    name     VARCHAR(255) NOT NULL,
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS activities
(
    id                UUID PRIMARY KEY,
    organization_id   UUID         NOT NULL,
    name              VARCHAR(255) NOT NULL,
    start_date        TIMESTAMPTZ  NOT NULL,
    end_date          TIMESTAMPTZ  NOT NULL,
    description       TEXT         NOT NULL,
    address           VARCHAR(255) NOT NULL,
    geo_location      GEOMETRY(Point, 4326),
    is_public         BOOLEAN      NOT NULL,
    resolved          BOOLEAN      NOT NULL    DEFAULT FALSE,
    volunteers_needed INT          NOT NULL    DEFAULT 0,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT organizations_fk FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE IF NOT EXISTS activity_scopes
(
    activity_id UUID NOT NULL,
    scope_id    BIGINT  NOT NULL,
    PRIMARY KEY (activity_id, scope_id),
    CONSTRAINT activity_fk FOREIGN KEY (activity_id) REFERENCES activities (id),
    CONSTRAINT scope_fk FOREIGN KEY (scope_id) REFERENCES scopes (id)
);

CREATE TABLE IF NOT EXISTS feedbacks
(
    id          UUID PRIMARY KEY,
    comment     TEXT,
    rating      INT  NOT NULL,
    activity_id UUID NOT NULL,
    user_id     UUID NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT activity_fk FOREIGN KEY (activity_id) REFERENCES activities (id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS registration_tokens
(
    token           UUID PRIMARY KEY,
    valid_until     TIMESTAMPTZ NOT NULL,
    organization_id UUID        NOT NULL,
    CONSTRAINT organization_fk FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE IF NOT EXISTS applications
(
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL,
    activity_id         UUID NOT NULL,
    motivation          TEXT NOT NULL,
    is_approved         BOOLEAN,
    valid               BOOLEAN,
    date_of_application TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_of_approval    TIMESTAMPTZ,
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT activity_fk FOREIGN KEY (activity_id) REFERENCES activities (id)
);

CREATE TYPE participation_type AS ENUM ('Application', 'Invitation');

CREATE TABLE IF NOT EXISTS participations
(
    id                   UUID PRIMARY KEY,
    user_id              UUID NOT NULL,
    activity_id          UUID NOT NULL,
    is_confirmed         BOOLEAN,
    date_of_invitation   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_of_confirmation TIMESTAMPTZ,
    type                 participation_type,
    karma_points         INT                      DEFAULT 0,
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT activity_fk FOREIGN KEY (activity_id) REFERENCES activities (id)
);

CREATE TABLE IF NOT EXISTS acknowledgements
(
    id               UUID PRIMARY KEY,
    participation_id UUID NOT NULL,
    organization_id  UUID NOT NULL,
    text             TEXT NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT participation_fk FOREIGN KEY (participation_id) REFERENCES participations (id),
    CONSTRAINT organization_fk FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE IF NOT EXISTS prizes
(
    id              UUID PRIMARY KEY,
    price           INT          NOT NULL,
    name            VARCHAR(255) NOT NULL,
    organization_id UUID         NOT NULL,
    description     TEXT         NOT NULL,
    instructions    TEXT         NOT NULL,
    quantity        INT          NOT NULL,
    CONSTRAINT organization_fk FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE IF NOT EXISTS user_prizes
(
    user_id  UUID NOT NULL,
    prize_id UUID NOT NULL,
    PRIMARY KEY (user_id, prize_id),
    CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT prize_fk FOREIGN KEY (prize_id) REFERENCES prizes (id)
);


















