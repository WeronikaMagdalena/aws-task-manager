resource "aws_cognito_user_pool" "pool" {
  name                     = "my_user_pool"
  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "client" {
  name         = "my_user_pool_client"
  user_pool_id = aws_cognito_user_pool.pool.id
}

data "template_file" "example" {
  depends_on = [
    aws_elastic_beanstalk_environment.backend_app_env,
    aws_cognito_user_pool.pool,
    aws_cognito_user_pool_client.client
  ]
  template = file("env.tpl")
  vars = {
    reactRegion           = var.aws_region
    reactUserPoolId       = aws_cognito_user_pool.pool.id
    reactUserPoolClientId = aws_cognito_user_pool_client.client.id
    reactApiGateway       = aws_api_gateway_deployment.ApiDeployment.invoke_url
  }
}

resource "local_file" "generated_file" {
  content  = data.template_file.example.rendered
  filename = "${path.module}/../../frontend/.env"
}

locals {
  docker_image_frontend = "task_manager_frontend_repo:latest"
}

resource "aws_ecr_repository" "frontend_repository" {
  name         = "task_manager_frontend_repo"
  force_delete = true
}

resource "null_resource" "docker_build_frontend" {
  depends_on = [data.template_file.example]
  provisioner "local-exec" {
    command = "docker build -t task_manager_frontend_repo:latest ${path.module}/../../frontend"
  }

  provisioner "local-exec" {
    command = "aws ecr get-login-password --region ${var.aws_region} --profile ${var.aws_profile} | docker login --username AWS --password-stdin ${aws_ecr_repository.frontend_repository.repository_url}"
  }

  provisioner "local-exec" {
    command = "docker tag ${local.docker_image_frontend} ${aws_ecr_repository.frontend_repository.repository_url}:latest"
  }

  provisioner "local-exec" {
    command = "docker push ${aws_ecr_repository.frontend_repository.repository_url}:latest"
  }
}

resource "aws_s3_bucket" "frontend_s3_bucket" {
  bucket = "ww-task-manager-app-453453445343"
}

resource "aws_s3_bucket_ownership_controls" "frontend_s3_bucket_ownership_controls" {
  bucket = aws_s3_bucket.frontend_s3_bucket.id
  rule {
    object_ownership = var.object_ownership
  }
}

resource "aws_s3_bucket_acl" "frontend_s3_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.frontend_s3_bucket_ownership_controls]
  bucket     = aws_s3_bucket.frontend_s3_bucket.id
  acl        = "private"
}

data "template_file" "frontend_dockerrun" {
  depends_on = [null_resource.docker_build_frontend]
  template   = file("dockerrun.aws.json.tpl")

  vars = {
    aws_repo = "${aws_ecr_repository.frontend_repository.repository_url}:latest"
    port     = 80
  }
}

resource "aws_s3_bucket_object" "frontend_dockerrun" {
  depends_on = [data.template_file.frontend_dockerrun]
  bucket     = aws_s3_bucket.frontend_s3_bucket.id
  key        = "Dockerrun.aws.json"
  content    = data.template_file.frontend_dockerrun.rendered
}

resource "aws_elastic_beanstalk_application" "frontend_beanstalk_task_manager" {
  name        = "ww-task-manager-app-frontend"
  description = "Task Manager Application"
}

resource "aws_elastic_beanstalk_application_version" "frontend_app_version" {
  application = aws_elastic_beanstalk_application.frontend_beanstalk_task_manager.name
  bucket      = aws_s3_bucket.frontend_s3_bucket.id
  key         = aws_s3_bucket_object.frontend_dockerrun.key
  name        = "frontend-app-0.0.1"
}

resource "aws_elastic_beanstalk_environment" "frontend_app_env" {
  depends_on          = [aws_elastic_beanstalk_application_version.backend_app_version]
  name                = "frontend-task-manager"
  application         = aws_elastic_beanstalk_application.frontend_beanstalk_task_manager.name
  solution_stack_name = "64bit Amazon Linux 2 v4.0.5 running Docker"
  version_label       = aws_elastic_beanstalk_application_version.frontend_app_version.name

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "LabInstanceProfile"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "DisableIMDSv1"
    value     = "true"
  }

  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t2.micro"
  }
}
