// Définition des dépendances dont on à besoin pour exécuter les tâches 
var 
    gulp = require( 'gulp' ),
    imagemin = require( 'gulp-imagemin' ),
    newer = require( 'gulp-newer' ),
    size = require( 'gulp-size' ),
    del = require( 'del' ),
    destclean = require( 'gulp-dest-clean' ),
    imacss = require( 'gulp-imacss' ),
    sass = require( 'gulp-sass' );


// Définition de quelques varaibles générales pour notre gulpfile
var
    source = 'source/',
    dest = 'build/';

// Définition de quelques variables liées à nos tâches ( otpions de tâches )
var 
    imageOpts = {
        in: source + 'images/*.*', //Je vais chercher les images la. * = joker qui represente une chaine caract, un morceau de chaine suivi d'un point suivi d'un morceau de chaine (nom de fichier ).
        out: dest + 'images/', //Je dépose les images la
        watch: source + 'images/*.*'
    },
    imageUriOpts = {
        in: source + 'images/inline/*.*',
        out: source + 'scss/images/',
        filename: '_datauri.scss',
        namespace: 'img'
    },
    css = {
        in: source + 'scss/main.scss',
        watch: [source + 'scss/**/*'],
        out: dest + 'css/',
        sassOpts: {
            outputStyle: 'nested',
            precision: 3,
            errLogToConsole: true
        }
    };

// Défintion des tâches

gulp.task('clean', function(){
    del([dest + '*']);
});

gulp.task('images', function(){
    return gulp.src(imageOpts.in)
        .pipe(destclean(imageOpts.out))
        .pipe(newer(imageOpts.out))
        .pipe(size({title: 'Images size before compression: ', showFiles: true}))
        .pipe(imagemin())
        .pipe(size({title: 'Images size after compression: ', showFiles: true}))
        .pipe(gulp.dest(imageOpts.out));

});

gulp.task('imageuri', function(){
    return gulp.src(imageUriOpts.in)
        .pipe(imagemin())
        .pipe(imacss(imageUriOpts.filename, imageUriOpts.namespace))
        .pipe(gulp.dest(imageUriOpts.out));
});

gulp.task('sass', function(){
    return gulp.src(css.in)
        .pipe(sass(css.sassOpts))
        .pipe(gulp.dest(css.out));
})
//Tâche par défault qui sera exécutée lorsque l'on tape gulp dans le terminal
gulp.task('default', ['images'], function(){
    gulp.watch(imageOpts.watch, ['images']);
});



















