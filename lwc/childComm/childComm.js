import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class ChildComm extends LightningElement {
    @api message = "in child";

    handleChange(event) {
        let value = event.target.value;
        this.dispatchEvent(
            new CustomEvent("messagefromchild", { detail: value })
        );
    }

    @api showToast(message) {
        this.temp = message;
        console.log("in childComm");
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Message from Parent",
                message: message,
                variant: "success"
            })
        );
    }

    /* addition;
    subtraction;
    multiplication;
    division;
 */
    numberA;
    numberB;

    handleChangeA(event) {
        this.numberA = parseInt(event.target.value, 10);
        this._addition = this.numberB + parseInt(event.target.value, 10);
    }

    handleChangeB(event) {
        this.numberB = parseInt(event.target.value, 10);
        console.log(this.addition);
        this._addition = this.numberA + parseInt(event.target.value, 10);
    }

    _addition;
    @api get addition() {
        console.log("get addition");
        return this._addition;
    }

    set addition(value) {
        console.log("set addition");
        this._addition = value / 10;
    }

    get subtraction() {
        // calcs
        return this.numberA - this.numberB;
    }

    get multiplication() {
        return this.numberA * this.numberB;
    }

    get division() {
        return this.numberA / this.numberB;
    }
}
