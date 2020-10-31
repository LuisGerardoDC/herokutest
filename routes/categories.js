const express = require('express');
const CategoriesServices = require('../services/categories');

const categoriesApi = (app) => {
  const router = express.Router()
  app.use('/api/categories', router);

  const categoriesServices = new CategoriesServices();

  router.get('/', async (req, res, next) => {
    try {
      const categories = await categoriesServices.getCategories();
      res.status(200).json({
        data: categories,
        message: 'categories listed'
      })
    } catch (error) {
      next(error);
    }
  })

  router.get('/:name', async (req, res, next) => {
    try {
      const { name } = req.params;
      const category = await categoriesServices.getCategoryByName(name);
      res.status(200).json({
        data: category,
        message: 'category listed'
      })
    } catch (error) {
      next(error);
    }
  })

  router.post('/:name', async (req, res, next) => {
    try {
      const { name } = req.params;
      const createIdCategory = await categoriesServices.createCategory(name);
      res.status(201).json({
        data: createIdCategory,
        message: 'category created'
      })
    } catch (error) {
      next(error);
    }
  })

  router.patch('/:name', async (req, res, next) => {
    try {
      const { name } = req.params;
      const { newCategoryName } = req.body;
      const updateCategoryId = await categoriesServices.updateCategory(name, newCategoryName);
      res.status(200).json({
        data: updateCategoryId,
        message: 'category updated'
      })
    } catch (error) {
      next(error);
    }
  })

  router.delete('/:name', async (req, res, next) => {
    try {
      const { name } = req.params;
      const deleteCategoryId = await categoriesServices.deleteCategory(name);
      res.status(200).json({
        data: deleteCategoryId,
        message: 'category deleted'
      })
    } catch (error) {
      next(error);
    }
  })

}

module.exports = categoriesApi;