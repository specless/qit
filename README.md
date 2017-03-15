# Specless Qit

## Installation

```
npm install
```

## Running Qit

```
npm run qit
```

## Production & Methodology

#### Project Structure

In the directory `/src` there are a number of folders per the below:

- `/1-base` This is where any resets, base styles, utilities, mixins, should be placed.
- `/2-quarks` These are your most basic custom classes. Quarks should only consist of styling classes that have a wide range of usage. Quarks should not style html elements.
- `/3-atoms` Atoms are the core styles associated with all native HTML tags and unique classes that define a very specific individual element. 
- `/4-molecules` Molecules should use a minimal amount of custom CSS, but can be assembled and styled by combining quarks and atoms. 
- `/5-organisms` Organisms should not have any custom CSS, but rather should mostly use a variety of molecules to assemble.
- `/6-templates` Layouts use a variety of organisms to create a full page view. This is what the user will see and is the closest to the final app environment.

**Note: ** Qit will compile each of the base directories at once, starting with `base` and ending with `layouts`. You do not control the order in which your SCSS compiles, just that all `base` components will compile before all `quarks`. This is intentional to force adhering to atomic design principals. Atoms should not depend on other atoms. Quarks should not depend on other quarks. Atoms should depend on quarks. Molecules can depend on atoms and quarks. Etc.

#### Creating Components

In each of the directories listed above there are any number of subfolders. Each subfolder represents an individual component. To register this as a component, there needs to be an `index.json` in each component directory. This `json` file needs to include some data about how the component should compile (i.e. what SCSS files should it compile) as well as what content should it show in the style guide documentation.

#### An Example Component `index.json`:

```
{
  "title": "Helper Classes", // The name of the component as it will appear in the style guide
  "description": "Text goes here.", // Some descriptive text to appear in style guide
  "examples": [ // array of example entries that will appear in style guide
  	{
  		"title": "Display", // The name of the example
  		"subTitle": "", // Subtitle of example
  		"swatches" : [ // array of swatches to appear in the guide under this example
  			{
  				"title": ".sp-color-*", // Title of the swatch
  				"type": "box-target", // block || box || box-target
  				"classes": "", // space separated list of classes to apply to the actual swatch contents. If box-target was chosen above, classes will be applied to an y element in your content (see below) that has the class 'qit-target'
  				"content": "<h4 class='qit-target sp-margin-1'>Headline Text</h4><div class='sp-label qit-target sp-margin-1'>Label Text</div><p class='qit-target sp-margin-1'>Body Text</p>" // HTML content that will populate the swatch area.
  			}
  		],
  		"states": ["sp-state-hover", sp-state-active], // array of classes that show the various states of this component
  		"modifiers": ["sp-color-base", "sp-color-contrast", "sp-color-muted"] // array of modifier classes that show ways in which this component can be modified
  	}
  ],
  "scss": ["display.scss", "alignment.scss"], // array of scss files to import to the compiled SCSS output. Scss files should be housed in the same directory as the component and all paths are relative to that directory.
  "markdown": "index.md" // Markdown file that will compile at the top of this component's article entry. Markdown files should be housed in the same directory as the component and all paths are relative to that directory.
}
```

#### Adding Assets

To reference assets such as images or fonts in your SCSS, simply add them to the `/assets` folder. They will automatically copy to the build directory. 

#### Adding Icon Font Characters

Simply add an SVG file to the `/icons` folder and that svg will automatically be added to the icon font used by Qit. All selectors and classes will match the `sp-icon-*` naming structure, where the * is replaced by the file name. For example, `settings.svg` becomes active with the class `sp-icon-settings`.





