import { LightningElement, api } from "lwc";

export default class ChildComm extends LightningElement {
    @api message = "in child";

    handleChange(event) {
        let value = event.target.value;
        this.dispatchEvent(
            new CustomEvent("messagefromchild", { detail: value })
        );
    }
}
