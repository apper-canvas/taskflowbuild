import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
    
    // Define updateable fields only (visibility: "Updateable")
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'title', 'description', 'priority', 
      'due_date', 'category', 'completed', 'created_at', 'updated_at'
    ];
    
    // All fields for fetching (including System and ReadOnly)
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 
      'ModifiedBy', 'title', 'description', 'priority', 'due_date', 
      'category', 'completed', 'created_at', 'updated_at'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "created_at",
            SortType: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error("Failed to fetch task");
      return null;
    }
  }

  async create(taskData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (taskData.hasOwnProperty(field) || this.mapUIFieldToDB(field, taskData)) {
          const dbField = field;
          const uiValue = this.getUIValue(field, taskData);
          if (uiValue !== undefined) {
            filteredData[dbField] = this.formatFieldValue(field, uiValue);
          }
        }
      });

      const params = {
        records: [filteredData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      return null;
    }
  }

  async update(id, updates) {
    try {
      // Filter to only include updateable fields
      const filteredUpdates = { Id: id };
      this.updateableFields.forEach(field => {
        if (updates.hasOwnProperty(field) || this.mapUIFieldToDB(field, updates)) {
          const uiValue = this.getUIValue(field, updates);
          if (uiValue !== undefined) {
            filteredUpdates[field] = this.formatFieldValue(field, uiValue);
          }
        }
      });

      const params = {
        records: [filteredUpdates]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  }

  // Helper method to map UI field names to database field names
  mapUIFieldToDB(dbField, data) {
    const mapping = {
      'title': 'title',
      'description': 'description', 
      'priority': 'priority',
      'due_date': 'dueDate',
      'category': 'category',
      'completed': 'completed',
      'Tags': 'tags'
    };
    
    const uiField = Object.keys(mapping).find(key => mapping[key] === dbField);
    return uiField && data.hasOwnProperty(mapping[uiField]);
  }

  // Helper method to get UI value
  getUIValue(dbField, data) {
    const mapping = {
      'title': 'title',
      'description': 'description',
      'priority': 'priority', 
      'due_date': 'dueDate',
      'category': 'category',
      'completed': 'completed',
      'Tags': 'tags'
    };
    
    if (data.hasOwnProperty(dbField)) {
      return data[dbField];
    }
    
    const uiField = Object.keys(mapping).find(key => mapping[key] === dbField);
    return uiField ? data[mapping[uiField]] : data[dbField];
  }

  // Helper method to format field values according to database requirements
  formatFieldValue(fieldName, value) {
    switch(fieldName) {
      case 'due_date':
        return value; // Date format YYYY-MM-DD
      case 'completed':
        return Boolean(value); // Boolean type
      case 'Tags':
        return Array.isArray(value) ? value.join(',') : value; // Tag type (comma-separated)
      case 'priority':
        return String(value); // Picklist type
      case 'category':
        return String(value); // Text type for now (could be Lookup later)
      default:
        return value;
    }
  }
}

export default new TaskService();