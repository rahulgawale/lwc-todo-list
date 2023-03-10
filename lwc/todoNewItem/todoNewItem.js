import { LightningElement, wire, track } from "lwc";
import {
    createRecord,
    updateRecord,
    deleteRecord
} from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import getTodoList from "@salesforce/apex/TodoListController.getTodoList";
import updateRecords from "@salesforce/apex/TodoListController.updateRecords";

import TODO from "@salesforce/schema/Todo__c";
export default class TodoNewItem extends LightningElement {
    statusOptions = [
        { label: "New", value: "New" },
        { label: "In Progress", value: "In Progress" },
        { label: "Completed", value: "Completed" }
    ];

    priorityOptions = [
        { label: "High", value: "High" },
        { label: "Medium", value: "Medium" },
        { label: "Low", value: "Low" }
    ];

    priority = "";
    description = "";
    status = "New";
    isLoading = false;
    recordId = "";
    recordName = "";
    @track todoList = [];

    todoListCached;

    @wire(getTodoList)
    todoList2(value) {
        this.todoListCached = value;
        let { error, data } = value;
        if (data) {
            console.log("Data", data);
            this.todoList = JSON.parse(JSON.stringify(data));
            this.todoList.forEach((todoItem) => {
                todoItem.isCompleted = todoItem.Status__c === "Completed";
            });
        } else if (error) {
            console.error("Error:", error);
        }
    }

    refreshData() {
        refreshApex(this.todoListCached);
    }

    handleChange(event) {
        console.log("name " + event.target.name);
        console.log("value " + event.target.value);
        let value = event.target.value;
        let inputName = event.target.name;
        this[inputName] = value;
    }

