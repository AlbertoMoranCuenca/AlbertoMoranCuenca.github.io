pipeline {
    agent { label 'prod' }

    environment {
        PORTAINER_SERVER_URL = "${env.PORTAINER_SERVER_URL}"
        PORTAINER_TOKEN = credentials('PORTAINER_TOKEN')
        DOCKERHUB_CREDENTIALS = credentials('DOCKERHUB_CREDENTIALS')
        CONTAINER_NAME = 'webpage'
        IMAGE_NAME = 'albertomoran/webpage:latest'
        ENVIRONMENT_ID = '6'
    }

    stages {
        stage('Build docker image') {
            steps {
                script {
                    sh """
                    docker build -t ${IMAGE_NAME} .
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh """
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin
                    docker push ${IMAGE_NAME}
                    docker logout
                    """
                }
            }
        }

        stage('Deploy to Portainer') {
            steps {
                script {
                    def deployConfig = """{
                        "Name": "${CONTAINER_NAME}",
                        "Image": "${IMAGE_NAME}",
                        "ExposedPorts": {
                            "80/tcp": {}
                        },
                        "HostConfig": {
                            "PortBindings": {
                                "80/tcp": [
                                    { "HostPort": "80" }
                                ]
                            }
                        }
                    }"""

                    // Crear el contenedor en Portainer y capturar la respuesta JSON
                    def createResponse = httpRequest(
                        url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/v1.41/containers/create?name=${CONTAINER_NAME}",
                        httpMode: 'POST',
                        contentType: 'APPLICATION_JSON',
                        customHeaders: [[name: 'X-API-Key', value: "${PORTAINER_TOKEN}"]],
                        requestBody: deployConfig,
                        validResponseCodes: '200:201'
                    )

                    // Extraer el ID del contenedor de la respuesta JSON
                    def containerId = new groovy.json.JsonSlurper().parseText(createResponse.content).Id

                    echo "Container ID: ${containerId}"

                    // Iniciar el contenedor usando el ID en lugar del nombre
                    httpRequest(
                        url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/containers/${containerId}/start",
                        httpMode: 'POST',
                        customHeaders: [[name: 'X-API-Key', value: "${PORTAINER_TOKEN}"]],
                        validResponseCodes: '200:204'
                    )
                }
            }
        }
    }
}
