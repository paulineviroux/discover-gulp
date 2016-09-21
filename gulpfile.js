// Définition des dépendances dont on à besoin pour exécuter les tâches 
var 
    gulp = require( 'gulp' ),
    imagemin = require( 'gulp-imagemin' ),
    newer = require( 'gulp-newer' ),
    size = require( 'gulp-size' ),
    del = require( 'del' ),
    destclean = require( 'gulp-dest-clean' ),
    imacss = require( 'gulp-imacss' ),
    sass = require( 'gulp-sass' ),
    preprocess = require( 'gulp-preprocess' ),
    pkg = require( './package.json' ),
    htmlclean = require( 'gulp-htmlclean' ),
    browsersync = require( 'browser-sync');


// Définition de quelques varaibles générales pour notre gulpfile
var
    devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'), //true = mode development! Savoir si oui on non on est en production
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
    },
    html = {
        in: source + '*.html',
        watch: [source + '*.html', source + 'template/**/*'],
        out: dest,
        context: {
            devBuild: devBuild,
            author: pkg.author,
            version: pkg.version
        }
    },
    syncOpts = {
        server: {
            baseDir: dest,
            index: 'index.html'
        },
        open: false,
        notify: true
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
        .pipe(gulp.dest(css.out))
        .pipe(browsersync.reload({stream: true}));
});

gulp.task('html', function(){
    var page = gulp.src(html.in).pipe(preprocess({context: html.context}));
    if (!devBuild) {

        page = page
            .pipe(size({title: 'HTML avant minification:'}))
            .pipe(htmlclean())
            .pipe(size({title: 'HTML après minification:'}))
    };
    return page.pipe(gulp.dest(html.out));

});

gulp.task('browsersync', function(){
    browsersync(syncOpts);
})
//Tâche par défault qui sera exécutée lorsque l'on tape gulp dans le terminal
gulp.task('default', ['images', 'sass', 'html', 'browsersync'], function(){
    gulp.watch(html.watch, ['html', browsersync.reload]);
    gulp.watch(imageOpts.watch, ['images']);
    gulp.watch(css.watch, ['sass']);

});



















