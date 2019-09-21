# Material Design Date Time Picker

Material Design Date Time Picker is a simple and easy to use library for Date Picker in web.

## Installing

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

## API
Instantiate date-picker
```
new DTP().datePicker(document.getElementById("DATE_PICKER_ID));
```

Instantiate time-picker
```
new DTP().timePicker(document.getElementById("TIME_PICKER_ID));
```

## Events

A **change** event is dispatched when the value of input fields of date-picker and time-picker are changed.

## Authors

* **Shivam Singla**


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
