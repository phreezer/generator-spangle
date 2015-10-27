'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function ( grunt ) {

	// Load grunt tasks automatically
	require( 'load-grunt-tasks' )( grunt );

	// Time how long tasks take. Can help when optimizing build times
	require( 'time-grunt' )( grunt );


	// Configurable paths for the application
	var appConfig = {
		siteURL: 'https://eo-sharepoint.external.lmco.com/sites/WEBSITE',
		siteBackendURL: 'https://eo-sharepoint.external.lmco.com/sites/WEBSITE/',
		server: '//eo-sharepoint.external.lmco.com@SSL/DavWWWRoot/sites/WEBSITE/',
		winserver: '\\\\eo-sharepoint.external.lmco.com@SSL\\DavWWWRoot\\sites\\WEBSITE',		// no trailing backslash
		app: require( './bower.json' ).appPath || 'app',
		dist: 'dist',
		timestamp: new Date().toLocaleString(),
		gitMessage: '',
		driveletter: 'z:'			// drive to map file share to, drive mapping is required for LM EO servers, other servers could use the file share path instead
	};


	appConfig.siteDeploy = appConfig.server + 'prod-deploy';
	appConfig.siteLive = appConfig.server + 'w';
	appConfig.siteArchive = appConfig.server + 'prod-archived';
	appConfig.siteDelete = appConfig.server + 'prod-delete';


	// Define the configuration for all the tasks
	grunt.initConfig( {

		// Project settings
		yeoman: appConfig,


		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: [ 'bower.json' ],
				tasks: [ 'wiredep' ]
			},
			js: {
				files: [ '<%%= yeoman.app %>/scripts/**/*.js' ],
				tasks: [ 'useminPrepare', 'concat', 'copy:js', 'preprocess:dev' ], //'newer:jshint:all'
				options: {
					livereload: '<%%= connect.options.livereload %>',
					event: ['all']
				}
			},
			html: {
				files: [ '<%%= yeoman.app %>/scripts/**/*.html' ],
				tasks: [ 'copy:html', 'preprocess:dev' ],
				options: {
					event: ['all']
				}
			},
			jsTest: {
				files: [ 'test/spec/{,*/}*.js' ],
				tasks: [ 'newer:jshint:test', 'karma' ]
			},
			sass: {
				files: [ '<%%= yeoman.app %>/styles/{,*/}*.{scss,sass}', '<%%= yeoman.app %>/scripts/**/*.{scss,sass}' ],
				tasks: [ 'sass', 'autoprefixer' ],
				options: {
					event: ['all']
				}
			},
			gruntfile: {
				files: [ 'Gruntfile.js' ],
				tasks: []
			},
			livereload: {
				options: {
					livereload: '<%%= connect.options.livereload %>'
				},
				files: [
					'<%%= yeoman.app %>/{,*/}*.html',
					'.tmp/styles/{,*/}*.css',
					'<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
					'.tmp/views/**/*.html',
					'<%%= yeoman.app %>/script/**/*.js',
				]
			}
		},


		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					middleware: function ( connect ) {
						return [
							connect.static( '.tmp' ),
							connect().use(
								'/bower_components',
								connect.static( './bower_components' )
							),
							connect.static( appConfig.app )
						];
					}
				}
			},
			test: {
				options: {
					port: 9001,
					middleware: function (connect) {
						return [
							connect.static('.tmp'),
							connect.static('test'),
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect.static(appConfig.app)
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: '<%%= yeoman.dist %>'
				}
			}
		},


		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require( 'jshint-stylish-ex' )
			},
			all: {
				src: [
					'Gruntfile.js',
					'<%%= yeoman.app %>/scripts/**/*.js',
					'!<%%= yeoman.app %>/scripts/**/ie.js', // Ignore other people's Polyfills
					'!<%%= yeoman.app %>/scripts/lib/*.js' // Ignore other people's libraries
				]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: [ 'test/spec/{,*/}*.js' ]
			}
		},


		// Empties folders to start fresh
		clean: {
			dist: {
				files: [ {
					dot: true,
					src: [
						'.tmp',
						'<%%= yeoman.dist %>/{,*/}*',
						'!<%%= yeoman.dist %>/.git*'
					]
				} ]
			},
			deploy: {
				options: {
					force: true,
					'no-write': true
				},
				files: [ {
					dot: true,
					expand: true,
					cwd: '<%%= yeoman.siteDeploy %>/',
					src: [
						'fonts/{,*/}*',
						'json/{,*/}*',
						'scripts/{,*/}*',
						'styles/{,*/}*',
						'bower_components/{,*/}*',
						'views/{,*/}*'
						//'<%%= yeoman.siteDeploy %>/{,*/}*',	// Delete all
						//'!<%%= yeoman.siteDeploy %>/.git*'		// Leave Git alone
					]
				} ]
			},
			'site-delete': {
				options: {
					force: true,
					'no-write': true
				},
				files: [ {
					dot: true,
					expand: true,
					cwd: '<%%= yeoman.siteDelete %>/',
					src: [
						'{,*/}*'	// Delete all
					]
				} ]
			},
			server: '.tmp'
		},


		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: [ 'last 1 version' ]
			},
			dist: {
				files: [ {
					expand: true,
					cwd: '.tmp/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/styles/'
				} ]
			}
		},


		// Automatically inject Bower components into the app
		wiredep: {
			options: {
				//cwd: '<%%= yeoman.app %>'
			},
			test: {
				devDependencies: true,
				src: '<%%= karma.unit.configFile %>',
				ignorePath:  /\.\.\//,
				fileTypes:{
					js: {
						block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
						detect: {
							js: /'(.*\.js)'/gi
						},
						replace: {
							js: '\'{{filePath}}\','
						}
					}
				}
			},
			app: {
				src: [ '<%%= yeoman.app %>/index.html' ],
				ignorePath: /\.\.\//
			},
			sass: {
				src: [ '<%%= yeoman.app %>/styles/{,*/}*.{scss,sass}', '<%%= yeoman.app %>/scripts/**/*.{scss,sass}' ],
				ignorePath: /(\.\.\/){1,2}bower_components\//
			}
		},


		sass: {
			options: {
				sourceMap: true,
				sourceMapContents: true,
				sourceMapEmbed: true
			},
			dist: {
				files: {
					'.tmp/styles/main.css': '<%%= yeoman.app %>/styles/main.scss'
				}
			}
		},


		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: '<%%= yeoman.app %>/styles',
				cssDir: '.tmp/styles',
				generatedImagesDir: '.tmp/images/generated',
				imagesDir: '<%%= yeoman.app %>/images',
				javascriptsDir: '<%%= yeoman.app %>/scripts',
				fontsDir: '<%%= yeoman.app %>/styles/fonts',
				importPath: './bower_components',
				httpImagesPath: '/images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '/styles/fonts',
				relativeAssets: false,
				assetCacheBuster: false,
				raw: 'Sass::Script::Number.precision = 10\n'
			},
			dist: {
				options: {
					generatedImagesDir: '<%%= yeoman.dist %>/images/generated'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},


		purifycss: {
			options: {},
			main: {
				src: ['<%%= yeoman.dist %>/**/*.html', '<%%= yeoman.dist %>/scripts/*.js'],
				css: ['<%%= yeoman.dist %>/styles/main.css'],
				dest: '<%%= yeoman.dist %>/styles/main.css'
			},
			vendor: {
				src: ['<%%= yeoman.dist %>/**/*.html', '<%%= yeoman.dist %>/scripts/*.js'],
				css: ['<%%= yeoman.dist %>/styles/vendor.css'],
				dest: '<%%= yeoman.dist %>/styles/vendor.css'
			}
		},


		// Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
					'<%%= yeoman.dist %>/scripts/{,*/}*.js',
					'<%%= yeoman.dist %>/styles/{,*/}*.css',
					//'<%%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
					'<%%= yeoman.dist %>/styles/fonts/*',
					'!<%%= yeoman.dist %>/styles/sprites/*.css'		// ignore Grunticon sprites
				]
			}
		},


		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%%= yeoman.app %>/index.html',
			options: {
				dest: '<%%= yeoman.dist %>',
				flow: {
					html: {
						steps: {
							js: [ 'concat', 'uglifyjs' ],
							css: [ 'cssmin' ]
						},
						post: {}
					}
				}
			}
		},


		// Performs rewrites based on filerev and the useminPrepare configuration
		usemin: {
			html: [ '<%%= yeoman.dist %>/{,*/}*.html' ],
			css: [ '<%%= yeoman.dist %>/styles/{,*/}*.css' ],
			options: {
				assetsDirs: [ '<%%= yeoman.dist %>', '<%%= yeoman.dist %>/images' ]
			}
		},


		// The following *-min tasks will produce minified files in the dist folder
		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
		// cssmin: {
		//   dist: {
		//     files: {
		//       '<%%= yeoman.dist %>/styles/main.css': [
		//         '.tmp/styles/{,*/}*.css'
		//       ]
		//     }
		//   }
		// },
		// uglify: {
		//   dist: {
		//     files: {
		//       '<%%= yeoman.dist %>/scripts/scripts.js': [
		//         '<%%= yeoman.dist %>/scripts/scripts.js'
		//       ]
		//     }
		//   }
		// },
		// concat: {
		//   dist: {}
		// },
		uglify: {
			dist: {
				files: {
					'<%%= yeoman.dist %>/scripts/ie.js': [ '<%%= yeoman.dist %>/scripts/ie.js' ]
				}
			}
		},


		'json-minify': {
			build: {
				files: '/json/*.json'
			}
		},


		concat: {
			dist: {
				src: '<%%= yeoman.app %>/scripts/**/ie.js',
				dest: '<%%= yeoman.dist %>/scripts/ie.js'
			}
		},


		imagemin: {
			dist: {
				files: [ {
					expand: true,
					cwd: '<%%= yeoman.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%%= yeoman.dist %>/images'
				} ]
			}
		},


		grunticon: {
			'app-icons': {
				files: [ {
					expand: true,
					cwd: '<%%= yeoman.app %>/images/sprite-icons', // use the compressed images
					src: [ '*.{png,svg}' ],
					dest: '<%%= yeoman.app %>'
				} ],
				options: {
					cssprefix: '.icon-',
					datasvgcss: 'styles/sprites/icons-svg.css',
					datapngcss: 'styles/sprites/icons-png.css',
					urlpngcss: 'styles/sprites/icons-fallback.css',
					pngpath: '../../images/sprite-icons/png',
					pngfolder: 'images/sprite-icons/png/',
					loadersnippet: 'scripts/lib/grunticon.js',
					previewhtml: 'preview.html'
				}
			},
			'dist-icons': {
				files: [ {
					expand: true,
					cwd: '<%%= yeoman.dist %>/images/sprite-icons', // use the compressed images
					src: [ '*.{png,svg}' ],
					dest: '<%%= yeoman.dist %>'
				} ],
				options: {
					cssprefix: '.icon-',
					datasvgcss: 'styles/sprites/icons-svg.css',
					datapngcss: 'styles/sprites/icons-png.css',
					urlpngcss: 'styles/sprites/icons-fallback.css',
					pngpath: '../images/sprite-icons/png',
					pngfolder: '../dist/images/sprite-icons/png/',
					loadersnippet: '../<%%= yeoman.app %>/scripts/lib/grunticon.js',
					previewhtml: 'preview.html'
				}
			},
			'app-images': {
				files: [ {
					expand: true,
					cwd: '<%%= yeoman.app %>/images/sprite-images', // use the compressed images
					src: [ '*.{png,svg}' ],
					dest: '<%%= yeoman.app %>'
				} ],
				options: {
					cssprefix: '.image-',
					datasvgcss: 'styles/sprites/images-svg.css',
					datapngcss: 'styles/sprites/images-png.css',
					urlpngcss: 'styles/sprites/images-fallback.css',
					pngpath: '../../images/sprite-images/png',
					pngfolder: 'images/sprite-images/png/',
					loadersnippet: 'scripts/lib/grunticon.js',
					previewhtml: 'preview.html'
				}
			},
			'dist-images': {
				files: [ {
					expand: true,
					cwd: '<%%= yeoman.dist %>/images/sprite-images', // use the compressed images
					src: [ '*.{png,svg}' ],
					dest: '<%%= yeoman.dist %>'
				} ],
				options: {
					cssprefix: '.image-',
					datasvgcss: 'styles/sprites/images-svg.css',
					datapngcss: 'styles/sprites/images-png.css',
					urlpngcss: 'styles/sprites/images-fallback.css',
					pngpath: '../images/sprite-images/png',
					pngfolder: 'images/sprite-images/png/',
					loadersnippet: '../<%%= yeoman.app %>/scripts/lib/grunticon.js',
					previewhtml: 'preview.html'
				}
			}
		},


		svgmin: {
			dist: {
				files: [ {
					expand: true,
					cwd: '<%%= yeoman.app %>/images',
					src: '{,*/}*.svg',
					dest: '<%%= yeoman.dist %>/images'
				} ]
			}
		},


		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [ {
					expand: true,
					cwd: '<%%= yeoman.dist %>',
					src: [ '*.html', 'views/{,*/}*.html', '!style-guide.html' ],
					dest: '<%%= yeoman.dist %>'
				} ]
			}
		},


		// ng-annotate tries to make the code safe for minification automatically
		// by using the Angular long form for dependency injection.
		ngAnnotate: {
			dist: {
				files: [ {
					expand: true,
					cwd: '.tmp/concat/scripts',
					src: [ '*.js', '!oldieshim.js' ],
					dest: '.tmp/concat/scripts'
				} ]
			}
		},


		// Replace Google CDN references
		cdnify: {
			dist: {
				html: [ '<%%= yeoman.dist %>/*.html' ]
			}
		},


		// Copies remaining files to places other tasks can use
		copy: {
			'deploytoLive': {
				expand: true,
				cwd: '<%%= yeoman.siteDeploy %>',
				src: '**/*.*',
				dest: '<%%= yeoman.siteLive %>'
			},
			deploy: {
				expand: true,
				cwd: '<%%= yeoman.dist %>',
				src: ['**/*.*', '!json/*.*'],			// SharePoint on LMI blocks JSON files
				dest: '<%%= yeoman.siteDeploy %>'
			},
			fastdeploy: {
				files: [ {
					expand: true,
					dot: true,
					cwd: '<%%= yeoman.dist %>',
					dest: '<%%= yeoman.siteDeploy %>',
					src: [
						'*.html',
						'views/**/*.html',
						'scripts/{,*/}*.js',
						'styles/{,*/}*.css'
					]
				} ]
			},
			dist: {
				files: [ {
					expand: true,
					dot: true,
					cwd: '<%%= yeoman.app %>',
					dest: '<%%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'views/{,*/}*.html',
						'images/{,*/}*.{webp}',
						'fonts/*',
						'json/{,*/}*.{json,xml}'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%%= yeoman.dist %>/images',
					src: [ 'generated/*' ]
				}, {
					expand: true,
					cwd: '.',
					src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
					dest: '<%%= yeoman.dist %>'
				}, { // Move HTML files to [dist]/views folder
					expand: true,
					dot: true,
					cwd: '<%%= yeoman.app %>/scripts',
					dest: '<%%= yeoman.dist %>/views/',
					src: [
						'**/*.html'
					]
				} ]
			},
			sprites: {
				expand: true,
				cwd: '<%%= yeoman.app %>/styles/sprites',
				dest: '<%%= yeoman.dist %>/styles/sprites',
				src: '{,*/}*.css'
			},
			html: { // Move HTML files to [app]/views folder for grunt serve
				expand: true,
				dot: true,
				cwd: '<%%= yeoman.app %>/scripts',
				dest: '.tmp/views/',
				src: [
					'**/*.html'
				]
			},
			js: { // Move HTML files to [app]/views folder for grunt serve
				expand: true,
				dot: true,
				cwd: '<%%= yeoman.app %>/scripts',
				dest: '.tmp/scripts/',
				src: [
					'**/*.js'
				]
			},
			aspx: { // create default.aspx from index.html
				src: '<%%= yeoman.dist %>/index.html',
				dest: '<%%= yeoman.dist %>/default.aspx'
			}
		},


		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'sass'
				//'compass:server'
			],
			test: [
				'sass'
				//'compass'
			],
			dist: [
				'imagemin',
				'svgmin'
			]
		},


		// Remove all console.log's from app directory
		removelogging: {
			dist: {
				src: [ '<%%= yeoman.app %>/scripts/**/*.js', '!<%%= yeoman.app %>/scripts/**/console-log.js' ] // Each file will be overwritten with the output!
			}
		},


		preprocess: {
			options: {
				inline: true,
				context: {
					DEBUG: true
				}
			},
			'prod': {
				options: {
					inline: true,
					context: {
						DEBUG: false,
						PROD: true
					}
				},
				src: [
					'<%%= yeoman.dist %>/index.html',
					'<%%= yeoman.dist %>/views/**/*.html',
					'.tmp/concat/scripts/**/*.js'
				]
			},
			'dev': {
				options: {
					inline: true,
					context: {
						DEBUG: true,
						PROD: false
					}
				},
				src: [
					'.tmp/views/**/*.html',
					'.tmp/scripts/**/*.js'
				]
			}
		},


		shell: {
			options: {
				stderr: false,
				failOnError: false
			},
			'archiveToDelete': {
				command: 'rename <%%= yeoman.driveletter %>\\<%%= yeoman.folderArchive %> <%%= yeoman.folderDelete %>'
			},
			'liveToArchive': {
				command: 'rename <%%= yeoman.driveletter %>\\<%%= yeoman.folderLive %> <%%= yeoman.folderArchive %>'
			},
			'deployToLive': {
				command: 'rename <%%= yeoman.driveletter %>\\<%%= yeoman.folderDeploy %> <%%= yeoman.folderLive %>'
			},
			'liveToDelete': {
				command: 'rename <%%= yeoman.driveletter %>\\<%%= yeoman.folderLive %> <%%= yeoman.folderDelete %>'
			},
			'archiveToLive': {
				command: 'rename <%%= yeoman.driveletter %>\\<%%= yeoman.folderArchive %> <%%= yeoman.folderLive %>'
			},
			'site-delete': {
				command: 'rd /S /Q <%%= yeoman.driveletter %>\\<%%= yeoman.folderDelete %>'
			},
			'ie-frontend' : {
				command: '"%PROGRAMFILES%\\Internet Explorer\\IExplore" "<%%= yeoman.siteURL %>"'
			},
			'chrome-frontend' : {
				command: '"%PROGRAMFILES(x86)%\\Google\\Chrome\\Application\\chrome.exe" "<%%= yeoman.siteURL %>"'
			},
			'firefox-frontend' : {
				command: '"%PROGRAMFILES(x86)%\\Mozilla Firefox\\firefox.exe" "<%%= yeoman.siteURL %>"'
			},
			'ie-backend' : {
				command: '"%PROGRAMFILES%\\Internet Explorer\\IExplore" "<%%= yeoman.siteBackendURL %>"'
			},
			'chrome-backend' : {
				command: '"%PROGRAMFILES(x86)%\\Google\\Chrome\\Application\\chrome.exe" "<%%= yeoman.siteBackendURL %>"'
			},
			'firefox-backend' : {
				command: '"%PROGRAMFILES(x86)%\\Mozilla Firefox\\firefox.exe" "<%%= yeoman.siteBackendURL %>"'
			},
			'server-share' : {
				command: 'explorer "<%%= yeoman.winserver %>"'
			},
			'map' : {
				command: 'net use <%%= yeoman.driveletter %> "<%%= yeoman.winserver %>"'
			},
			'unmap' : {
				command: 'net use <%%= yeoman.driveletter %> /d'
			}
		},


		// Generate Documentation
		ngdocs: {
			all: ['<%%= yeoman.app %>/scripts/**/*.js']
		},


		// Test settings
		karma: {
			unit: {
				configFile: 'test/karma.conf.js',
				singleRun: true
			}
		},


		gitadd: {
			task: {
				options: {
					all: true
				}
			}
		},

		gitcommit: {
			local: {
				options: {
					message: '<%%= yeoman.gitMessage %>'
				}
			}
		}

	} );


	grunt.loadNpmTasks( 'grunt-ngdocs' );
	grunt.loadNpmTasks( 'grunt-remove-logging' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-preprocess' );
	grunt.loadNpmTasks( 'grunt-json-minify' );
	grunt.loadNpmTasks( 'grunt-grunticon' );
	grunt.loadNpmTasks( 'grunt-purifycss' );
	grunt.loadNpmTasks( 'grunt-git' );
	grunt.loadNpmTasks( 'grunt-karma' );


	grunt.registerTask( 'serve', 'Compile then start a connect web server', function ( target ) {
		if ( target === 'dist' ) {
			return grunt.task.run( [ 'build', 'connect:dist:keepalive' ] );
		}

		grunt.task.run( [
			'clean:server',
			'grunticon:app-icons',
			'grunticon:app-images',
			'wiredep',
			'concurrent:server',
			'autoprefixer',
			'copy:html',
			'copy:js',
			'preprocess:dev',
			'connect:livereload',
			'watch'
		] );
	} );


	grunt.registerTask( 'server', 'DEPRECATED TASK. Use the "serve" task instead', function ( target ) {
		grunt.log.warn( 'The `server` task has been deprecated. Use `grunt serve` to start a server.' );
		grunt.task.run( [ 'serve:' + target ] );
	} );


	grunt.registerTask( 'test', [
		'clean:server',
		'wiredep',
		'concurrent:test',
		'autoprefixer',
		'connect:test',
		'karma'
	] );


	grunt.registerTask( 'docs', [
		'ngdocs'
	] );


	grunt.registerTask( 'logs', [
		'removelogging'
	] );


	grunt.registerTask( 'map', 'Map Z: drive to SharePoint', function ( target ) {

		grunt.task.run( [
			'shell:unmap',
			'shell:map'
		] );
	} );


	grunt.registerTask( 'build', [
		'clean:dist',
		'wiredep',
		'useminPrepare',
		'concurrent:dist',
		'grunticon:dist-icons',
		'grunticon:dist-images',
		'sass',
		//'compass:dist',
		'autoprefixer',
		'concat',
		'preprocess:prod',
		'ngAnnotate',
		'copy:dist',
		//'cdnify',
		'cssmin',
		'uglify',
		'json-minify',
		//'purifycss:main',
		//'purifycss:vendor',
		'filerev',
		'usemin',
		'htmlmin',
		'copy:sprites',
		'copy:aspx'
	] );


	grunt.registerTask( 'rollback', 'Upload to SharePoint', function ( target ) {
		appConfig.siteDeploy = appConfig.driveletter + '\\prod-deploy';
		appConfig.siteLive = appConfig.driveletter + '\\w';
		appConfig.siteArchive = appConfig.driveletter + '\\prod-archived';
		appConfig.siteDelete = appConfig.driveletter + '\\prod-delete';

		grunt.task.run( [
			'shell:unmap',
			'shell:map',
			'clean:site-delete',
			'shell:site-delete',
			'shell:liveToDelete',
			'shell:archiveToLive',
			'clean:site-delete',
			'shell:site-delete'
		] );
	} );


	grunt.registerTask( 'deploy', 'Upload to SharePoint', function ( target ) {
		appConfig.folderDeploy = 'prod-deploy';
		appConfig.folderLive = 'w';
		appConfig.folderArchive = 'prod-archived';
		appConfig.folderDelete = 'prod-delete';

		appConfig.siteDeploy = appConfig.driveletter + '\\prod-deploy';
		appConfig.siteLive = appConfig.driveletter + '\\w';
		appConfig.siteArchive = appConfig.driveletter + '\\prod-archived';
		appConfig.siteDelete = appConfig.driveletter + '\\prod-delete';
		appConfig.gitMessage = 'Deployed Prod ' + appConfig.timestamp;

		grunt.task.run( [
			'shell:unmap',
			'shell:map',
			//'removelogging',
			'gitadd:task',
			'gitcommit:local',
			'clean:site-delete',
			'shell:site-delete',
			'clean:deploy',
			'copy:deploy',
			'shell:archiveToDelete',
			'shell:liveToArchive',
			'shell:deployToLive',
			'clean:site-delete',
			'shell:site-delete'
		] );
	} );


	grunt.registerTask( 'deploy-prod', 'Upload to SharePoint', function ( target ) {
		appConfig.folderDeploy = 'prod-deploy';
		appConfig.folderLive = 'w';
		appConfig.folderArchive = 'prod-archived';
		appConfig.folderDelete = 'prod-delete';

		appConfig.siteDeploy = appConfig.driveletter + '\\prod-deploy';
		appConfig.siteLive = appConfig.driveletter + '\\w';
		appConfig.siteArchive = appConfig.driveletter + '\\prod-archived';
		appConfig.siteDelete = appConfig.driveletter + '\\prod-delete';
		appConfig.gitMessage = 'Deployed Prod ' + appConfig.timestamp;

		grunt.task.run( [
			'shell:unmap',
			'shell:map',
			//'removelogging',				// This needs work, removing logs here only affects the next build not this one
			'gitadd:task',
			'gitcommit:local',
			'clean:site-delete',
			'shell:site-delete',
			'clean:deploy',
			'copy:deploy',
			'shell:archiveToDelete',
			'shell:liveToArchive',
			'shell:deployToLive',
			'clean:site-delete',
			'shell:site-delete'
		] );
	} );


	grunt.registerTask( 'deploy-dev', 'Upload to SharePoint', function ( target ) {
		appConfig.folderDeploy = 'dev-deploy';
		appConfig.folderLive = 'dev';
		appConfig.folderArchive = 'dev-archived';
		appConfig.folderDelete = 'dev-delete';

		appConfig.siteDeploy = appConfig.driveletter + '\\dev-deploy/';
		appConfig.siteLive = appConfig.driveletter + '\\dev/';
		appConfig.siteArchive = appConfig.driveletter + '\\dev-archived/';
		appConfig.siteDelete = appConfig.driveletter + '\\dev-delete/';
		appConfig.gitMessage = 'Deployed Dev ' + appConfig.timestamp;

		grunt.task.run( [
			'shell:unmap',
			'shell:map',
			'gitadd:task',
			'gitcommit:local',
			'clean:site-delete',
			'shell:site-delete',
			'clean:deploy',
			'copy:deploy',
			'shell:archiveToDelete',
			'shell:liveToArchive',
			'shell:deployToLive',
			'clean:site-delete',
			'shell:site-delete'
		] );
	} );


	grunt.registerTask( 'frontend', [
		'shell:ie-frontend',
		'shell:firefox-frontend',
		'shell:chrome-frontend'
	] );


	grunt.registerTask( 'backend', [
		'shell:ie-backend',
		'shell:firefox-backend',
		'shell:chrome-backend'
	] );


	grunt.registerTask( 'share', [
		'shell:server-share'
	] );


	grunt.registerTask( 'git', 'Git Commit', function ( target ) {
		appConfig.gitMessage = 'Updated ' + appConfig.timestamp;

		grunt.task.run( [
			'gitadd:task',
			'gitcommit:local'
		]);
	});


	grunt.registerTask( 'default', [
		'newer:jshint',
		'test',
		'build'
	] );
};
