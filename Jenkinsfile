node {

  deleteDir()
  
  try {
    stage ('Clone') {
      checkout scm
    }
    stage ('Build') {
      sh "echo 'here we build some stuff!!!'"
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
    }
  } catch (err) {
    currentBuild.result = 'FAILED'
    throw err
  }
}
