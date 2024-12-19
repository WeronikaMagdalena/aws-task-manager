# Task Manager Application

## Overview
The **Task Manager Application** is a full-stack project built using a **Spring Boot backend** and a **React frontend**, deployed using AWS services. The application allows users to manage tasks efficiently with features such as user authentication, database integration, and a responsive UI.

## Features
- **Frontend**: A React-based user interface for managing tasks.
- **Backend**: A Spring Boot API that handles business logic and communicates with the database.
- **Authentication**: Managed via AWS Cognito for secure user login.
- **Database**: PostgreSQL hosted on AWS RDS.
- **Infrastructure**: Fully containerized and deployed using AWS Elastic Beanstalk.

## Architecture Overview

### 1. **Frontend**
- **Framework**: React.
- **Deployment**: Packaged as a Docker container, stored in an AWS ECR repository, and deployed using AWS Elastic Beanstalk.
- **Storage**: Static assets managed in an S3 bucket with private ACL.

### 2. **Backend**
- **Framework**: Spring Boot.
- **Deployment**: Packaged as a Docker container, stored in an AWS ECR repository, and deployed using AWS Elastic Beanstalk.
- **Environment Variables**:
  - `DB_URL`: JDBC URL to connect to the PostgreSQL database.
  - `DB_USERNAME`: Database username.
  - `DB_PASSWORD`: Database password.

### 3. **Database**
- **Engine**: PostgreSQL.
- **Service**: AWS RDS.
- **Security**: Protected by an AWS Security Group allowing traffic on port 5432 from anywhere (for testing purposes; restrict in production).

### 4. **Authentication**
- **Service**: AWS Cognito.
- **User Pool**: Manages user sign-up and sign-in.

### 5. **Infrastructure**
- **Orchestration**: Terraform for Infrastructure-as-Code (IaC).
- **Containerization**: Docker for both frontend and backend services.
- **Deployment**:
  - **Elastic Beanstalk**: Hosts the Docker containers.
  - **S3 Buckets**:
    - Backend: Stores Dockerrun configuration.
    - Frontend: Stores Dockerrun configuration and static files.

## AWS Services Used

### 1. **Elastic Beanstalk**
- Used for managing the deployment and scaling of Dockerized applications.
- Separate environments for frontend and backend.

### 2. **Elastic Container Registry (ECR)**
- Stores Docker images for both frontend and backend.
- Integrated with Elastic Beanstalk for deployments.

### 3. **S3 Buckets**
- **Frontend Bucket**:
  - Stores static assets and Dockerrun configuration.
  - ACL: Private.
- **Backend Bucket**:
  - Stores Dockerrun configuration.
  - ACL: Private.

### 4. **RDS (Relational Database Service)**
- PostgreSQL database for storing tasks and user data.
- Allocated storage: 20 GB.

### 5. **Cognito**
- Handles user authentication and authorization.
- Generates user pool and client ID used by the frontend for authentication.

## Terraform Configuration Highlights
### Backend
- **ECR Repository**: `task_manager_backend_repo`
- **Elastic Beanstalk Application and Environment**:
  - Application name: `ww-task-manager-app`
  - Environment name: `backend-task-manager`
- **S3 Bucket**: `ww-task-manager-app-27236348`

### Frontend
- **ECR Repository**: `task_manager_frontend_repo`
- **Elastic Beanstalk Application and Environment**:
  - Application name: `ww-task-manager-app-frontend`
  - Environment name: `frontend-task-manager`
- **S3 Bucket**: `ww-task-manager-app-453453445343`

### Database
- **Instance Class**: `db.t3.micro`
- **Engine**: PostgreSQL 16.3
- **Identifier**: `task-manager-db-6`
- **Security Group**: Allows inbound traffic on port 5432.

## How to Run Locally
1. **Prerequisites**:
   - Docker installed.
   - AWS CLI configured.
   - Terraform installed.

2. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

## Deployment Steps
**Terraform Setup**:
   - Initialize Terraform:
     ```bash
     terraform init
     ```
   - Apply Configuration:
     ```bash
     apply.bat
     ```

