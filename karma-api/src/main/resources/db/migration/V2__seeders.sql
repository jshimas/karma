INSERT INTO users (id, first_name, last_name, email, role_id, password, created_at, updated_at)
VALUES
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1662', 'John', 'Doe', 'johndoe@example.com', 1, 'password1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ee6c7f86-2db4-4df2-95f6-6a86bf1c8907', 'Jane', 'Smith', 'janesmith@example.com', 4, 'password2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert fake data into organizations
INSERT INTO organizations (id, name, email, phone, type_id, mission, address, website, facebook, instagram, youtube, linkedin, created_at, updated_at)
VALUES
    ('cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'Charity Foundation', 'info@charity.org', '123456789', 1, 'Supporting needy families', '123 Charity St', 'charity.org', 'facebook.com/charity', 'instagram.com/charity', 'youtube.com/charity', 'linkedin.com/company/charity', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d4f52d2b-753e-4832-b0e2-96c8c836b51b', 'Community Center', 'info@communitycenter.org', '987654321', 2, 'Connecting neighbors', '456 Community Ave', 'communitycenter.org', 'facebook.com/communitycenter', 'instagram.com/communitycenter', 'youtube.com/communitycenter', 'linkedin.com/company/communitycenter', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('7eb9a07e-238e-4137-8f7e-7c6d92d012f5', 'Educational Institute', 'info@eduinst.org', '555123456', 3, 'Empowering future leaders', '789 Edu St', 'eduinst.org', 'facebook.com/eduinst', 'instagram.com/eduinst', 'youtube.com/eduinst', 'linkedin.com/company/eduinst', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert fake data into events
INSERT INTO events (id, organization_id, name, start_date, description, duration, location, geo_location, created_at, updated_at)
VALUES
    ('1f1a7893-03d1-41f0-a810-80ed61ce1d16', 'cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'Annual Charity Gala', '2023-11-15 18:00:00', 'Join us for a night of fundraising', '4 hours', 'Grand Ballroom', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('7f5a792d-36a4-419e-a2db-e75db37ca7db', 'd4f52d2b-753e-4832-b0e2-96c8c836b51b', 'Community Cleanup', '2023-10-25 09:00:00', 'Help clean up our neighborhood', '3 hours', 'Community Park', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('4e7e0a8e-7d0a-4b21-9a63-7a2e8fbd6f61', '7eb9a07e-238e-4137-8f7e-7c6d92d012f5', 'Coding Workshop', '2023-09-20 14:30:00', 'Learn coding with experts', '2 hours', 'Edu Institute Classroom', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('b7f245d2-86f2-4bdf-9d45-81d0eecd7ac3', 'cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'Holiday Toy Drive', '2023-12-10 10:00:00', 'Collecting toys for underprivileged children', '5 hours', 'Shopping Mall', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('7ab4a2b5-ec5b-45ca-923d-e3a78375ddc6', 'd4f52d2b-753e-4832-b0e2-96c8c836b51b', 'Community Potluck', '2023-10-05 17:30:00', 'Share food and stories with neighbors', '2 hours', 'Community Center Hall', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert fake data into feedbacks
-- Insert fake data into feedbacks
INSERT INTO feedbacks (id, comment, event_id, user_id)
VALUES
    ('4ca56d9c-82cc-4e12-b2f4-4eaf7e7f90a6', 'Great event, I had a wonderful time!', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1662'),
    ('a5f8656d-1e5d-483c-879b-d5084bfcd7e2', 'The cleanup was successful, thanks for organizing!', '7f5a792d-36a4-419e-a2db-e75db37ca7db', 'ee6c7f86-2db4-4df2-95f6-6a86bf1c8907'),
    ('f8ed82e5-1d3d-4932-bd41-46dbf7ea02ec', 'I learned a lot at the coding workshop, highly recommended!', '4e7e0a8e-7d0a-4b21-9a63-7a2e8fbd6f61', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1662'),
    ('f1b2e3d4-5678-4c3a-9b1a-0d1e2f3a4b5c', 'The toy drive is a fantastic initiative!', 'b7f245d2-86f2-4bdf-9d45-81d0eecd7ac3', 'ee6c7f86-2db4-4df2-95f6-6a86bf1c8907'),
    ('3d2a1b4c-1234-4a4b-8a8b-7a2b2c3d4e5f', 'The gala event was a huge success, kudos to the team!', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1662'),
    ('b8c7a9f6-23a4-4c3a-8b1a-1d2e3f4b5c6d', 'Community cleanup made our neighborhood cleaner and better!', '7f5a792d-36a4-419e-a2db-e75db37ca7db', 'ee6c7f86-2db4-4df2-95f6-6a86bf1c8907'),
    ('a1b2c3d4-1e2e-4a4b-9b1a-7a8b9c1d2e3f', 'Coding workshop provided valuable skills for the future.', '4e7e0a8e-7d0a-4b21-9a63-7a2e8fbd6f61', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1662'),
    ('5e6f7d8c-8b7c-4a3c-9d8d-1e2e3f4b5c6d', 'Toy drive brought smiles to many children, well done!', 'b7f245d2-86f2-4bdf-9d45-81d0eecd7ac3', 'ee6c7f86-2db4-4df2-95f6-6a86bf1c8907'),
    ('7a8b9c1d-1e2e-2a3c-9b1a-1d2e3f4b5c6d', 'Potluck was a fun and delicious evening with our neighbors.', '7ab4a2b5-ec5b-45ca-923d-e3a78375ddc6', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1662');
