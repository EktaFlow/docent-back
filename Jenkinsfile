def branchName = "${env.BRANCH_NAME}"

podTemplate(label: 'back', containers: [
    containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl', command: 'cat', ttyEnabled: true)
]) {
		node('back') {

			deleteDir()
			
			try {
				stage ('Clone') {
					checkout scm
				}
				stage ('Build') {
          sh "echo ${branchName}"
          if (branchName == "dev") {
              sh "echo AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          }
          sh "ls -la"
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
            }
				}
			} catch (err) {
				currentBuild.result = 'FAILED'
				throw err
			}
		}
}
