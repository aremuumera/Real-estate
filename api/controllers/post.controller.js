import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Controller function to get posts based on query parameters
export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    // Query posts based on optional parameters like city, type, property, bedroom, and price range
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    // Respond with the retrieved posts
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};


// Controller function to get a single post by ID
export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    // Find the post by ID and include related data like post details and user info
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Return a 404 error if post is not found
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if a token exists in cookies
    const token = req.cookies?.token;
    let isSaved = false;

    // Verify token and check if the post is saved by the user
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          isSaved = saved ? true : false;
        }
        // Respond with post data and whether it is saved by the user
        res.status(200).json({ ...post, isSaved });
      });
    } else {
      // Respond with post data and whether it is saved by the user
      res.status(200).json({ ...post, isSaved });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};


// Controller function to create a new post
export const createPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId; // Get the user ID from the token

  try {
    // Create a new post with associated post details
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId, // Set the user ID as the creator of the post
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    // Respond with the newly created post
    res.status(201).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};


// Controller function to update an existing post by ID
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  try {
    // Update the post with new title and description
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        description,
      },
    });
    // Respond with the updated post
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to update post" });
  }
};


// Controller function to delete a post by ID
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; // Get the user ID from the token

  try {
    // Find the post by ID to check ownership
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    // If the current user does not own the post, return a 403 error
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id },
    });

    // Respond with success message
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};
