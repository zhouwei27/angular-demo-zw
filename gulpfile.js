var gulp = require('gulp');
var $ = require('gulp-load-plugins')();//自动加载package.json文件里的gulp插件,gulp-load-plugins并不会一开始就加载所有package.json里的gulp插件，而是在我们需要用到某个插件的时候，才去加载那个插件
var open = require('open');

var app = {
    srcPath: 'src/',
    devPath: 'build/',
    prdPath: 'dist/'
};

gulp.task('lib',function(){
    gulp.src('bower_components/**/*.js')
    .pipe($.plumber()) //防止抛出错误后程序异常关闭  设置后只会提示错误信息不会关闭程序
    .pipe(gulp.dest(app.devPath + 'vendor'))
    .pipe(gulp.dest(app.prdPath + 'vendor'))
    .pipe($.connect.reload());//实现网页自动刷新加载
});

gulp.task('html',function(){
    gulp.src(app.srcPath + '**/*.html')
    .pipe($.plumber())
    .pipe(gulp.dest(app.devPath))
    .pipe(gulp.dest(app.prdPath))
    .pipe($.connect.reload());
})

gulp.task('json',function(){
    gulp.src(app.srcPath + 'data/**/*.json')
    .pipe($.plumber())
    .pipe(gulp.dest(app.devPath + 'data'))
    .pipe(gulp.dest(app.prdPath + 'data'))
    .pipe($.connect.reload());
});

gulp.task('less',function(){
    gulp.src(app.srcPath + 'style/index.less')
    .pipe($.plumber())
    .pipe($.less())
    .pipe(gulp.dest(app.devPath + 'css'))
    .pipe($.cssmin())  //压缩
    .pipe(gulp.dest(app.prdPath + 'css'))
    .pipe($.connect.reload());
});

gulp.task('js',function(){
    gulp.src(app.srcPath + 'script/**/*.js')
    .pipe($.plumber())
    .pipe($.concat('index.js'))
    .pipe(gulp.dest(app.devPath + 'js'))
    .pipe($.uglify())  //压缩
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe($.connect.reload());
});

gulp.task('image',function(){
    gulp.src(app.srcPath + 'image/**/*')
    .pipe($.plumber())
    .pipe(gulp.dest(app.devPath + 'image'))
    .pipe($.imagemin())  //压缩
    .pipe(gulp.dest(app.prdPath + 'image'))
    .pipe($.connect.reload());
});

gulp.task('build',['image','js','less','lib','html','json']);

gulp.task('clean',function(){
    gulp.src([app.devPath,app.prdPath])
    .pipe($.clean());
});

gulp.task('serve',['build'],function(){
    $.connect.server({
        root: [app.devPath],
        livereload: true,
        port: 1234
    });

    open('http://localhost:1234');

    gulp.watch('bower_components/**/*',['lib']);
    gulp.watch(app.srcPath + '**/*.html',['html']);
    gulp.watch(app.srcPath + 'data/**/*.json',['json']);
    gulp.watch(app.srcPath + 'style/**/*.less',['less']);
    gulp.watch(app.srcPath + 'script/**/*.js',['js']);
    gulp.watch(app.srcPath + 'image/**/*',['image']);
});

gulp.task('default',['serve']);

