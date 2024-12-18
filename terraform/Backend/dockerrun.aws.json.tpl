{
    "AWSEBDockerrunVersion": "1",
    "Image": {
      "Name": "${aws_repo}",
      "Update": "true"
    },
    "Ports": [
      {
        "ContainerPort": ${port},
        "HostPort": ${port}
      }
    ]
  }