const Category = require('../models/category');


async function handleGetAllCategories(req, res) {
  try {
    const category = await Category.find({});
    return res.json(category);

  } catch (error) {
    console.error("Error category:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleCreateNewCategory(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ msg: "All fields are required..." });
    }

    const newCategory = new Category({
      name, 
      description
    });

    const result = await newCategory.save();

    return res.status(201).json({
      msg: "Category created successfully",
      tag: {
        id: result._id,
        name: result.name
      }
    });
  } catch (error) {
    console.error("Error Category:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleGetCategoryUinsgId(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    return res.json(category);
  }
  catch (error) {
    console.error("Error Category:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleUpdateCategoryUsingId(req, res) {
  try {
    const category = req.body;
    await Category.findByIdAndUpdate(req.params.id, category);
    return res.json({ status: "success" });
  } catch (error) {
    console.error("Error Category:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleDeleteCategoryUsingId(req, res) {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.json({ status: "success", message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error Category:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}


module.exports = {
  handleGetAllCategories,
  handleCreateNewCategory,
  handleGetCategoryUinsgId,
  handleUpdateCategoryUsingId,
  handleDeleteCategoryUsingId
}