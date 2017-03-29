import * as React from "react";
import * as ReactDOM from "react-dom";

const allItems = {};
const allSections = [];

for (var key in _qitRegistry) {
	allItems[key] = [];
	allSections.push(key);
	var items = _qitRegistry[key];
	for (var item in items) {
		items[item].name = item;
		allItems[key].push(items[item]);
	}
}

function updateTheme() {
	var themeClass = localStorage.getItem('theme') || 'sp-container-light';
	if (themeClass == 'sp-container-dark') {
		$('#root').addClass('sp-container-dark');
		$('#root').removeClass('sp-container-light');
		$('#qit-light').removeClass('sp-color-primary');
		$('#qit-dark').addClass('sp-color-primary');
	} else {
		$('#root').addClass('sp-container-light');
		$('#root').removeClass('sp-container-dark');
		$('#qit-dark').removeClass('sp-color-primary');
		$('#qit-light').addClass('sp-color-primary');
	}
}

updateTheme();

function createMarkup(content) {
  return {__html: content};
}

class Qit extends React.Component {
  render() {
  	var category = this.props.category;
  	var theItems = this.props.items;
    return (
    	<div className="qit-content">
    		<div className="qit-navigation sp-padding-top-3 sp-container sp-contrast">
    			<h2 className="sp-color-contrast sp-align-center">Qit</h2>
    			<div className="sp-label sp-small sp-padding-bottom-3 sp-margin-bottom-3 sp-align-center sp-border-color-primary sp-border-bottom-thin-solid">Styleguide By Specless</div>
    			<div className="qit-theme-toggle sp-margin-bottom-2">
    				<span id="qit-light" className="sp-icon-sun sp-large sp-padding-1"></span>
    				<span id="qit-dark" className="sp-icon-moon sp-large sp-padding-2"></span>
    			</div>
	    		<ul>
					{
			    		allSections.map(function(section) {
							var currentClass = 'sp-menu-item sp-label';
			    			if (section == category) {
			    				currentClass = 'sp-menu-item sp-label sp-state-active';
			    			} else if (section == 'base') {
			    				currentClass = 'sp-hidden';
			    			}
			    	
							return (
								<li>
							        <a className={currentClass + " qit-capitalize sp-icon-" + section} href={'/?' + section}>{section}</a>
							        <ul id={'nav-' + section}>
							        	{
							        		theItems.map(function(item) {
							        			if (section == category) {
								        			return (
								        				<li><a className="sp-menu-item" href={'/?' + section + '#' + item.name}>{item.title}</a>
								        					<ul className="qit-sub-items">
								        						{
								        							item.examples.map(function(example) {
									        							return (
									        								<li><a className="sp-menu-item sp-small sp-minimal" href={'/?' + section + '#' + example.title}>{example.title}</a></li>
									        							)
									        						})
								        						}
								        					</ul>
								        				</li>
								        			);
								        		}
							        		})
							        	}
							        </ul>
							    </li>
							);
						})
					}
	    		</ul>
	    	</div>
	    	<div className="qit-articles sp-padding-3">
	    		{
		          this.props.items.map(function(item) {
		            return (
		            	<article id={item.name} className="qit-article">
		            		<div className="sp-label sp-color-muted">{category}</div>
		            		<h1 className="sp-color-contrast sp-border-color-primary sp-border-bottom-thin-solid">{item.title}</h1>
		            		<p>{item.description}</p>
		            		<div className="qit-markdown" dangerouslySetInnerHTML={createMarkup(item.markdownContent)}/>
		            		<div className="qit-examples">
		            			{
		            				item.examples.map(function(example) {
		            					console.log(example.states);
		            					return (
		            						<div id={example.title} className="qit-example">
										        <h3 className="sp-color-contrast">{example.title}<span className="sp-muted">{example.subTitle}</span></h3>
										        <div className="qit-example-content">
										        	{
										        		example.swatches.map(function(swatch) {
							            					return (
							            						<div className="qit-swatches sp-padding-top-2 sp-padding-bottom-2">
							            							<h4 className="sp-margin-bottom-2">{swatch.title}</h4>
								            						<div className="qit-swatch sp-container sp-alt-two sp-inline sp-padding-2 sp-padding-bottom-0 sp-margin-right-2 sp-margin-bottom-2">
																	    <div className="sp-shadow-low sp-padding-3 sp-padding-top-1">
																	        <h6 className="sp-margin-bottom-2">Natural State</h6>
																	        {
																        		(swatch.type != 'box-target')?
																	        		<div tabIndex="0" className={"qit-swatch-" + swatch.type + " " + swatch.classes} dangerouslySetInnerHTML={createMarkup(swatch.content)}/>
																	        	: 
																	        		<div tabIndex="0" data-classes={swatch.classes} className={"qit-swatch-" + swatch.type} dangerouslySetInnerHTML={createMarkup(swatch.content)}/>
																	        }
																        </div>
																        <div className="qit-modifiers sp-padding-top-2 sp-margin-top-2">
																	   		{
												        						(example.modifiers || []).map(function(modifier) {
												        							return (
												        								<div data-modifier={modifier} className="qit-modifier sp-shadow-low sp-padding-3 sp-padding-top-1 sp-margin-bottom-3">
												        									<h6 className="sp-margin-top-3">&nbsp;</h6>
															        						<h6 className="sp-margin-bottom-2">{"&." + modifier}</h6>
												        									{
																				        		(swatch.type != 'box-target')?
																					        		<div tabIndex="0" className={"qit-swatch-" + swatch.type + " " + swatch.classes + " " + modifier} dangerouslySetInnerHTML={createMarkup(swatch.content)}/>
																					        	: 
																					        		<div tabIndex="0" data-classes={swatch.classes} data-modifier={modifier} className={"qit-swatch-" + swatch.type } dangerouslySetInnerHTML={createMarkup(swatch.content)}/>
																					        }
												        								</div>
												        							)
												        						})
																	   		}
																	   	</div>
																    </div>
																    {
																    	(example.states || []).map(function(state) {
																    		return (
																    			<div className="qit-swatch sp-container sp-alt-two sp-inline sp-padding-2 sp-padding-bottom-0 sp-margin-right-2 sp-margin-bottom-2">
																    				<div className="sp-shadow-low sp-padding-3 sp-padding-top-1">
																				        <h6 className="sp-margin-bottom-2">{"&." + state}</h6>
																				        {
																			        		(swatch.type != 'box-target')?
																				        		<div tabIndex="0" className={"qit-swatch-" + swatch.type + " " + swatch.classes + " " + state} dangerouslySetInnerHTML={createMarkup(swatch.content)}/>
																				        	: 
																				        		<div tabIndex="0" data-classes={swatch.classes} data-state={state} className={"qit-swatch-" + swatch.type} dangerouslySetInnerHTML={createMarkup(swatch.content)}/>
																				        }
																				    </div>
																			        <div className="qit-modifiers sp-padding-top-2 sp-margin-top-2">
																				   		{
															        						example.modifiers.map(function(modifier) {
															        							return (
															        								<div data-modifier={modifier} className="qit-modifier sp-shadow-low sp-padding-3 sp-padding-top-1 sp-margin-bottom-3">
															        									<h6 className="sp-margin-top-3">{"&." + state}</h6>
															        									<h6 className="sp-margin-bottom-2">{"&." + modifier}</h6>
															        									{
																							        		(swatch.type != 'box-target')?
																								        		<div tabIndex="0" className={"qit-swatch-" + swatch.type + " " + swatch.classes + " " + state + " " + modifier} dangerouslySetInnerHTML={createMarkup(swatch.content)}/>
																								        	: 
																								        		<div tabIndex="0" data-classes={swatch.classes} data-state={state} data-modifier={modifier} className={"qit-swatch-" + swatch.type} dangerouslySetInnerHTML={createMarkup(swatch.content)}/>
																								        }
															        								</div>
															        							)
															        						})
																				   		}
																				   	</div>
																			    </div>
																    		)
																    	})
																    }
																</div>
							            					)
							            				})
							            			}
										        </div>
										    </div>
		            					);
		            				})
		            			}
		            		</div>
		            	</article>
		            );
		          })
		        }
		    </div>
    	</div>
    );
  }
}

