
-- Insert dummy entries
INSERT INTO people ("firstName", "lastName", email, profession, "permanentAddress", "currentAddress", "phoneNumber", image, "birthDate", "deathDate", gender, "isRoot", "createdAt", "updatedAt")
VALUES 
('John', 'Doe', 'john.doe@example.com', 'Engineer', '123 Main St', '456 Elm St', '123-456-7890', NULL, '1980-01-01', NULL, 'male', TRUE, NOW(), NOW()),
('Jane', 'Doe', 'jane.smith@example.com', 'Doctor', '789 Oak St', '101 Pine St', '987-654-3210', NULL, '1985-05-05', NULL, 'female', FALSE, NOW(), NOW()),
('Alice', 'Doe', 'alice.johnson@example.com', 'Teacher', '234 Maple St', '567 Birch St', '555-555-5555', NULL, '2010-10-10', NULL, 'female', FALSE, NOW(), NOW()),
('Bob', 'Brown', 'bob.brown@example.com', 'Artist', '345 Cedar St', '678 Spruce St', '444-444-4444', NULL, '2012-12-12', NULL, 'male', FALSE, NOW(), NOW()),
('Charlie', 'Brown', 'charlie.davis@example.com', 'Musician', '456 Willow St', '789 Fir St', '333-333-3333', NULL, '2015-03-03', NULL, 'male', FALSE, NOW(), NOW()),
('Ted', 'Davis', 'ted.davis@example.com', 'Musician', '456 Willow St', '789 Fir St', '333-333-3373', NULL, '2015-03-03', NULL, 'male', FALSE, NOW(), NOW()),
('Mary', 'Davis', 'mary.davis@example.com', 'Composer', '456 Willow St', '789 Fir St', '333-333-3633', NULL, '2015-03-03', NULL, 'male', FALSE, NOW(), NOW());


-- Insert relationships with timestamps
INSERT INTO "PersonParents" ("personId", "parentId", "createdAt", "updatedAt")
VALUES 
(3, 1, NOW(), NOW()),
(3, 2, NOW(), NOW()),
(5, 3, NOW(), NOW()),
(5, 4, NOW(), NOW()),
(7, 3, NOW(), NOW()),
(7, 6, NOW(), NOW());

-- Insert partnerships with timestamps
INSERT INTO "PersonPartners" ("personId", "partnerId", "createdAt", "updatedAt")
VALUES 
(1, 2, NOW(), NOW()),
(6, 3, NOW(), NOW()),
(4, 3, NOW(), NOW());
