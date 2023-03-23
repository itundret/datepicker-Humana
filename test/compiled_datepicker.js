var Datepicker = /** @class */ (function () {
    function Datepicker(options) {
        this.selectedDate = null;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.blackoutDates = [];
        this.inputElement = options.inputElement;
        this.selectedDate = this.parseDate(options.inputElement.value);
        this.blackoutDates = options.blackoutDates || [];
        this.popupElement = document.createElement("div");
        this.popupElement.classList.add("datepicker-popup");
        this.daysGridElement = document.createElement("div");
        this.daysGridElement.classList.add("datepicker-days-grid");
        this.updateDisplay();
        this.popupElement.appendChild(this.createHeaderElement());
        this.popupElement.appendChild(this.createDaysGridElement());
        options.inputElement.addEventListener("focus", this.showPopup.bind(this));
        options.inputElement.addEventListener("input", this.handleInput.bind(this));
    }
    //parses a string representing a date in MM/DD/YYYY format and returns a Date object
    Datepicker.prototype.parseDate = function (dateString) {
        var dateParts = dateString.split("/");
        var year = parseInt(dateParts[2]);
        var month = parseInt(dateParts[0]) - 1;
        var day = parseInt(dateParts[1]);
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return null;
        }
        return new Date(year, month, day);
    };
    //formats a Date object as a string in MM/DD/YYYY format
    Datepicker.prototype.formatDate = function (date) {
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString().padStart(2, "0");
        var day = date.getDate().toString().padStart(2, "0");
        return "".concat(month, "/").concat(day, "/").concat(year);
    };
    //creates the header element of the datepicker calendar, containing navigation buttons and the month/year label
    Datepicker.prototype.createHeaderElement = function () {
        var _this = this;
        var headerElement = document.createElement("div");
        headerElement.classList.add("datepicker-header");
        var prevMonthButton = document.createElement("button");
        prevMonthButton.innerText = "<";
        prevMonthButton.addEventListener("click", function () { return _this.navigateMonth(-1); });
        headerElement.appendChild(prevMonthButton);
        var monthYearLabel = document.createElement("div");
        monthYearLabel.classList.add("datepicker-month-year-label");
        monthYearLabel.innerText = "".concat(this.getMonthName(this.currentMonth), " ").concat(this.currentYear);
        headerElement.appendChild(monthYearLabel);
        var nextMonthButton = document.createElement("button");
        nextMonthButton.innerText = ">";
        nextMonthButton.addEventListener("click", function () { return _this.navigateMonth(1); });
        headerElement.appendChild(nextMonthButton);
        return headerElement;
    };
    //creates the grid of days in the datepicker calendar
    Datepicker.prototype.createDaysGridElement = function () {
        var _this = this;
        var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var daysGridElement = document.createElement("div");
        daysGridElement.classList.add("datepicker-days-grid");
        for (var _i = 0, daysOfWeek_1 = daysOfWeek; _i < daysOfWeek_1.length; _i++) {
            var dayOfWeek = daysOfWeek_1[_i];
            var dayOfWeekElement = document.createElement("div");
            dayOfWeekElement.classList.add("datepicker-day-of-week");
            dayOfWeekElement.innerText = dayOfWeek;
            daysGridElement.appendChild(dayOfWeekElement);
        }
        var _loop_1 = function (i) {
            var date = new Date(this_1.currentYear, this_1.currentMonth, i + 1);
            var dayElement = document.createElement("button");
            dayElement.classList.add("datepicker-day");
            dayElement.innerText = (i + 1).toString();
            dayElement.addEventListener("click", function () { return _this.selectDate(date); });
            console.log(date);
            if (this_1.isSelectedDate(date)) {
                dayElement.classList.add("selected");
                console.log("added selected class", dayElement);
            }
            if (this_1.isBlackoutDate(date)) {
                dayElement.classList.add("blackout");
            }
            daysGridElement.appendChild(dayElement);
        };
        var this_1 = this;
        for (var i = 0; i < this.getNumDaysInMonth(this.currentMonth, this.currentYear); i++) {
            _loop_1(i);
        }
        return daysGridElement;
    };
    //navigates to the previous or next month based on the delta argument (-1 or 1)
    Datepicker.prototype.navigateMonth = function (delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear += 1;
        }
        else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear -= 1;
        }
        this.updateDisplay();
    };
    // selects the given date and updates the display
    Datepicker.prototype.selectDate = function (date) {
        if (this.isBlackoutDate(date)) {
            return;
        }
        this.selectedDate = date;
        this.updateDisplay();
        this.hidePopup();
    };
    //checks if the given date is currently selected
    Datepicker.prototype.isSelectedDate = function (date) {
        console.log(this.selectedDate);
        console.log(date.getTime());
        console.log(this.selectedDate?.getTime());
        return this.selectedDate !== null && date.getTime() === this.selectedDate.getTime();
    };
    //checks if the given date is blacked out (i.e. cannot be selected)
    Datepicker.prototype.isBlackoutDate = function (date) {
        return this.blackoutDates.some(function (blackoutDate) { return blackoutDate.getTime() === date.getTime(); });
    };
    //updates the month/year label and the grid of days in the datepicker calendar
    Datepicker.prototype.updateDisplay = function () {
        var _this = this;
        var monthYearLabel = this.popupElement.querySelector(".datepicker-month-year-label");
        if (monthYearLabel) {
            monthYearLabel.innerText = "".concat(this.getMonthName(this.currentMonth), " ").concat(this.currentYear);
        }
        this.daysGridElement.innerHTML = "";
        var _loop_2 = function (i) {
            var date = new Date(this_2.currentYear, this_2.currentMonth, i + 1);
            var dayElement = document.createElement("button");
            dayElement.classList.add("datepicker-day");
            dayElement.innerText = (i + 1).toString();
            dayElement.addEventListener("click", function () { return _this.selectDate(date); });
            if (this_2.isSelectedDate(date)) {
                dayElement.classList.add("selected");
            }
            if (this_2.isBlackoutDate(date)) {
                dayElement.classList.add("blackout");
            }
            this_2.daysGridElement.appendChild(dayElement);
        };
        var this_2 = this;
        for (var i = 0; i < this.getNumDaysInMonth(this.currentMonth, this.currentYear); i++) {
            _loop_2(i);
        }
        // Set the value of the inputElement with the selected date
        if (this.selectedDate !== null) {
            this.inputElement.value = this.formatDate(this.selectedDate);
        }
    };
    Datepicker.prototype.getMonthName = function (monthIndex) {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[monthIndex];
    };
    Datepicker.prototype.getNumDaysInMonth = function (monthIndex, year) {
        return new Date(year, monthIndex + 1, 0).getDate();
    };
    Datepicker.prototype.handleInput = function () {
        this.selectedDate = this.parseDate(this.inputElement.value);
        this.updateDisplay();
    };
    Datepicker.prototype.showPopup = function () {
        if (!this.selectedDate) {
            this.selectedDate = new Date();
            this.inputElement.value = this.formatDate(this.selectedDate);
        }
        this.popupElement.style.display = "block";
        document.body.appendChild(this.popupElement);
        this.createDaysGridElement();
    };
    Datepicker.prototype.hidePopup = function () {
        this.popupElement.style.display = "none";
    };
    return Datepicker;
}());
