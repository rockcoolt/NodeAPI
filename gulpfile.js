const gulp = require('gulp');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('ts', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['ts']);
  gulp.watch('src/**/*.json', ['json']);
});

gulp.task('json', function() {
  return gulp.src(JSON_FILES)
  .pipe(gulp.dest('dist'));
});

gulp.task('scripts', ['ts', 'json']);

gulp.task('demon', ['watch'] ,function () {
  nodemon({
    script: 'dist/index.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  })
});

gulp.task('default', ['demon']);
