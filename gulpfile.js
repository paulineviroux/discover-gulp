// Définition des dépendances dont on à besoin pour exécuter les tâches 
var 
    gulp = require( 'gulp' );
    imagemin = require( 'gulp-imagemin' );

// Définition de quelques varaibles générales pour notre gulpfile
var
    source = 'source/',
    dest = 'build/';

// Définition de quelques variables liées à nos tâches ( otpions de tâches )
var 
    imageOpts = {

    };

// Défintion des tâches
gulp.task('images', function(){
    console.log('Je suis dans la tâche image.');

});

//Tâche par défault qui sera exécutée lorsque l'on tape gulp dans le terminal
gulp.task('default', function(){
    gulp.src()
});