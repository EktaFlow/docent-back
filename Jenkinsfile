/*
*
* The purpose of this file is to define a pipeline that can take a dev branch and 
* build the latest push to the dev branch and deploy to the dev deployment
*
*/


def branchName = "${env.BRANCH_NAME}"
def dockerSuffix
def kubectlNamespace
def containerImagePath
def serviceName
def deploymentName
def imageName

podTemplate(label: 'back', 
    containers: [
        containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true )
    ],
    volumes: [ 
        hostPathVolume(mountPath: '/var/run/docker.sock', 
                       hostPath: '/var/run/docker.sock')
    ]
){
		node('back') {

			deleteDir()
			
			try {
				stage ('setup') {
          if (branchName == "dev") {
              dockerSuffix     = "dev"
              kubectlNamespace = "dev" 
              imageName        = "back-${dockerSuffix}:b${env.BUILD_NUMBER}"
          }
          sh "echo ${dockerSuffix}"
				}
				stage ('Build') {
          sh "echo ${branchName}"
          container('docker') {
            withCredentials([
                string(credentialsId: 'containerRegistry', variable: 'CONTAINER_REGISTRY'),
                usernamePassword(credentialsId: 'containerRegistryCreds', passwordVariable: 'password', usernameVariable: 'user')
            ]){
              sh "echo ${branchName}"
					    checkout scm
              sh "docker build -t ${imageName} ."
              containerImagePath = "${CONTAINER_REGISTRY}/${imageName}"
              sh "docker tag ${imageName} ${containerImagePath}"
              sh "docker login ${CONTAINER_REGISTRY} -u ${user} -p ${password}"
              sh "docker push ${containerImagePath}"
              // build and run the docker container
            }
          }
				}
				stage ('Test') {
					parallel 'integration': {
						sh "echo 'running integration tests'"
					},
					'static': {
						sh "echo 'running static checking'"
					}
				}
				stage ('Deploy') {
					sh "echo 'deploy!!'"
            container('kubectl') {
                sh "kubectl set image deployment/dev -n ${kubectlNamespace} devback=${containerImagePath}"

                // sh "kubectl get pods -n app"
                //sh "ls -la"
            }
				}
			} catch (err) {
				currentBuild.result = 'FAILED'
				throw err
			}
		}
}
