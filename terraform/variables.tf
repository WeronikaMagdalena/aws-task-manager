variable "aws_profile" {
  description = "AWS profile name"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

# Web App
variable "cognito_user_pool" {
  description = "Authorization user pool"
  type        = string
}

variable "cognito_user_pool_client" {
  description = "Authorization user pool client"
  type        = string
}

variable "object_ownership" {
  default = "BucketOwnerPreferred"
  type    = string
}

# RDS
variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}
