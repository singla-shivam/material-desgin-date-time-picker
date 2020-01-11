# Material Design Date Time Picker

Material Design Date Time Picker is a simple and easy to use library for Date Picker in web.

## Installation

You can either directly download the files or install with npm.

Download : 
* [dtp-min.css](dist/dtp.min.css)
* [dtp-min.js](dist/dtp.min.js)

And include in your HTML directly

```
<link rel="stylesheet" href="path_to/dpt.min.css">
```
```
<script src="path_to/dpt.min.js"></script>
```

Or  
Install with NPM
```
npm i dtp
```


## Add markup
For date-picker
```
<div class="dtp-date-picker">
    <input type="text" id="DATE_PICKER_ID">
    <div class="dtp-container"></div>
</div>
```

For time-picker
```
<div class="dtp-time-picker">
    <input type="text" id="TIME_PICKER_ID">
    <div class="dtp-container"></div>
</div>
```

## Usage

#### Installed by NPM:
1. Import CSS file in your SCSS file
```
@import "~dtp/dist/dtp.min.css"
```

2. Import **DTP** object
```
//@ts-ignore
import DTP from 'dtp'
```

3. Instantiate date-picker
```javascript
new DTP().datePicker(document.getElementById("DATE_PICKER_ID));
```

4. Instantiate time-picker
```javascript
new DTP().timePicker(document.getElementById("TIME_PICKER_ID));
```

You can apply your own style:
```css
--dtp-primary-light : #ff5c8d;
--dtp-primary : #d81b60;
--dtp-primary-dark : #a00037; 
--dtp-theme-surface : #fff;
--dtp-theme-gray : rgba(179, 179, 179, 0.2);
--dtp-cell-width : 40px;
--dtp-cell-height : 40px;
```
## Events

A **change** event is dispatched when the value of input fields of date-picker and time-picker are changed.

## Authors

[Shivam Singla](linkedin.com/in/singla-shivam)


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
