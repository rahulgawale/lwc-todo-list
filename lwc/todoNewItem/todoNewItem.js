import { LightningElement, wire } from 'lwc';
import { createRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getTodoList from '@salesforce/apex/TodoListController.getTodoList';

import TODO from "@salesforce/schema/Todo__c";
export default class TodoNewItem extends LightningElement {

    statusOptions = [
        {label: 'New', value: 'New'},
        {label: 'In Progress', value: 'In Progress'},
        {label: 'Completed', value: 'Completed'}
    ];
    
    priorityOptions = [
        {label: "High", value: 'High'},
        {label:"Medium", value: 'Medium'},
        {label: "Low", value: 'Low'}
    ];

    priority = ''
    description = ''
    status = 'New'
    isLoading = false;
    recordId = '';
    recordName = '';
    todoList = [];

    @wire(getTodoList)
    todoList({ error, data }) {
      if (data) {
        console.log('Data', data);
        this.todoList = data;
      } else if (error) {
        console.error('Error:', error);
      }
    }
    
    handleChange(event){
        console.log('name ' + event.target.name);
        console.log('value ' + event.target.value);
        let value = event.target.value;
        let inputName = event.target.name;
        this[inputName] = value;
    }

    handleCreate(){

        let inputs = this.template.querySelectorAll('.inputs');
        let allInputsValid = true;
        for(let input of inputs){
            allInputsValid = input.reportValidity() && allInputsValid;
        }
        
        if(!allInputsValid){
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
                Priority__c: this.priority,
            }
    
            let recordInput = {
                apiName: TODO.objectApiName,
                fields: fields
            }
    
            createRecord(recordInput)
                .then((todo) => {
                    console.log('todo item created successfully ',todo)
    
                    const evt = new ShowToastEvent({
                        title: "Success",
                        message: "Todo item created successfully",
                        variant: "success"
                    });
                    this.dispatchEvent(evt);
    
                    this.handleClear();
                })
                .catch((error) => {
                    console.error('error', error)
                    const evt = new ShowToastEvent({
                        title: "Error",
                        message: "error creating todo item =>" + error.body.message,
                        variant: "error"
                    });
                    this.dispatchEvent(evt);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }    
    }

    handleUpdate(){
        let inputs = this.template.querySelectorAll('.inputs');
        let allInputsValid = true;
        for(let input of inputs){
            allInputsValid = input.reportValidity() && allInputsValid;
        }

        if(!allInputsValid){
            const evt = new ShowToastEvent({
                title: "Required fields are missing",
                message: "Please provide valid inputs",
                variant: "warning"
            });
            this.dispatchEvent(evt);
        } else {
            this.isLoading = true;
        }
    }
    
    handleClear(){
        this.status = 'New';
        this.priority = '';
        this.description = '';
        this.recordId = '';
        this.recordName = '';
    }

    handleEdit(event){
        let recordId = event.target.dataset.id;
        console.log("record id is " + recordId);

        let recordToEdit = this.todoList.find(todo => todo.Id === recordId);
        console.log("record to edit is " , recordToEdit);
        this.description = recordToEdit.Description__c;
        this.priority = recordToEdit.Priority__c;
        this.status = recordToEdit.Status__c;
        this.recordId = recordToEdit.Id;
        this.recordName = recordToEdit.Name;
    }
}