const finalSteps = function() {
	setTimeout(function() {
		updateTheme();
		var $classes = $('[data-classes]');
		var $states = $('[data-state]');
		var $modifiers = $('[data-modifier');
		$classes.each(function(this) {
			var classes = $(this).attr('data-classes').split(' ');
			var $matches = $(this).find('.qit-target');	
			
			for (var i = 0; i < classes.length; i++) { 
				$matches.addClass(classes[i]);
			}
		});

		$states.each(function(this) {
			var state = $(this).attr('data-state');
			var $matches = $(this).find('.qit-target');
			$matches.addClass(state);
		});

		$modifiers.each(function(this) {
			var modifier = $(this).attr('data-modifier');
			var $matches = $(this).find('.qit-target');
			$matches.addClass(modifier);
		});

		$('#qit-light').click(function() {
			localStorage.setItem('theme', 'sp-container-light');
			updateTheme();
		});

		$('#qit-dark').click(function() {
			localStorage.setItem('theme', 'sp-container-dark');
			updateTheme();
		});

	}, 1000);
}

const render(items, name) {
	ReactDOM.render(
	 	<Qit items={items} category={name}/>,
	 	document.getElementById('root'),
	 	finalSteps()
	);
}

var currentPath = window.location.search.split('?')[1];

render(allItems[currentPath], currentPath);
