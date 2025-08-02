const Tag = require('../models/tag');


async function handleGetAllTags(req, res) {
  try {
    const tags = await Tag.find({});
    return res.json(tags);

  } catch (error) {
    console.error("Error Tag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleCreateNewTag(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Tag name is required." });
    }

    // ✅ Check if tag already exists
    const existingTag = await Tag.findOne({ name: name.trim() });

    if (existingTag) {
      return res.status(200).json({
        msg: "Tag already exists",
        tag: {
          id: existingTag._id,
          name: existingTag.name
        }
      });
    }

    // ✅ Create new tag
    const newTag = new Tag({ name: name.trim() });
    const result = await newTag.save();

    return res.status(201).json({
      msg: "Tag created successfully",
      tag: {
        id: result._id,
        name: result.name
      }
    });

  } catch (error) {
    console.error("Error Tag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}


async function handleGetTagUinsgId(req, res) {
  try {
    const tag = await Tag.findById(req.params.id);
    return res.json(tag);
  }
  catch (error) {
    console.error("Error Tag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleUpdateTagUsingId(req, res) {
  try {
    const tag = req.body;
    await Tag.findByIdAndUpdate(req.params.id, tag);
    return res.json({ status: "success" });
  } catch (error) {
    console.error("Error Tag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleDeleteTagUsingId(req, res) {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    return res.json({ status: "success", message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error Tag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}


module.exports = {
  handleGetAllTags,
  handleCreateNewTag,
  handleGetTagUinsgId,
  handleUpdateTagUsingId,
  handleDeleteTagUsingId
}