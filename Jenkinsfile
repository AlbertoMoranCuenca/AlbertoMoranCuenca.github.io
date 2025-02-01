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
                    docker.build("${IMAGE_NAME}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIALS', usernameVariable: 'DOCKERHUB_USR', passwordVariable: 'DOCKERHUB_PSW')]) {
                        sh """
                        echo $DOCKERHUB_PSW | docker login -u $DOCKERHUB_USR --password-stdin
                        docker push ${IMAGE_NAME}
                        docker logout
                        """
                    }
                }
            }
        }

        stage('Clean docker image') {
            steps {
                script {
                    sh "docker rmi ${IMAGE_NAME}"
                }
            }
        }

        stage('Pull image on Portainer') {
            steps {
                script {
                    echo "Pulling image ${IMAGE_NAME} on Portainer..."
                    httpRequest(
                        url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/images/create?fromImage=${IMAGE_NAME}",
                        httpMode: 'POST',
                        customHeaders: [
                            [name: 'X-API-Key', value: PORTAINER_TOKEN],
                            [name: 'X-Registry-Auth', value: 'eyJyZWdpc3RyeUlkIjoyfQ==']
                        ],
                        validResponseCodes: '200:204'
                    )
                    echo "Image ${IMAGE_NAME} pulled on Portainer successfully."
                }
            }
        }

        stage('Stop and Remove container on Portainer') {
            steps {
                script {
                    echo "Checking if container ${CONTAINER_NAME} exists..."
                    def checkResponse = httpRequest(
                        url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/containers/${CONTAINER_NAME}/json",
                        httpMode: 'GET',
                        customHeaders: [
                            [name: 'X-API-Key', value: PORTAINER_TOKEN]
                        ],
                        validResponseCodes: '200:404'
                    )

                    if (checkResponse.status == 200) {
                        def oldContainerId = new groovy.json.JsonSlurper().parseText(checkResponse.content).Id
                        echo "Removing container ${CONTAINER_NAME}..."
                        httpRequest(
                            url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/containers/${oldContainerId}?force=true",
                            httpMode: 'DELETE',
                            customHeaders: [[name: 'X-API-Key', value: PORTAINER_TOKEN]],
                            validResponseCodes: '200:204'
                        )
                        echo "Container ${CONTAINER_NAME} removed successfully."
                    } else {
                        echo "No existing container ${CONTAINER_NAME} found."
                    }
                }
            }
        }

        stage('Create new container on Portainer') {
            steps {
                script {
                    echo "Creating new container ${CONTAINER_NAME} with image ${IMAGE_NAME}..."
                    def deployConfig = """
                    {
                        "Name": "${CONTAINER_NAME}",
                        "Image": "${IMAGE_NAME}",
                        "ExposedPorts": {
                            "80/tcp": {}
                        },
                        "HostConfig": {
                            "PortBindings": {
                                "80/tcp": [
                                    { "HostPort": "8080", "HostIp": "0.0.0.0" }
                                ]
                            },
                            "RestartPolicy": {
                                "Name": "always"
                            }
                        }
                    }
                    """

                    def createResponse = httpRequest(
                        url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/containers/create?name=${CONTAINER_NAME}",
                        httpMode: 'POST',
                        contentType: 'APPLICATION_JSON',
                        customHeaders: [[name: 'X-API-Key', value: PORTAINER_TOKEN]],
                        requestBody: deployConfig,
                        validResponseCodes: '200:201'
                    )

                    def containerId = new groovy.json.JsonSlurper().parseText(createResponse.content).Id
                    echo "New container ${CONTAINER_NAME} created with ID: ${containerId}."
                    
                    env.containerId = containerId
                }
            }
        }

        stage('Start container on Portainer') {
            steps {
                script {
                    echo "Starting container ${CONTAINER_NAME} with ID: ${env.containerId}..."
                    httpRequest(
                        url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/containers/${env.containerId}/start",
                        httpMode: 'POST',
                        customHeaders: [[name: 'X-API-Key', value: PORTAINER_TOKEN]],
                        validResponseCodes: '200:204'
                    )
                    echo "Container ${CONTAINER_NAME} started successfully."
                }
            }
        }
    }
}
