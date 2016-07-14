# InspireTab

InspireTab is a Chrome extension that I (Jon) use to block certain websites
during the day.

At the moment it can:

 * Block a list of websites of your choosing.
 * Allow you a free pass into that website if it's actually productive, or you're on break.
 * Supports custom images to display in the background -- this adds additional inspiration to be productive.

At the moment, you cannot customize the images and websites from the UI. It's hardcoded. Customization coming soon!


## To build InspireTab locally:

1. Install webpack

    `npm install webpack -g`

2. In the root directory of the project, run `npm install`

3. In the root directory of the project, run `webpack` to build. You should now
  see a `dist/` folder in the `app/` directory.

4. In Chrome, add a local chrome extension (on the Chrome extensions page, check
  off developer mode and click 'Load unpacked extension') and choose the `app/`
  folder.

5. To customize the restricted URLs, you'll need to update `background.js`
   (the `urlPatterns` object).

6. To use your own background images, you'll need to update `interrupt.js`
  (the `imgList` array), and then rebuild by running `webpack`.
