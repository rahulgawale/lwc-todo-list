import { LightningElement } from "lwc";

export default class Parent extends LightningElement {
    message = "";
    handleChange(event) {
        this.message = event.target.value;
    }

    handleMessageFromChild(event) {
        console.log("message from child", event.detail);
        this.message = event.detail;
    }

    callChildCmpMethod() {
        console.log("in parent");
        let child = this.template.querySelector(".child-cmp");
        child.showToast("Addition is " + child.addition);
    }

    addition = 20;
}
