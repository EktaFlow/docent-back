def branchName = "${env.BRANCH_NAME}"
def dockerSuffix
def kubectlNamespace

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
          }
          sh "echo ${dockerSuffix}"
				}
				stage ('Build') {
          sh "echo ${branchName}"
          container('docker') {
            withCredentials([string(credentialsId: 'containerRegistry', variable: 'CONTAINER_REGISTRY')]) {
					    checkout scm
              sh '''
              ls -la
              docker build -t back-${dockerSuffix} .
              docker tag back-${dockerSuffix} ${CONTAINER_REGISTRY}/back-${dockerSuffix}:b${env.BUILD_NUMBER}
              '''
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
                sh "kubectl get pods -n app"
                sh "ls -la"
            }
				}
			} catch (err) {
				currentBuild.result = 'FAILED'
				throw err
			}
		}
}
