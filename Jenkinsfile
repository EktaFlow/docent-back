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
          sh "echo $GIT_BRANCH"
					sh "echo 'here we build some stuff!!!'"
					sh "echo 'this is a test'"
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
