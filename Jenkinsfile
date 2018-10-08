def branchName = "${env.BRANCH_NAME}"

podTemplate(label: 'back', containers: [
    containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl', command: 'cat', ttyEnabled: true)
]) {
		node('back') {

			deleteDir()
			
			try {
				stage ('Clone') {
					checkout scm
          if (branchName == "dev") {
              def dockerSuffix     = "dev"
              def kubectlNamespace = "dev" 
          }
				}
				stage ('Build') {
          sh "echo ${branchName}"
          if (branchName == "dev") {
              sh "echo AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          }
          sh "echo ${dockerSuffix}"
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
