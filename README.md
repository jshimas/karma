# Karma - Volunteer Organization Platform

**Disclaimer: This project represents a draft for a bachelor's thesis project, and functional requirements are subject to change in the future.**

## About Karma

The goal of the Karma project is to facilitate the process of connecting volunteers with volunteer activities and helping organizations find volunteers.

## System Purpose

The purpose of the "Karma" system is to bring volunteers together with organizations for volunteer activities. A volunteer looking for organized volunteer events can do so without registering in the system. However, to submit a volunteer application, they will need to create an account. Once registered in the system, a volunteer can view a list of available activities, receive recommended volunteer positions, find nearby volunteer activities, record completed volunteer hours, and access recommendations from companies. On the other hand, organizations that have joined the system can create events, accept or reject volunteer applications, log volunteer hours, or provide feedback about the volunteer.

### Functional Requirements

#### Unregistered System User (Volunteer) can:

1. View the list/calendar of volunteer activities.
2. View a specific volunteer activity info.
3. Log in to the system.

#### Registered System User (Volunteer) can:

1. View the list of volunteer activities.
2. View a specific volunteer activity info.
3. Submit an application for volunteer work.
4. View and edit their profile.
5. View a list of invitations.
6. Accept or reject pending invitations.
7. Write feedback about an organization.
8. Accumulate volunteer hours to acquire sponsor discount codes.

#### Registered System User (Organization) can:

1. Manage volunteer activities: view, edit, delete, create.
2. Write recommendations for volunteers.
3. View the list of available volunteers.
4. View a volunteer's profile.
5. Accept or reject volunteer applications for volunteer activities.

#### Administrator can:

1. Approve an organizer's account.
2. Manage system's accounts.
3. Remove volunteer activity listings.

## System Architecture

### Technologies Planning to Used:

- Frontend - TypeScript, React.js, Tailwind, Redux
- Backend - Java, Spring Boot, Hibernate ORM, PostgreSQL

### System Deployment

The web application will be accessible through HTTP. Data manipulation within the system will be facilitated using a REST API, which will manage data exchanges with the Karma database powered by PostgreSQL DBMS. An ORM will be used for more convenient data management.

## REST API Deployment and Demo

### Deployed Version

The Karma REST API is deployed on DigitalOcean App Platform.

- Use [Karma API](https://karma-api-crb2z.ondigitalocean.app) to access the deployed REST API.

### Test Demo REST API Locally

To run the demo REST API locally using Docker Compose, follow these instructions:

**Prerequisite**: Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop) installed on your local machine.

1. Clone the Karma repository to your local machine.
2. Change the directory and run the Docker Compose:

   ```bash
   cd karma/karma-api
   docker compose -f compose-full.yaml up -d
   ```

3. To shut down it down use:

   ```bash
   docker compose -f compose-full.yaml down -v
   ```

## Documentation

Documentation is currently under development and will be available in the near future as Postman API documentation.

Please note that this document represents a preliminary overview of the "Karma" project for a bachelor's thesis and may undergo changes to its functional requirements in the future.
