public with sharing class TodoListController {
    @AuraEnabled(cacheable=true)
    public static List<Todo__c> getTodoList(){
        return [SELECT Name, Priority__c, Status__c, Description__c FROM Todo__c];
    }
}