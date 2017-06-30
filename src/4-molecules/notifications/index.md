### Notification Options

1. type
	- global - Appears on all users screens as a system wide notification at the top of the screen until dismissed by the user.
	- normal - Standard notification that also gets saved in the user's notification history.
	- transient - Standard notification that does not get saved in the user's notification history.
	- process - Persistent notification that remains on screen until the process is done or the user cancels the process. Does not get saved in the user's notification history.

2. severity
	- primary
	- success
	- warning
	- danger

3. persistence
	- How long the notification displays until it automatically hides itself. '0' would mean the notification stays until the user hits 'dismiss'.

4. cta
	- Optional. Call to action verbiage for the optional second button. 

5. icon
	- default will choose an icon associated with the severity level. Using 'settings' or another icon name, will change the class to 'sp-icon-settings'.

6. image
	- icon - will use an icon as image (see above). 
	- string of image url. If an image URL is passed in, no icon will be displayed and the image will be set to the background image of the left square.
	- none - the box with the icon/image will not be displayed.

7. title
	- String for the notification title.

8. body
	- String for the notification body.



