INSERT INTO scopes (id, name)
VALUES
    (1, 'healthcare'),
    (2, 'education'),
    (3, 'sports'),
    (4, 'culture'),
    (5, 'community'),
    (6, 'animals'),
    (7, 'nature');

ALTER SEQUENCE scopes_id_seq RESTART WITH 8;

-- Insert fake data into organizations
INSERT INTO organizations (id, name, email, phone, type_id, mission, address, website, facebook, instagram, youtube, linkedin, image_url, created_at, updated_at)
VALUES
    ('cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'KTU savanoriai / KTU volunteers', 'volunteers@ktu.lt', '+370 373 00000', 3, 'Organizing volunteer activities for academic and professional community', ' K. Donelaičio g. 73, Kaunas', 'https://ktu.edu/', 'https://www.facebook.com/ktu.lt', 'https://www.instagram.com/ktustudentlife', null, 'https://www.linkedin.com/school/ktu', 'https://jshimas-karma-uploads.s3.eu-north-1.amazonaws.com/ktu.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d4f52d2b-753e-4832-b0e2-96c8c836b51b', 'Anykščių regioninis parkas', 'anyksciuparkas@saugoma.lt', '+370 381 50738', 1, 'Siekiame išsaugoti vertingiausias Anykščių krašto gamtinius ir kultūrinius kompleksus bei objektus, juos tvarkyti ir racionaliai naudoti, įskaitant daugiau nei 700 aukštesniųjų augalų rūšių.', 'J. Biliūno g. 55, Anykščiai', 'https://anyksciuparkas.lt', 'facebook.com/anyksciuparkas', 'instagram.com/anyksciuparkas', 'youtube.com/anyksciuparkas', 'linkedin.com/company/anyksciuparkas', 'https://jshimas-karma-uploads.s3.eu-north-1.amazonaws.com/anyksciu_regioninis_parkas.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('7eb9a07e-238e-4137-8f7e-7c6d92d012f5', 'Jaunieji maltiečiai', 'jaunieji@maltieciai.lt', '+370 369 123056', 2, 'Esame socialiai atsakinga jaunimo bendruomenė, kuri siekia ugdyti jauną žmogų per savanorišką veiklą socialinėje srityje. ', 'Gedimino pr. 56b, Vilnius', 'https://maltieciai.lt/jaunieji-maltieciai/', 'https://www.facebook.com/jauniejimaltieciai', null, null, null, 'https://jshimas-karma-uploads.s3.eu-north-1.amazonaws.com/maltieciai.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users (id, first_name, last_name, email, role_id, account_type_id, image_url, bio, password, organization_id, karma_points, created_at, updated_at)
VALUES
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1662', 'John', 'Doe', 'doejohn1997@gmail.com', 1, 1, 'https://jshimas-karma-uploads.s3.eu-north-1.amazonaws.com/john.jpg', 'Hi, I am John, an enthusiastic volunteer dedicated to making a positive impact. With a background in environmental science, I am passionate about conservation efforts and sustainability initiatives. Whether it is planting trees or organizing beach clean-ups, I thrive on contributing to a healthier planet and stronger communities.', '$2a$10$GJrPSacmncso/gxtExFBd.QIMKlilepmmI.qrn1p6YROZh528OhpC', null, 250, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1663', 'Peter', 'Parker', 'petparker@yahoo.com', 1, 1, 'https://jshimas-karma-uploads.s3.eu-north-1.amazonaws.com/peter.jpg', 'Hey there, I am Peter, a dedicated volunteer driven by the desire to give back. With a knack for organization and a heart for community, I have spent years lending a hand wherever needed. From soup kitchens to mentoring programs, I am committed to making a meaningful difference in the lives of others, one act of kindness at a time.', '$2a$10$GJrPSacmncso/gxtExFBd.QIMKlilepmmI.qrn1p6YROZh528OhpC', null, 325, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1664', 'Jurgita', 'Voveraitė', 'j.voveraite@outlook.com', 1, 1, 'https://jshimas-karma-uploads.s3.eu-north-1.amazonaws.com/jurgita.jpg', 'Sveiki, aš esu Jurgita, aktyvi savanorė, atradusi prasmę pagalboje kitiems. Turėdama aukštąjį išsilavinimą socialiniuose moksluose, aš stengiuosi dalyvauti įvairiose bendruomenės programose ir renginiuose. Mano tikslas - kurti saugias ir įtrauktines bendruomenes, kuriose kiekvienas gali jaustis vertinamas ir priimtas.', '$2a$10$GJrPSacmncso/gxtExFBd.QIMKlilepmmI.qrn1p6YROZh528OhpC', null, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1665', 'Simona', 'Stankaitė', 'simona1999@gmail.com', 1, 1, 'https://jshimas-karma-uploads.s3.eu-north-1.amazonaws.com/simona.jpg', 'Labas, aš esu Simona, entuziastinga savanorė, kuri siekia padėti kitiems. Su aistra menui ir kultūrai, aš dalyvavau įvairiuose meno projektuose, skatinančiuose kūrybiškumą ir bendruomeniškumą. Mano tikslas - įkvėpti kitus, atrasti savo talentą ir mėgautis menininko keliu.', '$2a$10$GJrPSacmncso/gxtExFBd.QIMKlilepmmI.qrn1p6YROZh528OhpC', null, 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1666', 'Paulius', 'Jonys', 'organizatorius@ktu.lt', 2, 1, null, null, '$2a$10$AE1ddUYRJp/EZHnfYCDZMOAKp0BQtszVZrjwUtMZZjcmTEr/kr6ke', 'cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO user_scopes (user_id, scope_id)
VALUES
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1662', 3), -- John: sports
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1662', 5), -- John: community
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1663', 5), -- Peter: community
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1664', 5), -- Jurgita: community
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1664', 4), -- Jurgita: culture
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1665', 4), -- Simona: culture
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1665', 3), -- Simona: sports
    ('d49d2e22-2b6b-4d8c-9f8d-9f24495e1666', 2); -- Paulius: education

INSERT INTO user_locations (id, user_id, location, address, name)
VALUES
    ('43b913d4-0546-498c-863b-de99fc1f9ff3', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1664', '0101000020E610000031B9629005DA4B408B7CA87EEF243540', 'Klaipėda, Klaipeda City Municipality, Lithuania', 'Namai'),
    ('22b199b1-bee6-4a0d-8ae9-63c312877c5c','d49d2e22-2b6b-4d8c-9f8d-9f24495e1664', '0101000020E61000004CF6741A0E734B40BA9F53909FE93740', 'K. Donelaičio gatvė 73, Kaunas, Kaunas City Municipality, Lithuania', 'Studijos');

-- Insert fake data into events
INSERT INTO activities (id, organization_id, name, start_date, end_date, is_public, description, address, geo_location, resolved, volunteers_needed, created_at, updated_at)
VALUES
    ('1f1a7893-03d1-41f0-a810-80ed61ce1d16', 'cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'Night basketball', '2024-04-15 18:00:00', '2024-04-16 02:00:00', TRUE, 'Come to compete in basketball, Skate, BMX & Scooter, or street dance tournaments and support your friends here. As night falls, immerse yourself in a concert featuring Lithuania''s top Hip Hop performers, where you can groove until the morning comes. Additionally, you will discover spots to dine, unwind, and snag some NK merch. With both daytime and nighttime parts, the festivities will run until the early hours.', 'Bagažinių turgus, Elektrėnų gatvė, Kaunas, Lietuva ', '0101000020E61000005F2DD21FF5744B40449C983FF0FE3740', FALSE, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('7f5a792d-36a4-419e-a2db-e75db37ca7db', 'cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'KTU WANTed career days 2024', '2024-04-30 08:00:00', '2024-04-30 20:00:00', TRUE, 'KTU WANTed Career Days 2023 is the largest event for contacts and career planning in the Baltic States, attended by students, pupils and companies and organised by Kaunas University of Technology. The Career Days, organised for the last nineteen years, helped thousands of students to successfully enter the labour market and the representatives of companies to find the most talented employees and interns for their organisations.', '"Žalgirio" arena', '0101000020E6100000AFFFDF7DFA714B4084F9861D21EA3740', FALSE, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('4e7e0a8e-7d0a-4b21-9a63-7a2e8fbd6f61', '7eb9a07e-238e-4137-8f7e-7c6d92d012f5', 'Maisto pristatymas senjorams', '2024-06-20 09:30:00', '2024-06-20 16:30:00', TRUE, 'Šilto maisto arba maisto davinio pristatymas į namus sunkiai gyvenantiems senjorams. Silpniausiems 2-3 kartus per savaitę vežamas jau paruoštas valgis, o stipresniems pristatomas maisto produktų krepšelis (prireikus padedama pasigaminti). Savanoriška priežiūra namuose. Pagalba seneliams, kuriems trūksta žmogiško kontakto ar reikalinga fizinė pagalba. Pas senelį atvykę savanoriai pabendrauja, išklauso, padeda išeiti į lauką pasivaikščioti, palydi į įstaigas, padeda namų ruošoje, tvarko namų aplinką ir pataria įvairiais klausimais.', 'Gedimino pr. 56B, Vilnius', '0101000020E6100000DBD1FF722D584B40AC4C423399433940', FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('7ab4a2b5-ec5b-45ca-923d-e3a78375ddc6', 'd4f52d2b-753e-4832-b0e2-96c8c836b51b', 'Pažintinių takų paruošimas naujam sezonui', '2024-06-14 8:15:00', '2024-06-14 17:00:00', TRUE, 'Keliaukite į rytų pusę palei bėgius maždaug 4,3 km iki įspūdingo Žažumbrio ąžuolo, šalia yra poilsiaviečių atsipūsti. Nuo ąžuolo toliau keliaukite į rytus palei bėgius maždaug 1 km iki geležinkelio sankryžos su keliuku. Laikykitės dešiniau ir netrukus pasieksite asfalto kelią. Pasukite į dešinę ir keliaukite Anykščių link maždaug 4 km. Pasiekę T formos sankryžą ir pasukę į kairę už 300 m pasieksite aištelę, nuo kurios nesunkiai pasieksite J. Biliūno kapą – „Laimės žiburį“.', 'Vilties g. 2, Anykščiai, Anykščių r. sav', '0101000020E6100000ED3081B630C44B403AF18B01C81B3940', FALSE, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('8cb4a2b5-ec5b-45ca-923d-e3a78375dde6', 'd4f52d2b-753e-4832-b0e2-96c8c836b51b', 'Neformalus vaikų ugdymas', '2024-03-17 8:15:00', '2024-03-17 17:00:00', TRUE, '-', 'Vilties g. 2, Anykščiai, Anykščių r. sav', '0101000020E6100000ED3081B630C44B403AF18B01C81B3940', TRUE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert fake data into event_scopes
INSERT INTO activity_scopes (activity_id, scope_id)
VALUES
    ('1f1a7893-03d1-41f0-a810-80ed61ce1d16', 3),
    ('1f1a7893-03d1-41f0-a810-80ed61ce1d16', 4),
    ('7f5a792d-36a4-419e-a2db-e75db37ca7db', 2),
    ('4e7e0a8e-7d0a-4b21-9a63-7a2e8fbd6f61', 5),
    ('7ab4a2b5-ec5b-45ca-923d-e3a78375ddc6', 7),
    ('8cb4a2b5-ec5b-45ca-923d-e3a78375dde6', 2);

-- Insert fake data into feedbacks
INSERT INTO feedbacks (id, comment, activity_id, user_id, rating)
VALUES
    ('4ca56d9c-82cc-4e12-b2f4-4eaf7e7f90a6', 'Nuostabi patirtis prisidėti prie šiuolaikiškos kultūros gyvenimo. Gaila, bet renginio pabaigoje pritrūkome geriamojo vandens', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1664', 4),
    ('4ca56d9c-82cc-4e12-b2f4-4eaf7e7f90a7', 'Jaučiausi puikiai prisdėdama prie šio renginio', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1665', 5);

INSERT INTO prizes (id, price, name, organization_id, description, instructions, quantity)
VALUES
    ('1c4a26d3-d3de-4c8e-b68f-0e012a3e07f9', 300, 'Spotify 1 month premium', 'cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'One month premium subscription to Spotify for unlimited music streaming.', 'Use code: 1#vs524gV', 10),
    ('2a99fb53-7c2e-4ba2-88b1-883a7814df2e', 120, 'One free cup of coffee at Caffeine', 'cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'One complimentary cup of coffee at Caffeine, a cozy café known for its quality brews.', 'Show one of our activities'' certifications when ordering.', 15),
    ('3d31c025-234c-49aa-b263-107f3e8b10d3', 350, '2 movie tickets at Forum Cinemas ', 'cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'Two movie tickets for any movie screening at Forum Cinemas, the premier theater in town.', 'Use discount code: karmavolunteer2024xyz', 5),
    ('4a58f825-2cc3-495b-b5f2-66c202de5ed1', 400, '15 Eur coupon at knygos.lt', 'd4f52d2b-753e-4832-b0e2-96c8c836b51b', '15 Eur kuponas knygos.lt elektroninėje knygų parduotuvėje', 'Use discount code: karmavolunteer2024xyz', 5),
    ('5b1f3d7f-5cf2-4c80-9301-65b27a44c695', 600, 'Water bottle', '7eb9a07e-238e-4137-8f7e-7c6d92d012f5', '1 litro aliumininė Jaunųjų maltiečių gertuvė', 'Atsiimkite Jaunųjų maltiečių ofise', 3);

INSERT INTO applications (id, user_id, activity_id, motivation, is_approved, valid, date_of_approval)
VALUES
    ('1c4a26d3-d3de-4c8e-b68f-0e012a3e07f9', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1664', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', 'I''m excited to contribute to this event and make a positive impact on the community.', TRUE, TRUE, '2024-04-27 10:30:00'),
    ('2a99fb53-7c2e-4ba2-88b1-883a7814df2e', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1665', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', 'I''m passionate about this cause and eager to lend my support.', TRUE, TRUE, '2024-04-27 11:15:00'),
    ('3d31c025-234c-49aa-b263-107f3e8b10d3', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1663', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', 'I believe in the mission of this activity and want to be part of the positive change.', FALSE, TRUE, '2024-04-27 12:00:00'),
    ('4a58f825-2cc3-495b-b5f2-66c202deddd1', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1664', '7f5a792d-36a4-419e-a2db-e75db37ca7db', 'I''m interested in participating and learning more about this event.', null, TRUE, null),
    ('5b1f3d7f-5cf2-4c80-9301-65b27a43c695', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1662', '7f5a792d-36a4-419e-a2db-e75db37ca7db', 'I''m looking forward to contributing to this activity and meeting new people.', TRUE, TRUE, '2024-04-27 14:00:00');

INSERT INTO participations (id, user_id, activity_id, is_confirmed, type, date_of_invitation, date_of_confirmation)
VALUES
    ('1c4a26d3-d3de-4c8e-b68f-0e012a3e07f1', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1664', '8cb4a2b5-ec5b-45ca-923d-e3a78375dde6', TRUE, 'Application', '2024-03-13 10:30:00', '2024-03-15 15:30:00'),
    ('1c4a26d3-d3de-4c8e-b68f-0e012a3e07f9', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1664', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', TRUE, 'Application', '2024-04-13 10:30:00', '2024-04-14 15:30:00'),
    ('2a99fb53-7c2e-4ba2-88b1-883a7814df2e', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1665', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', TRUE, 'Application', '2024-04-12 10:30:00', '2024-04-14 15:30:00'),
    ('2a99fb53-7c2e-4ba2-88b1-883a7814dfc8', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1662', '1f1a7893-03d1-41f0-a810-80ed61ce1d16', TRUE, 'Application', '2024-04-11 10:30:00', '2024-04-12 15:30:00'),
    ('3d31c025-234c-49aa-b263-107f3e8b10d3', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1665', '7f5a792d-36a4-419e-a2db-e75db37ca7db', TRUE, 'Application', '2024-04-27 10:30:00', '2024-04-27 15:30:00'),
    ('de1a2b3d-7101-4dfd-bbc3-1bfc3556cd04', 'd49d2e22-2b6b-4d8c-9f8d-9f24495e1662', '7f5a792d-36a4-419e-a2db-e75db37ca7db', FALSE, 'Application', '2024-04-26 13:30:00', '2024-04-27 15:32:00');

INSERT INTO acknowledgements (id, participation_id, organization_id, text)
VALUES
    ('2a99fb53-7c2e-4ba2-88b1-883a7814df2e', '1c4a26d3-d3de-4c8e-b68f-0e012a3e07f9', 'cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7', 'Thank you for your valuable participation in our event!'),
    ('2a99fb53-7c2e-4ba2-88b1-883a7814df2f', '1c4a26d3-d3de-4c8e-b68f-0e012a3e07f1', 'd4f52d2b-753e-4832-b0e2-96c8c836b51b', 'Ačiū už tavo pagalbą prisidedant prie Anykščių regioninio parko lankytojų džiaugsmo! Nuostabiai dirbi su vaikais.');

