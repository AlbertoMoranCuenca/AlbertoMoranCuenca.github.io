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
                        echo "${DOCKERHUB_PSW}" | docker login -u "${DOCKERHUB_USR}" --password-stdin
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

        stage('Deploy on Portainer') {
            steps {
                script {
                    httpRequest(
                        url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/images/create?fromImage=${IMAGE_NAME}",
                        httpMode: 'POST',
                        customHeaders: [[name: 'X-API-Key', value: PORTAINER_TOKEN]],
                        validResponseCodes: '200:204'
                    )

                    
                    def checkResponse = httpRequest(
                        url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/containers/${CONTAINER_NAME}/json",
                        httpMode: 'GET',
                        customHeaders: [[name: 'X-API-Key', value: PORTAINER_TOKEN]],
                        validResponseCodes: '200:404'
                    )
                    
                    if (checkResponse.status == 200) {
                        def oldContainerId = new groovy.json.JsonSlurper().parseText(checkResponse.content).Id

                    
                        echo "Removing container ${CONTAINER_NAME}..."
                        httpRequest(
                            url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/containers/${oldContainerId}?force==true",
                            httpMode: 'DELETE',
                            customHeaders: [[name: 'X-API-Key', value: PORTAINER_TOKEN]],
                            validResponseCodes: '200:204'
                        )
                    }

                    
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
                    
                    echo "Container ID: ${containerId}"

                    
                    httpRequest(
                        url: "${PORTAINER_SERVER_URL}/endpoints/${ENVIRONMENT_ID}/docker/containers/${containerId}/start",
                        httpMode: 'POST',
                        customHeaders: [[name: 'X-API-Key', value: PORTAINER_TOKEN]],
                        validResponseCodes: '200:204'
                    )
                }
            }
        }
    }
}
