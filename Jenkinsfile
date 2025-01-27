pipeline {
    agent { label 'prod' }  // Ejecuta en el nodo con la etiqueta 'prod'

    environment {
        // Definir una variable para capturar el payload del evento
        GITHUB_PAYLOAD = ''
    }

    stages {
        stage('Capture Push Event') {
            steps {
                script {
                    // Almacenamos el payload del webhook en una variable
                    GITHUB_PAYLOAD = env.GIT_COMMIT // Aquí el payload podría estar en una variable de entorno
                    // Si se quiere ver el payload completo, se puede imprimir o procesar
                    echo "Evento de Push recibido: ${GITHUB_PAYLOAD}"
                }
            }
        }

        stage('Print Push Event') {
            steps {
                // Imprimir el contenido del evento push
                script {
                    // Convertir el payload a una representación legible si es necesario
                    echo "Contenido del evento Push recibido desde GitHub: ${GITHUB_PAYLOAD}"
                }
            }
        }
    }

    post {
        always {
            // Limpiar cualquier cosa si es necesario
            echo 'Pipeline completado.'
        }
    }
}
