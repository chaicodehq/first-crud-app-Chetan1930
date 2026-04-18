import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    const { title, completed, priority, tags, dueDate } = req.body;
    const todo = await Todo.create({ title, completed, priority, tags, dueDate });
    res.status(201).json({
      _id: todo._id,
      title: todo.title,
      completed: todo.completed,
      priority: todo.priority,
      tags: todo.tags,
      dueDate: todo.dueDate,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    const { page, limit, completed, priority, search } = req.query;
    const query = {};
    if (completed !== undefined && completed !== "") {
      query.completed = String(completed).toLowerCase() === "true";
    }
    if (priority) {
      query.priority = priority;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    const pageNumber = Number.parseInt(String(page ?? "1"), 10) || 1;
    const limitNumber = Number.parseInt(String(limit ?? "10"), 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const total = await Todo.countDocuments(query);
    const pages = Math.ceil(total / limitNumber);
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);
    res.json({
      data: todos,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    // Your code here
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }
    res.json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    // Your code here
    const { id } = req.params;
    const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }
    res.json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
