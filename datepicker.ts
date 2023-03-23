interface DatepickerOptions {
    inputElement: HTMLInputElement;
    blackoutDates?: Date[];
}

class Datepicker {
    private selectedDate: Date | null = null;
    private currentMonth: number = new Date().getMonth();
    private currentYear: number = new Date().getFullYear();
    private blackoutDates: Date[] = [];
    private inputElement: HTMLInputElement;
    private popupElement: HTMLDivElement;
    private daysGridElement: HTMLDivElement;

    constructor(options: DatepickerOptions) {
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
    private parseDate(dateString: string): Date | null {
      const dateParts = dateString.split("/");
      const year = parseInt(dateParts[2]);
      const month = parseInt(dateParts[0]) - 1;
      const day = parseInt(dateParts[1]);

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return null;
      }

      return new Date(year, month, day);
    }
    //formats a Date object as a string in MM/DD/YYYY format
    private formatDate(date: Date): string {
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      return `${month}/${day}/${year}`;
    }
    //creates the header element of the datepicker calendar, containing navigation buttons and the month/year label
    private createHeaderElement(): HTMLDivElement {
      const headerElement = document.createElement("div");
      headerElement.classList.add("datepicker-header");

      const prevMonthButton = document.createElement("button");
      prevMonthButton.innerText = "<";
      prevMonthButton.addEventListener("click", () => this.navigateMonth(-1));
      headerElement.appendChild(prevMonthButton);

      const monthYearLabel = document.createElement("div");
      monthYearLabel.classList.add("datepicker-month-year-label");
      monthYearLabel.innerText = `${this.getMonthName(this.currentMonth)} ${this.currentYear}`;
      headerElement.appendChild(monthYearLabel);

      const nextMonthButton = document.createElement("button");
      nextMonthButton.innerText = ">";
      nextMonthButton.addEventListener("click", () => this.navigateMonth(1));
      headerElement.appendChild(nextMonthButton);

      return headerElement;
    }
    //creates the grid of days in the datepicker calendar
    private createDaysGridElement(): HTMLDivElement {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const daysGridElement = document.createElement("div");
      daysGridElement.classList.add("datepicker-days-grid");

      for (const dayOfWeek of daysOfWeek) {
        const dayOfWeekElement = document.createElement("div");
        dayOfWeekElement.classList.add("datepicker-day-of-week");
        dayOfWeekElement.innerText = dayOfWeek;
        daysGridElement.appendChild(dayOfWeekElement);
      }

        for (let i = 0; i < this.getNumDaysInMonth(this.currentMonth, this.currentYear); i++) {
            const date = new Date(this.currentYear, this.currentMonth, i + 1);

            const dayElement = document.createElement("button");
            dayElement.classList.add("datepicker-day");
            dayElement.innerText = (i + 1).toString();
            dayElement.addEventListener("click", () => this.selectDate(date));


            if (this.isSelectedDate(date)) {
                dayElement.classList.add("selected");
            }

            if (this.isBlackoutDate(date)) {
                dayElement.classList.add("blackout");
            }

            daysGridElement.appendChild(dayElement);
        }

        return daysGridElement;
    }
    //navigates to the previous or next month based on the delta argument (-1 or 1)
    private navigateMonth(delta: number): void {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear += 1;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear -= 1;
        }

      this.updateDisplay();
    }
    // selects the given date and updates the display
    private selectDate(date: Date): void {
        if (this.isBlackoutDate(date)) {
            return;
        }
        this.selectedDate = date;
        this.updateDisplay();
        this.hidePopup();
    }
    //checks if the given date is currently selected
    private isSelectedDate(date: Date): boolean {
        console.log(this.selectedDate);
        return this.selectedDate !== null && date.getTime() === this.selectedDate.getTime();
    }
    //checks if the given date is blacked out
    private isBlackoutDate(date: Date): boolean {
        return this.blackoutDates.some((blackoutDate) => blackoutDate.getTime() === date.getTime());
    }
    //updates the month/year label and the grid of days in the datepicker calendar
    private updateDisplay(): void {
        const monthYearLabel = this.popupElement.querySelector(".datepicker-month-year-label") as HTMLElement;
        if(monthYearLabel) {
            monthYearLabel.innerText = `${this.getMonthName( this.currentMonth )} ${this.currentYear}`;
        }
        this.daysGridElement.innerHTML = "";
        for (let i = 0; i < this.getNumDaysInMonth(this.currentMonth, this.currentYear); i++) {
            const date = new Date(this.currentYear, this.currentMonth, i + 1);
            const dayElement = document.createElement("button");
            dayElement.classList.add("datepicker-day");
            dayElement.innerText = (i + 1).toString();
            dayElement.addEventListener("click", () => this.selectDate(date));
            if (this.isSelectedDate(date)) {
                dayElement.classList.add("selected");
            }
            if (this.isBlackoutDate(date)) {
                dayElement.classList.add("blackout");
            }
            this.daysGridElement.appendChild(dayElement);
        }

        // Set the value of the inputElement with the selected date
        if (this.selectedDate !== null) {
            this.inputElement.value = this.formatDate(this.selectedDate);
        }
    }

    private getMonthName(monthIndex: number): string {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[monthIndex];
    }

    private getNumDaysInMonth(monthIndex: number, year: number): number {
        return new Date(year, monthIndex + 1, 0).getDate();
    }

    private handleInput(): void {
        this.selectedDate = this.parseDate(this.inputElement.value);
        this.updateDisplay();
    }

    private showPopup(): void {
        if (!this.selectedDate) {
            this.selectedDate = new Date();
            this.inputElement.value = this.formatDate(this.selectedDate);
        }
        this.popupElement.style.display = "block";
        document.body.appendChild(this.popupElement);
    }

    private hidePopup(): void {
        this.popupElement.style.display = "none";
    }
}