import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category';
    
    // Define updateable fields only (visibility: "Updateable")
    this.updateableFields = ['Name', 'Tags', 'Owner', 'color', 'icon'];
    
    // All fields for fetching (including System and ReadOnly)
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'color', 'icon'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "Name",
            SortType: "ASC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI format
      const categories = (response.data || []).map(category => ({
        id: category.Id,
        name: category.Name,
        color: category.color,
        icon: category.icon,
        tags: category.Tags
      }));
      
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
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
      
      if (!response.data) return null;
      
      // Map database fields to UI format
      const category = {
        id: response.data.Id,
        name: response.data.Name,
        color: response.data.color,
        icon: response.data.icon,
        tags: response.data.Tags
      };
      
      return category;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      toast.error("Failed to fetch category");
      return null;
    }
  }

  async create(categoryData) {
    try {
      // Map UI data to database fields and filter to only updateable fields
      const filteredData = {};
      
      if (categoryData.name) filteredData.Name = String(categoryData.name);
      if (categoryData.color) filteredData.color = String(categoryData.color);
      if (categoryData.icon) filteredData.icon = String(categoryData.icon);
      if (categoryData.tags) {
        filteredData.Tags = Array.isArray(categoryData.tags) 
          ? categoryData.tags.join(',') 
          : String(categoryData.tags);
      }

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
          const data = successfulRecords[0].data;
          return {
            id: data.Id,
            name: data.Name,
            color: data.color,
            icon: data.icon,
            tags: data.Tags
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
      return null;
    }
  }

  async update(id, updates) {
    try {
      // Map UI updates to database fields and filter to only updateable fields
      const filteredUpdates = { Id: id };
      
      if (updates.name !== undefined) filteredUpdates.Name = String(updates.name);
      if (updates.color !== undefined) filteredUpdates.color = String(updates.color);
      if (updates.icon !== undefined) filteredUpdates.icon = String(updates.icon);
      if (updates.tags !== undefined) {
        filteredUpdates.Tags = Array.isArray(updates.tags) 
          ? updates.tags.join(',') 
          : String(updates.tags);
      }

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
          const data = successfulUpdates[0].data;
          return {
            id: data.Id,
            name: data.Name,
            color: data.color,
            icon: data.icon,
            tags: data.Tags
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
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
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
      return false;
    }
  }
}

export default new CategoryService();