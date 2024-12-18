FROM amazoncorretto:21

WORKDIR /usr/local/bin

COPY taskmanager-0.0.1-SNAPSHOT.jar ./taskManager.jar

ENV DB_URL=""
ENV DB_USERNAME=""
ENV DB_PASSWORD=""

CMD ["java", "-jar", "taskManager.jar"]