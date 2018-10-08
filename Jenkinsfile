def branchName = "${env.BRANCH_NAME}"
def dockerSuffix
def kubectlNamespace

podTemplate(label: 'back', containers: [
    containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl', command: 'cat', ttyEnabled: true),
    containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true )
]) {
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
					    checkout scm
              sh "ls -la"
              sh "docker build -t back-${dockerSuffix} ."
              // build and run the docker container
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
