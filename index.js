const babel = require('babel-core');
const webpack = require('webpack');
const options = require('./qit.json');
const fs = require('fs');
const path = require('path');
const md = require("node-markdown").Markdown;
const Handlebars = require("handlebars");
const yamlFront = require('yaml-front-matter');
const sass = require('node-sass');
const http = require('http');
const fontBuilder = require('iconfont-builder');
const watch = require('node-watch');
const livereload = require('livereload');
const componentList = ['base', 'quarks', 'atoms', 'molecules', 'organisms', 'templates'];
const uniCodeStart = 61440;


(function() {


	function getDirectories(srcpath) {
		return fs.readdirSync(srcpath).filter(function(file) {
	    	return fs.statSync(path.join(srcpath, file)).isDirectory();
		});
	}

	function getComponents(type) {
		var componentDirs = getDirectories(options[type]);
		var els = [];
		for (i = 0; i < componentDirs.length; i++) { 
		    if (componentDirs[i].charAt(0) !== '_') {
		    	els.push(componentDirs[i])
		    }
		}
		return els;
	}

	function requireUncached(module){
	    delete require.cache[require.resolve(module)]
	    return require(module)
	}

	function registerElements() {
		var registeredElements = {};
		for (j = 0; j < componentList.length; j++) {
			var type = componentList[j];
			registeredElements[type] = {};
			var list = registeredElements[type];
			var components = getComponents(type);
			for (i = 0; i < components.length; i++) {
				var configPath = './' + path.join(options[type], components[i], options.primaryFile);
				try {
				    list[components[i]] = requireUncached(configPath);

				    var scss = list[components[i]].scss;

				    if (scss != undefined) {
				    	if (Array.isArray(scss)) {
				    		for (k = 0; k < scss.length; k++) {
				    			scss[k] = './' + path.join(options[type], components[i], scss[k]);
				    		}
				    	} else {
				    		list[components[i]].scss = './' + path.join(options[type], components[i], list[components[i]].scss);
				    	}
				    }

				    if (list[components[i]].markdown != undefined) {
				    	list[components[i]].markdown = './' + path.join(options[type], components[i], list[components[i]].markdown);
				    	try {
				    		var markdownContent = fs.readFileSync(list[components[i]].markdown, 'utf8');
				    		list[components[i]].markdownContent = md(markdownContent);
				    	} catch(e) {
				    		console.error('Could not find markdown file referenced in component "' + components[i] + '". No markdown file present at "' + list[components[i]].markdown + '".');
				    	}
				    }

				    if (list[components[i]].examples != undefined) {
				    	var examples = list[components[i]].examples;
				    	for (l = 0; l < examples.length; l++) {
				    		var swatches = examples[l].swatches;
				    		for (m = 0; m < swatches.length; m++) {
				    			if (swatches[m].content.constructor === Array) {
				    				var htmlFile = './' + path.join(options[type], components[i], swatches[m].content[0]);
				    				try {
				    					var htmlContent = fs.readFileSync(htmlFile, 'utf8');
				    					swatches[m].content = htmlContent;
				    				} catch(e) {
				    					console.error('Could not find html file referenced in component "' + components[i] + '". No html file present at "' + htmlFile + '".');
				    				}

				    			}
				    		}
				    	}
				    }

				} catch(e) {
				    console.error("Component module for '" + components[i] + "'' not found. Component not registered.");
				}
			}
		}
		var iconsList = getIconList();
		for (var i = 0; i < iconsList.length; i++) { 
		    iconsList[i] = iconsList[i].replace('.svg', '');
		    iconsList[i] = 'sp-icon-' + iconsList[i];
		}

		if (registeredElements.quarks.icons.examples[1]) {
			registeredElements.quarks.icons.examples[1].states = [];
			for (var k = 0; k < iconsList.length; k++) { 
				registeredElements.quarks.icons.examples[1].states.push(iconsList[k])
			}
		}
		return registeredElements;
	}

	// function getStyleList(elements, type) {
	// 	var files = [];
	// 	for (key in elements) {
	// 		if (key == type) {
	// 			for (item in elements[key]) {
	// 				console.log(item);
	// 			}
	// 		}

	// 		if (elements[key]) {
	// 			if (typeof elements[key].styles === 'string') {
	// 				files.push(elements[key].path + '/' + elements[key].styles);
	// 			} else if (elements[key].styles.constructor === Array) {
	// 				for (i = 0; i < elements[key].styles.length; i++) {
	// 					files.push(elements[key].path + '/' + elements[key].styles[i]);
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return files;
	// }

	// function getGuideList(elements) {
	// 	var files = [];
	// 	for (key in elements) {
	// 		if (elements[key].guide) {
	// 			if (typeof elements[key].guide === 'string') {
	// 				files.push(elements[key].path + '/' + elements[key].guide);
	// 			} else if (elements[key].guide.constructor === Array) {
	// 				for (i = 0; i < elements[key].guide.length; i++) {
	// 					files.push(elements[key].path + '/' + elements[key].guide[i]);
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return files;
	// }

	function getIconList() {
		var files = []
		fs.readdirSync(options.icons).filter(function(file) {
		    if (file.charAt(0) !== '_' && file.split('.').pop() === 'svg') {
		    	files.push(file)
		    }
		});
		return(files);
	}

	// function populateTemplates(elements) {
	// 	for (key in elements) {
	// 		if (elements[key].template) {
	// 			var content = fs.readFileSync(elements[key].path + '/' + elements[key].template, 'utf8');
	// 			elements[key].content = "'" + content + "'";
	// 		}
	// 	}
	// }

	// function cleanupElements(elements) {
	// 	for (key in elements) {
	// 		if (elements[key].path) {
	// 			delete elements[key].path
	// 		}
	// 		if (elements[key].styles) {
	// 			delete elements[key].styles
	// 		}
	// 		if (elements[key].guide) {
	// 			delete elements[key].guide
	// 		}
	// 		if (elements[key].template) {
	// 			delete elements[key].template
	// 		}
	// 	}
	// 	return elements;
	// }

	function createIconFont(callback) {
		var files = getIconList();
		var settings = {
			icons : [],
			src: options.icons,
			fontName : options.elementPrefix + '-icon-font',
			descent: 0,
			startCodePoint: uniCodeStart,
			dest: options.buildDir + '/assets/fonts/' + options.elementPrefix + '-icon-font'
		}

		for (i = 0; i < files.length; i++) {
			settings.icons.push({
				name: options.elementPrefix + '-icon-' + files[i].replace('.svg', ''),
				file: files[i]
			});
		}
		fontBuilder(settings).then(function() {
			if (callback) {
				callback();
			}
			console.log('Complete: Icon Font Generated');
		}).catch(function(error) {
			console.log(error);
		});
	}

	function renderScss(elements, callback) {
		sass.render({
			file: options.baseStyles,
			importer: function(url, prev, done) {
				if (url == 'base' || url == 'quarks' || url == 'atoms' || url == 'molecules' || url == 'organisms' || url =='templates') {
					var collection = elements[url];
					var content = '';
					for (key in collection) {
						if (collection[key].scss) {
							var item = collection[key].scss;
							if (Array.isArray(item)) {
								for (i = 0; i < item.length; i++) {
									try {
										var file = fs.readFileSync(item[i], 'utf8');
										content = content + file;
									} catch (e) {
										console.error("SCSS Compile Error: No file located at '" + item[i] + "'.");
									}
								}
							} else {
								try {
									var file = fs.readFileSync(collection[key].scss, 'utf8');
									content = content + file;
								} catch (e) {
									console.error("SCSS Compile Error: No file located at '" + collection[key].scss + "'.");
								}
							}
						}
					}
					done({
						contents: content
					});
				} else if (url === 'icon-list') {
			  		var files = getIconList();
					var codePoint = uniCodeStart;
					var iconList = {
						fonts: []
					};

					var svgContent = fs.readFileSync('./build/assets/fonts/sp-icon-font/sp-icon-font.svg', 'utf-8');
					var unicodes = svgContent.match(/(unicode+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g);

					for (var p = 0; p< unicodes.length; p++) {
						unicodes[p] = unicodes[p].replace('unicode="&#x', '').replace(';"', '');
					}

			  		for (i = 0; i < files.length; i++) {


						iconList.fonts.push({
							prefix: options.elementPrefix + '-icon-',
							name: files[i].replace('.svg', ''),
							hex: unicodes[i]
						});
					}
					var fontStyles = Handlebars.compile(fs.readFileSync(options.iconFontTemplate, 'utf8'));
					var compiledStyles = fontStyles(iconList);
					
					done({
						contents: compiledStyles
					});
			  	} else {
			  		done({
			  			file: url
			  		});
			  	}
			}
		}, function(err, result) {
			if (!err) {
				fs.writeFileSync(options.buildDir + '/qit.css', result.css);
				console.log('Complete: SCSS Compiled.');
			} else {
				console.log('Error Compiling SCSS');
				console.error(err);
			}
			if (callback) {
				callback(err, result)
			}
		});
	}

	// function renderScss(elements, callback) {
	// 	sass.render({
	// 	  file: options.baseStyles,
	// 	  importer: function(url, prev, done) {


		 //  	for (key in elements) {
		 //  		console.log(key, url);
			// 	if (key == url) {
			// 		var items = elements[key];
			// 		console.log(items);
			// 		var content = '';
			// 		for (item in items) {
			// 			if (url === item) {
			// 				if (items[item].scss) {
			// 					console.log(items[item].scss);
			// 					var file = fs.readFileSync(items[item].scss, 'utf8');
			// 					content = content + file;
			// 					done({
			// 						contents: content
			// 					});
			// 				}
			// 			} else {
			// 				done({
			// 		  			file: url
			// 		  		});
			// 			}
			// 		}
			// 	}
			// }
		  // 	if (url === 'elements') {
		  // 		var content = '';
		  // 		for (var i = 0; i < styleSheets.length; i++) {
		  // 			var file = fs.readFileSync(styleSheets[i], 'utf8');
		  // 			content = content + file;
		  // 		}
		  // 		done({
			 //  		contents: content
			 //  	});
		  // 	} else if (url === 'icon-list') {
		  // 		var files = getIconList();
				// var codePoint = 0.000;
				// var iconList = {
				// 	fonts: []
				// };
		  // 		for (i = 0; i < files.length; i++) {

				// 	var hex = 'f' + (codePoint + i / 100);
				// 	hex = hex.replace('.', '');
				// 	if (i === 0) {
				// 		hex = 'f000'
				// 	}

				// 	iconList.fonts.push({
				// 		prefix: options.elementPrefix + '-icon-',
				// 		name: files[i].replace('.svg', ''),
				// 		hex: hex
				// 	});
				// }
				// var fontStyles = Handlebars.compile(fs.readFileSync(options.iconFontTemplate, 'utf8'));
				// var compiledStyles = fontStyles(iconList);
				
				// done({
				// 	contents: compiledStyles
				// });
		  // 	} else {
		  // 		done({
		  // 			file: url
		  // 		});
		  // 	}
		  	
	// 	  }
	// 	}, function(err, result) {
	// 		if (!err) {
	// 			fs.writeFileSync(options.buildDir + '/qit.css', result.css);
	// 		}
	// 		if (callback) {
	// 			callback(err, result)
	// 		}
	// 	});

	// 	console.log('Complete: SCSS Compiled');
	// }

	function startServer(port, callback) {
		http.createServer(function (request, response) {
		    var filePath = options.buildDir + request.url;
		    filePath = filePath.split('?')[0];
		    if (filePath == options.buildDir + '/') {
		        filePath = options.buildDir + '/index.html';
		    } else if (request.url == '/base' || request.url == '/quarks' || request.url == '/atoms' || request.url == '/molecules' || request.url == '/organisms' || request.url == '/templates') {
		    	filePath = options.buildDir + '/index.html';
		    }
		    var extname = path.extname(filePath);
		    var contentType = 'text/html';
		    switch (extname) {
		        case '.js':
		            contentType = 'text/javascript';
		            break;
		        case '.css':
		            contentType = 'text/css';
		            break;
		        case '.json':
		            contentType = 'application/json';
		            break;
		        case '.png':
		            contentType = 'image/png';
		            break;      
		        case '.jpg':
		            contentType = 'image/jpg';
		            break;
		        case '.wav':
		            contentType = 'audio/wav';
		            break;
		    }

		    fs.readFile(filePath, function(error, content) {
		        if (error) {
		            if(error.code == 'ENOENT'){
		                fs.readFile('./build/404.html', function(error, content) {
		                    response.writeHead(200, { 'Content-Type': contentType });
		                    response.end(content, 'utf-8');
		                });
		            }
		            else {
		                response.writeHead(500);
		                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
		                response.end();
		            }
		        }
		        else {
		            response.writeHead(200, { 'Content-Type': contentType });
		            response.end(content, 'utf-8');
		        }
		    });

		}).listen(port);

		if (callback) {
			callback();
		}

		var reloadServer = livereload.createServer();
		reloadServer.watch(options.buildDir);

		console.log('Complete: Server Started. Running On Localhost Port: ' + port);
	}

	function copyFileSync( source, target ) {

	    var targetFile = target;

	    //if target is a directory a new file with the same name will be created
	    if ( fs.existsSync( target ) ) {
	        if ( fs.lstatSync( target ).isDirectory() ) {
	            targetFile = path.join( target, path.basename( source ) );
	        }
	    }

	    fs.writeFileSync(targetFile, fs.readFileSync(source));
	}

	function copyFolderRecursiveSync( source, target ) {
	    var files = [];

	    //check if folder needs to be created or integrated
	    var targetFolder = path.join( target, path.basename( source ) );
	    if ( !fs.existsSync( targetFolder ) ) {
	        fs.mkdirSync( targetFolder );
	    }

	    //copy
	    if ( fs.lstatSync( source ).isDirectory() ) {
	        files = fs.readdirSync( source );
	        files.forEach( function ( file ) {
	            var curSource = path.join( source, file );
	            if ( fs.lstatSync( curSource ).isDirectory() ) {
	                copyFolderRecursiveSync( curSource, targetFolder );
	            } else {
	                copyFileSync( curSource, targetFolder );
	            }
	        } );
	    }
	}

	function copyAssets(callback) {
		copyFolderRecursiveSync('./assets', './build');
		copyFileSync('./templates/qit-styleguide.css', './build/qit-styleguide.css');
		console.log('Complete: Assets Folder Copied.');
		if (callback) {
			callback();
		}
	}

	function compileJs(elements, callback) {
		// var elements = cleanupElements(elements);
		webpack({
		    entry: [options.baseJs],
		    output: {
		        path: options.buildDir,
		        filename: "qit.js"
		    },
		    plugins: [
				new webpack.DefinePlugin({
				  '_elementRegistry': elements
				})
			]
		}, function(err, stats) {
		    if (callback) {
		    	callback(err,stats);
		    }
		});

		console.log('Complete: JS Compiled');
	}

	function runWebpack(elements, callback) {
		// var elements = cleanupElements(elements);
		var iconsList = getIconList();
		for (var i = 0; i < iconsList.length; i++) { 
		    iconsList[i] = iconsList[i].replace('.svg', '');
		}
		iconsList = JSON.stringify(iconsList);
		webpack({
		    entry: [options.baseJs],
		    output: {
		        path: options.buildDir,
		        filename: "qit.js"
		    },

		    // Enable sourcemaps for debugging webpack's output.
		    devtool: "source-map",

		    resolve: {
		        // Add '.ts' and '.tsx' as resolvable extensions.
		        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
		    },
		    plugins: [
				new webpack.DefinePlugin({
				  '_qitRegistry': elements,
				  '_qitIcons': iconsList
				})
			],
		    module: {
		        loaders: [
		            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
		            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
		        ],

		        preLoaders: [
		            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
		            { test: /\.js$/, loader: "source-map-loader" }
		        ]
		    },

		    // When importing a module whose path matches one of the following, just
		    // assume a corresponding global variable exists and use that instead.
		    // This is important because it allows us to avoid bundling all of our
		    // dependencies, which allows browsers to cache those libraries between builds.
		    externals: {
		        "react": "React",
		        "react-dom": "ReactDOM"
		    }
		}, function(err, stats) {
			console.log('Complete: Webpack Compiled.');
			if (callback) {
		    	callback(err,stats);
		    }
		});
	}

	// function buildStyleGuide(elements, styleGuides, callback) {
	// 	var styleGuideEntries = [];
	// 	for (var i = 0; i < styleGuides.length; i++) {
	// 	    var markdown = fs.readFileSync(styleGuides[i], 'utf8');
	// 	    var examples = /\[example\]([\s\S]*?)\[\/example\]/gmi;
	// 	    entry = yamlFront.loadFront(markdown);
	// 	    entry['__content'] = entry['__content'].replace(examples, function(matched) {
	// 	    	var example = matched.replace('[example]', '<p class="style-guide-example_content">').replace('[/example]', '</p>\n');
	// 	    	var codeBlock = md(matched.replace('[example]', '```').replace('[/example]', '```'));
	// 	    	return '<div class="style-guide-example">\n' + example + codeBlock + '\n</div>';
	// 	    });
	// 	    entry.html = md(entry['__content']);
	// 	    styleGuideEntries.push(entry);
	// 	}

	// 	var templateData = {
	// 		entries: styleGuideEntries,
	// 		sections : []
	// 	}

	// 	for (var i = 0; i < templateData.entries.length; i++) {
	// 		if (templateData.entries[i].section) {
	// 			var present = false;
	// 			for (var n = 0; n < templateData.sections.length; n++) {
	// 				if (templateData.sections[n] === templateData.entries[i].section) {
	// 					present = true;
	// 				}
	// 			}
	// 			if (!present) {
	// 				templateData.sections.push(templateData.entries[i].section);
	// 			}
	// 		}
	// 	}

	// 	templateData.sections;

	// 	Handlebars.registerHelper('if_eq', function(a, b, opts) {
	// 	    if (a == b) {
	// 	        return opts.fn(this);
	// 	    } else {
	// 	        return opts.inverse(this);
	// 	    }
	// 	});

	// 	var styleGuide = Handlebars.compile(fs.readFileSync(options.styleGuideTemplate, 'utf8'));
	// 	var compiledGuide = styleGuide(templateData);

	// 	fs.writeFileSync(options.buildDir + '/index.html', compiledGuide);

	// 	if (callback) {
	// 		callback();
	// 	}

	// 	console.log('Complete: Style Guide Generated');
	// }

	function listenForChanges() {
		watch('./src', function(filename) {
			if (filename.split('.').pop() === 'scss') {
				var elements = registerElements('base');
				renderScss(elements, function() {
					console.log('Complete: Styles Refreshed.');
				});
			} else {
				qit(function() {
					console.log('Complete: Page Refreshed.');
				});
			}
		});

		watch(options.icons, function(filename) {
			if (filename.split('.').pop() === 'svg') {
				var elements = registerElements('base');
				createIconFont(function() {
					renderScss(elements, function() {
						console.log('Complete: Icons and Styles Refreshed.');
					});
				});
			}
		});

		watch(options.assets, function(filename) {
			copyAssets(function() {
				var elements = registerElements('base');
				createIconFont(function() {
					renderScss(elements, function() {
						console.log('Complete: Assets Folder Updated and Page Refreshed.');
					});
				});
			});
		});

		console.log('Complete: Listener Started');
	}

	function qit(callback, iconToggle, assetToggle) {
		var elements = registerElements();
		// var styleSheets = getStyleList(elements);
		// var styleGuides = getGuideList(elements);
		
		if (assetToggle) {
			copyAssets(function() {
				if (iconToggle) {
					createIconFont(function() {
						renderScss(elements, function() {
							elements = JSON.stringify(elements);
							runWebpack(elements, function() {
								if (callback) {
									callback();
								}
								console.log('Complete: Qit Successfully Compiled.');
							});
						});
					});
				} else {
					renderScss(elements, function() {
						elements = JSON.stringify(elements);
						runWebpack(elements, function() {
							if (callback) {
								callback();
							}
							console.log('Complete: Qit Successfully Compiled.');
						});
					});
				}
			});
		} else {
			if (iconToggle) {
				createIconFont(function() {
					renderScss(elements, function() {
						elements = JSON.stringify(elements);
						runWebpack(elements, function() {
							if (callback) {
								callback();
							}
							console.log('Complete: Qit Successfully Compiled.');
						});
					});
				});
			} else {
				renderScss(elements, function() {
					elements = JSON.stringify(elements);
					runWebpack(elements, function() {
						if (callback) {
							callback();
						}
						console.log('Complete: Qit Successfully Compiled.');
					});
				});
			}
		}
	}

	qit(function() {
		startServer(options.serverPort);
		listenForChanges();
	}, true, true);
	
})();