    handleCreate() {
        let inputs = this.template.querySelectorAll(".inputs");
        let allInputsValid = true;
        for (let input of inputs) {
            allInputsValid = input.reportValidity() && allInputsValid;
        }

        if (!allInputsValid) {
            const evt = new ShowToastEvent({
                title: "Required fields are missing",
                message: "Please provide valid inputs",
                variant: "warning"
            });
            this.dispatchEvent(evt);
        } else {
            this.isLoading = true;
            let fields = {
                Status__c: this.status,
                Description__c: this.description,
                Priority__c: this.priority
            };

            let recordInput = {
                apiName: TODO.objectApiName,
                fields: fields
            };

            createRecord(recordInput)
                .then((todo) => {
                    console.log("todo item created successfully ", todo);

                    const evt = new ShowToastEvent({
                        title: "Success",
                        message: "Todo item created successfully",
                        variant: "success"
                    });
                    this.dispatchEvent(evt);

                    // refresh table data
                    this.refreshData();

                    this.handleClear();
                })
                .catch((error) => {
                    console.error("error", error);
                    const evt = new ShowToastEvent({
                        title: "Error",
                        message:
                            "error creating todo item =>" + error.body.message,
                        variant: "error"
                    });
                    this.dispatchEvent(evt);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }

    handleUpdate() {
        let inputs = this.template.querySelectorAll(".inputs");
        let allInputsValid = true;
        for (let input of inputs) {
            allInputsValid = input.reportValidity() && allInputsValid;
        }

        if (!allInputsValid) {
            const evt = new ShowToastEvent({
                title: "Required fields are missing",
                message: "Please provide valid inputs",
                variant: "warning"
            });
            this.dispatchEvent(evt);
        } else {
            this.isLoading = true;
            let fields = {
                Id: this.recordId,
                Status__c: this.status,
                Description__c: this.description,
                Priority__c: this.priority
            };

            let recordInput = {
                fields: fields
            };

            updateRecord(recordInput)
                .then((record) => {
                    const evt = new ShowToastEvent({
                        title: "Success",
                        message: "Todo item updated successfully",
                        variant: "success"
                    });
                    this.dispatchEvent(evt);

                    // refresh table data
                    this.refreshData();

                    this.handleClear();
                })
                .catch((error) => {
                    console.error("error", error);
                    const evt = new ShowToastEvent({
                        title: "Error",
                        message:
                            "error updating todo item =>" + error.body.message,
                        variant: "error"
                    });
                    this.dispatchEvent(evt);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }

    handleClear() {
        this.status = "New";
        this.priority = "";
        this.description = "";
        this.recordId = "";
        this.recordName = "";
    }

    handleEdit(event) {
        let recordId = event.target.dataset.id;
        console.log("record id is " + recordId);

        let recordToEdit = this.todoList.find((todo) => todo.Id === recordId);
        console.log("record to edit is ", recordToEdit);
        this.description = recordToEdit.Description__c;
        this.priority = recordToEdit.Priority__c;
        this.status = recordToEdit.Status__c;
        this.recordId = recordToEdit.Id;
        this.recordName = recordToEdit.Name;
    }

    handleDelete(event) {
        let recordId = event.target.dataset.id;
        this.isLoading = true;
        deleteRecord(recordId)
            .then(() => {
                const evt = new ShowToastEvent({
                    title: "Success",
                    message: "Todo item deleted successfully",
                    variant: "success"
                });
                this.dispatchEvent(evt);

                // refresh table data
                this.refreshData();
            })
            .catch((error) => {
                console.error("error", error);
                const evt = new ShowToastEvent({
                    title: "Error",
                    message: "error deleting todo item =>" + error.body.message,
                    variant: "error"
                });
                this.dispatchEvent(evt);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleMarkComplete(event) {
        let recordId = event.target.dataset.id;
        this.isLoading = true;

        let fields = {
            Id: recordId,
            Status__c: "Completed"
        };

        let recordInput = {
            fields: fields
        };

        updateRecord(recordInput)
            .then((record) => {
                const evt = new ShowToastEvent({
                    title: "Success",
                    message: "Todo item completed successfully",
                    variant: "success"
                });
                this.dispatchEvent(evt);

                // refresh table data
                this.refreshData();
            })
            .catch((error) => {
                console.error("error", error);
                const evt = new ShowToastEvent({
                    title: "Error",
                    message: "error updating todo item =>" + error.body.message,
                    variant: "error"
                });
                this.dispatchEvent(evt);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleRowChange(event) {
        let id = event.target.dataset.id;
        let record = this.todoList.find((todo) => todo.Id === id);

        let oldRecord = { ...record };
        // update field value, for example record.Description__c = event.target.value;
        // where the field names such as Description__c, status__c and priority__c are set dynamically.
        record[event.target.name] = event.target.value;

        console.log("old value" + oldRecord[event.target.name]);
        console.log("new value" + record[event.target.name]);
        console.table(this.todoList);
        // this.todoList = [...this.todoList];
    }

    handleChangeSelectAll(event) {
        this.template
            .querySelectorAll(".select")
            .forEach((item) => (item.checked = event.target.checked));
    }

    handleDeleteSelected() {
        let selected = Array.from(
            this.template.querySelectorAll(".select")
        ).filter((input) => input.checked === true);

        let ids = selected.map((item) => item.dataset.id);

        if (ids.length === 0) {
            const evt = new ShowToastEvent({
                title: "No records to delete",
                message: "Please select at least one item to delete",
                variant: "warning"
            });
            this.dispatchEvent(evt);
            return;
        }

        /* let deletePromises = [];
        ids.forEach((id) => deletePromises.push(deleteRecord(id))); */

        let deletePromises = ids.map((id) => deleteRecord(id));

        this.isLoading = true;
        Promise.all(deletePromises)
            .then((values) => {
                console.log(values);
                const evt = new ShowToastEvent({
                    title: "Success",
                    message: "Todo items deleted successfully",
                    variant: "success"
                });
                this.dispatchEvent(evt);

                // refresh table data
                this.refreshData();
            })
            .catch((error) => {
                console.error("error in promise.all", error);
                const evt = new ShowToastEvent({
                    title: "Error",
                    message: "error deleting todo items" + error.body.message,
                    variant: "error"
                });
                this.dispatchEvent(evt);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleUpdateSelected() {
        console.log("in handleUpdateSelected");
        let selected = Array.from(
            this.template.querySelectorAll(".select")
        ).filter((select) => select.checked === true);

        if (selected.length === 0) {
            const evt = new ShowToastEvent({
                title: "No records selected",
                message: "Please select at least one item to update",
                variant: "warning"
            });
            this.dispatchEvent(evt);
            return;
        }

        this.isLoading = true;
        let selectedIds = selected.map((select) => select.dataset.id);

        // get records to save from todoList.
        let recordsToSave = this.todoList.filter((todo) =>
            selectedIds.includes(todo.Id)
        );

        console.table(recordsToSave);

        let updatePromises = recordsToSave.map((record) =>
            updateRecord({
                fields: {
                    Id: record.Id,
                    Priority__c: record.Priority__c,
                    Description__c: record.Description__c,
                    Status__c: record.Status__c
                }
            })
        );

        Promise.all(updatePromises)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Updated Successfully",
                        message: "Records updated successfully!",
                        variant: "success"
                    })
                );

                this.template
                    .querySelectorAll(".select")
                    .forEach((item) => (item.checked = false));

                this.refreshData();
            })
            .catch((error) => {
                console.error("error in promise.all", error);
                const evt = new ShowToastEvent({
                    title: "Error",
                    message: "error updating todo items" + error.body.message,
                    variant: "error"
                });
                this.dispatchEvent(evt);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleUpdateSelectedApex() {
        console.log("in handleUpdateSelected");
        let selected = Array.from(
            this.template.querySelectorAll(".select")
        ).filter((select) => select.checked === true);

        if (selected.length === 0) {
            const evt = new ShowToastEvent({
                title: "No records selected",
                message: "Please select at least one item to update",
                variant: "warning"
            });
            this.dispatchEvent(evt);
            return;
        }

        this.isLoading = true;
        let selectedIds = selected.map((select) => select.dataset.id);

        // get records to save from todoList.
        let recordsToSave = this.todoList.filter((todo) =>
            selectedIds.includes(todo.Id)
        );

        /* // explanation of recordsToSave.map
        let recs = [];
        for (let rec of recordsToSave) {
            let newRec = {
                Id: rec.Id,
                Priority__c: rec.Priority__c,
                Description__c: rec.Description__c,
                Status__c: rec.Status__c
            };
            recs.push(newRec);
        }
        recordsToSave = recs; */

        recordsToSave = recordsToSave.map((record) => ({
            Id: record.Id,
            Priority__c: record.Priority__c,
            Description__c: record.Description__c,
            Status__c: record.Status__c
        }));

        updateRecords({
            todoList: recordsToSave
        })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Success",
                        message: "Records updated successfully",
                        variant: "success"
                    })
                );

                this.refreshData();

                this.template
                    .querySelectorAll(".select")
                    .forEach((item) => (item.checked = false));
            })
            .catch((error) => {
                console.error(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Failure",
                        message:
                            "Error while updating the records " + error.message,
                        variant: "error"
                    })
                );
            })
            .finally(() => {
                this.isLoading = false;
            });
    }
}
