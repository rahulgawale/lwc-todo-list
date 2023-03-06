import { LightningElement } from "lwc";

export default class Conditionals extends LightningElement {
    showDiv = false;
    handleCheckboxChange(event) {
        this.showDiv = event.target.checked;
    }

    number;

    handleChangeNumber(event) {
        this.number = parseInt(event.target.value, 10);
    }

    get classes() {
        if (this.number >= 5) {
            return "my-div-green slds-var-p-around_x-small";
        }
        return " my-div-brown slds-var-p-around_x-small";
    }

    get divStyle() {
        return "font-size:" + this.number + "px;";
    }

    colorOptions = [
        { label: "Green", value: "green" },
        { label: "Brown", value: "brown" },
        { label: "Blue", value: "blue" }
    ];

    selectedColor = "Green";

    handleChangeColor(event) {
        this.selectedColor = event.target.value;
    }

    get isBlue() {
        return this.selectedColor === "blue";
    }

    get isGreen() {
        return this.selectedColor === "green";
    }

    get isBrown() {
        return this.selectedColor === "brown";
    }
}
