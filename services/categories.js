const MongoLib = require('../lib/mongo');

class CategoriesServices {

  constructor(){
    this.collection = 'categories';
    this.mongoDB = new MongoLib()
  }

  async getCategories(){
    try {
      const categories = await this.mongoDB.getAll(this.collection);
      return categories;
    } catch (error) {
      console.error(error);
    }
  }

  async getCategoryByName(categoryName){
    try {
      const query = { name: categoryName };
      const category = await this.mongoDB.getAll(this.collection, query);
      return category;
    } catch (error) {
      console.error(error);
    }
  }

  async createCategory(categoryName){
    try {
      const createCategoryId = await this.mongoDB.create(this.collection, { 
        name: categoryName 
      });
      return createCategoryId
    } catch (error) {
      console.error(error);
    }
  }

  async updateCategory(categoryName, newCategoryName){
    const data = { name: newCategoryName };
    try {
      const category = await this.getCategoryByName(categoryName)
      const categoryId = category[0]._id;
      const updateCategoryId = await this.mongoDB.update(this.collection, categoryId, data);
      return updateCategoryId
    } catch (error) {
      console.error(error);
    }
  }

  async deleteCategory(categoryName){
    try {
      const category = await this.getCategoryByName(categoryName)
      const categoryId = category[0]._id;
      const deleteCategoryId = await this.mongoDB.delete(this.collection, categoryId);
      return deleteCategoryId
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = CategoriesServices;
