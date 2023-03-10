public with sharing class TodoListController {
    @AuraEnabled(cacheable=true)
    public static List<Todo__c> getTodoList() {
        return [
            SELECT Name, Priority__c, Status__c, Description__c
            FROM Todo__c
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static void updateRecords(List<Todo__c> todoList) {
        try {
            update todoList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
