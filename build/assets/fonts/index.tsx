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
		// if (key == 'base') {
		// 	base.push(items[item]);
		// } else if (key == 'quarks') {
		// 	quarks.push(items[item]);
		// } else if (key == 'atoms') {
		// 	atoms.push(items[item]);
		// }
	}
}

function createMarkup(content) {
  return {__html: content};
}


class Qit extends React.Component {
  render() {
  	var category = this.props.category;
    return (
    	<div className="qit-content">
    		<div className="qit-navigation">
	    		<ul>
					{
			    		allSections.map(function(section) {
							var currentClass = 'sp-menu-item';
			    			if (section == category) {
			    				currentClass = 'sp-menu-item sp-active';
			    			}
							return (
								<li>
							        <a className={currentClass} href={'/' + section}>{section}</a>
							    </li>
							);
						})
					}
	    		</ul>
	    	</div>
	    	<div className="qit-articles">
	    		{
		          this.props.items.map(function(item) {
		            return (
		            	<article id={category + '-' + item.name} className="qit-article">
		            		<div className="sp-label">{category}</div>
		            		<h1>{item.title}</h1>
		            		<p>{item.description}</p>
		            		<div className="qit-examples">
		            			{
		            				item.examples.map(function(example) {
		            					return (
		            						<div className="qit-example">
										        <h3>{example.title}<span className="sp-muted">{example.subTitle}</span></h3>
										        <div className="qit-example-content">
										        	{
										        		example.swatches.map(function(swatch) {
							            					return (
							            						<div className="qit-swatch">
															        <h6>{swatch.title}</h6>
															        <div className="qit-swatch-block" dangerouslySetInnerHTML={createMarkup(swatch.content)}/>
															    </div>
							            					);
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

const render(items, name) {
	ReactDOM.render(
	 	<Qit items={items} category={name}/>,
	 	document.getElementById('root')
	);
}

var currentPath = window.location.pathname.split('/')[1];

render(allItems[currentPath], currentPath);
