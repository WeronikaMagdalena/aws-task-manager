provider "docker" {
  host = "tcp://localhost:2375"
}

locals {
  docker_image_backend = "task_manager_backend_repo:latest"
}

resource "aws_ecr_repository" "backend_repository" {
  name         = "task_manager_backend_repo"
  force_delete = true
}

resource "null_resource" "docker_build_backend" {
  provisioner "local-exec" {
    command = "docker build -t task_manager_backend_repo:latest ${path.module}/sources" # later can point to backend jar directly (and Dockerfile there)
  }

  provisioner "local-exec" {
    command = "aws ecr get-login-password --region ${var.aws_region} --profile ${var.aws_profile} | docker login --username AWS --password-stdin ${aws_ecr_repository.backend_repository.repository_url}"
  }

  provisioner "local-exec" {
    command = "docker tag ${local.docker_image_backend} ${aws_ecr_repository.backend_repository.repository_url}:latest"
  }

  provisioner "local-exec" {
    command = "docker push ${aws_ecr_repository.backend_repository.repository_url}:latest"
  }
}

resource "aws_s3_bucket" "backend_s3_bucket" {
  bucket = "ww-task-manager-app-27236348"
}

resource "aws_s3_bucket_ownership_controls" "backend_s3_bucket_ownership_controls" {
  bucket = aws_s3_bucket.backend_s3_bucket.id
  rule {
    object_ownership = var.object_ownership
  }
}

resource "aws_s3_bucket_acl" "backend_s3_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.backend_s3_bucket_ownership_controls]
  bucket     = aws_s3_bucket.backend_s3_bucket.id
  acl        = "private"
}

data "template_file" "backend_dockerrun" {
  depends_on = [null_resource.docker_build_backend]
  template   = file("dockerrun.aws.json.tpl")

  vars = {
    aws_repo = "${aws_ecr_repository.backend_repository.repository_url}:latest"
    port     = 8080
  }
}

resource "aws_s3_bucket_object" "backend_dockerrun" {
  depends_on = [data.template_file.backend_dockerrun]
  bucket     = aws_s3_bucket.backend_s3_bucket.id
  key        = "Dockerrun.aws.json"
  content    = data.template_file.backend_dockerrun.rendered
}

resource "aws_elastic_beanstalk_application" "backend_beanstalk_task_manager" {
  name        = "ww-task-manager-app"
  description = "Task Manager Application"
}

resource "aws_elastic_beanstalk_application_version" "backend_app_version" {
  application = aws_elastic_beanstalk_application.backend_beanstalk_task_manager.name
  bucket      = aws_s3_bucket.backend_s3_bucket.id
  key         = aws_s3_bucket_object.backend_dockerrun.key
  name        = "backend-app-0.0.1"
}

resource "aws_elastic_beanstalk_environment" "backend_app_env" {
  depends_on          = [aws_elastic_beanstalk_application_version.backend_app_version]
  name                = "backend-task-manager"
  application         = aws_elastic_beanstalk_application.backend_beanstalk_task_manager.name
  solution_stack_name = "64bit Amazon Linux 2 v4.0.5 running Docker"
  version_label       = aws_elastic_beanstalk_application_version.backend_app_version.name

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "LabInstanceProfile"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_URL"
    value     = "jdbc:postgresql://${aws_db_instance.task_manager_db.endpoint}/${var.db_name}"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_USERNAME"
    value     = var.db_username
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PASSWORD"
    value     = var.db_password
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

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "LoadBalanced"
  }
}

