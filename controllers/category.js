const Category = require("../models/category");
const slugify = require("slugify");

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

      console.log(`---------------------------------------------------------------------`)
      console.log(`Name: ${name}, Description ${description}`)
      console.log(`---------------------------------------------------------------------`)
      return res.status(400).json({ msg: "All fields are required..." });
    }

    // ✅ Check if the category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });

    if (existingCategory) {
      return res.status(200).json({
        msg: "Category already exists",
        category: {
          id: existingCategory._id,
          name: existingCategory.name,
        },
      });
    }

    // ✅ Create new category
    const newCategory = new Category({
      name: name.trim(),
      description: description.trim(),
      slug: slugify(name, { lower: true, strict: true })
    });

    const result = await newCategory.save();

    return res.status(201).json({
      msg: "Category created successfully",
      category: {
        id: result._id,
        name: result.name,
      },
    });
  } catch (error) {
    console.error("Error Category:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleGetCategoryUinsgId(req, res) {
  try {
    const slug = req.params.id;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
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
    return res.json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error Category:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

const handleUpdateSlug = async (req, res) => {
  try {
    // get only name and slug fields
    const categories = await Category.find(
      {},
      { _id: 1, name: 1, slug: 1 }
    ).lean();

    const existingSlugs = new Set(categories.map((c) => c.slug));
    const updatedSlugs = new Set();

    const ops = [];

    for (const category of categories) {
      // generate slug from category.name
      const base = slugify(category.name, { lower: true, strict: true });
      let slug = base;
      let i = 1;

      // ensure uniqueness
      while (existingSlugs.has(slug) || updatedSlugs.has(slug)) {
        slug = `${base}-${i++}`;
      }

      // only update if slug has changed
      if (slug !== category.slug) {
        updatedSlugs.add(slug);
        ops.push({
          updateOne: {
            filter: { _id: category._id },
            update: { $set: { slug } },
          },
        });
      }
    }

    if (ops.length) await Category.bulkWrite(ops);

    res.status(200).json({
      updated: ops.length,
      message: "Slugs updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Slug update failed", details: err.message });
  }
};

module.exports = {
  handleGetAllCategories,
  handleCreateNewCategory,
  handleGetCategoryUinsgId,
  handleUpdateCategoryUsingId,
  handleDeleteCategoryUsingId,
  handleUpdateSlug,
};
