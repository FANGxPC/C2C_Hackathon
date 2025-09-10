import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize Supabase client with anon key for regular operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-984eea46/health", async (c) => {
  try {
    // Test KV store access
    await kv.set('health_test', { timestamp: new Date().toISOString() });
    const testData = await kv.get('health_test');
    
    return c.json({ 
      status: "ok", 
      kv_working: !!testData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.log('Health check error:', error);
    return c.json({ 
      status: "error", 
      kv_working: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Auth middleware to verify user
const requireAuth = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log('Auth header received:', authHeader ? 'Bearer token present' : 'No auth header');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid Authorization header' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      console.log('Auth verification failed:', error?.message || 'No user found');
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    console.log('Auth successful for user:', user.id, user.email);
    c.set('user', user);
    await next();
  } catch (error) {
    console.log('Auth middleware error:', error);
    return c.json({ error: 'Authorization failed' }, 401);
  }
};

// Sign up endpoint
app.post("/make-server-984eea46/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, fullName, university, major } = body;

    if (!email || !password || !fullName) {
      return c.json({ error: 'Missing required fields: email, password, fullName' }, 400);
    }

    // Create user with admin client
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        full_name: fullName,
        university: university || '',
        major: major || ''
      },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user profile data
    if (data.user) {
      await kv.set(`user_profile:${data.user.id}`, {
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        university: university || '',
        major: major || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    return c.json({ 
      user: data.user,
      message: 'User created successfully'
    });

  } catch (error) {
    console.log('Signup server error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile endpoint
app.get("/make-server-984eea46/auth/profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    console.log('Getting profile for user:', user.id, user.email);
    
    let profile = await kv.get(`user_profile:${user.id}`);
    console.log('Existing profile found:', !!profile);
    
    // If no profile exists, create one from user metadata
    if (!profile) {
      console.log('Creating new profile for user:', user.id);
      console.log('User metadata:', user.user_metadata);
      
      const now = new Date().toISOString();
      
      profile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        university: user.user_metadata?.university || '',
        major: user.user_metadata?.major || '',
        created_at: now,
        updated_at: now
      };
      
      console.log('Saving new profile:', profile);
      
      // Save the new profile
      await kv.set(`user_profile:${user.id}`, profile);
      console.log('Profile saved successfully');
    }

    return c.json({ profile });
  } catch (error) {
    console.log('Get profile error details:', error);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    return c.json({ error: `Failed to fetch profile: ${error.message}` }, 500);
  }
});

// Update user profile endpoint
app.put("/make-server-984eea46/auth/profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { full_name, university, major } = body;

    const existingProfile = await kv.get(`user_profile:${user.id}`);
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const updatedProfile = {
      ...existingProfile,
      full_name: full_name || existingProfile.full_name,
      university: university || existingProfile.university,
      major: major || existingProfile.major,
      updated_at: new Date().toISOString()
    };

    await kv.set(`user_profile:${user.id}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Helper function to generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Goals endpoints
// Get all goals for a user
app.get("/make-server-984eea46/goals", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const goals = await kv.getByPrefix(`goal:${user.id}:`);
    
    // Sort goals by creation date (newest first)
    const sortedGoals = goals.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return c.json({ goals: sortedGoals });
  } catch (error) {
    console.log('Get goals error:', error);
    return c.json({ error: 'Failed to fetch goals' }, 500);
  }
});

// Create a new goal
app.post("/make-server-984eea46/goals", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { title, description, category, priority, due_date, milestones } = body;

    if (!title || !category || !priority) {
      return c.json({ error: 'Missing required fields: title, category, priority' }, 400);
    }

    const goalId = generateId();
    const now = new Date().toISOString();

    const goal = {
      id: goalId,
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || '',
      category,
      priority,
      status: 'active',
      progress: 0,
      due_date: due_date || null,
      milestones: milestones || [],
      created_at: now,
      updated_at: now
    };

    await kv.set(`goal:${user.id}:${goalId}`, goal);

    return c.json({ goal }, 201);
  } catch (error) {
    console.log('Create goal error:', error);
    return c.json({ error: 'Failed to create goal' }, 500);
  }
});

// Get a specific goal
app.get("/make-server-984eea46/goals/:id", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const goalId = c.req.param('id');
    
    const goal = await kv.get(`goal:${user.id}:${goalId}`);
    
    if (!goal) {
      return c.json({ error: 'Goal not found' }, 404);
    }

    return c.json({ goal });
  } catch (error) {
    console.log('Get goal error:', error);
    return c.json({ error: 'Failed to fetch goal' }, 500);
  }
});

// Update a goal
app.put("/make-server-984eea46/goals/:id", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const goalId = c.req.param('id');
    const body = await c.req.json();

    const existingGoal = await kv.get(`goal:${user.id}:${goalId}`);
    if (!existingGoal) {
      return c.json({ error: 'Goal not found' }, 404);
    }

    const updatedGoal = {
      ...existingGoal,
      ...body,
      id: goalId, // Ensure ID doesn't change
      user_id: user.id, // Ensure user_id doesn't change
      updated_at: new Date().toISOString()
    };

    await kv.set(`goal:${user.id}:${goalId}`, updatedGoal);

    return c.json({ goal: updatedGoal });
  } catch (error) {
    console.log('Update goal error:', error);
    return c.json({ error: 'Failed to update goal' }, 500);
  }
});

// Delete a goal
app.delete("/make-server-984eea46/goals/:id", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const goalId = c.req.param('id');
    
    const goal = await kv.get(`goal:${user.id}:${goalId}`);
    if (!goal) {
      return c.json({ error: 'Goal not found' }, 404);
    }

    await kv.del(`goal:${user.id}:${goalId}`);

    return c.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.log('Delete goal error:', error);
    return c.json({ error: 'Failed to delete goal' }, 500);
  }
});

// Update goal progress
app.patch("/make-server-984eea46/goals/:id/progress", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const goalId = c.req.param('id');
    const body = await c.req.json();
    const { progress } = body;

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return c.json({ error: 'Progress must be a number between 0 and 100' }, 400);
    }

    const existingGoal = await kv.get(`goal:${user.id}:${goalId}`);
    if (!existingGoal) {
      return c.json({ error: 'Goal not found' }, 404);
    }

    const updatedGoal = {
      ...existingGoal,
      progress,
      status: progress === 100 ? 'completed' : 'active',
      updated_at: new Date().toISOString()
    };

    await kv.set(`goal:${user.id}:${goalId}`, updatedGoal);

    return c.json({ goal: updatedGoal });
  } catch (error) {
    console.log('Update goal progress error:', error);
    return c.json({ error: 'Failed to update goal progress' }, 500);
  }
});

// Chat endpoints
// Get all chat rooms for a user
app.get("/make-server-984eea46/chat/rooms", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    
    // Get all chat rooms where user is a participant
    const allRooms = await kv.getByPrefix('chat_room:');
    const userRooms = allRooms.filter(room => 
      room.participants && room.participants.includes(user.id)
    );

    // Sort by last activity
    const sortedRooms = userRooms.sort((a, b) => 
      new Date(b.last_activity || b.created_at).getTime() - 
      new Date(a.last_activity || a.created_at).getTime()
    );

    return c.json({ rooms: sortedRooms });
  } catch (error) {
    console.log('Get chat rooms error:', error);
    return c.json({ error: 'Failed to fetch chat rooms' }, 500);
  }
});

// Create a chat room (or get existing direct message room)
app.post("/make-server-984eea46/chat/rooms", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { type, name, participants } = body;

    if (!type || !participants || !Array.isArray(participants)) {
      return c.json({ error: 'Missing required fields: type, participants' }, 400);
    }

    // Add current user to participants if not already included
    const allParticipants = [...new Set([user.id, ...participants])];

    // For direct messages, check if room already exists
    if (type === 'direct' && allParticipants.length === 2) {
      const existingRooms = await kv.getByPrefix('chat_room:');
      const existingRoom = existingRooms.find(room => 
        room.type === 'direct' && 
        room.participants.length === 2 &&
        room.participants.every(p => allParticipants.includes(p))
      );

      if (existingRoom) {
        return c.json({ room: existingRoom });
      }
    }

    const roomId = generateId();
    const now = new Date().toISOString();

    const room = {
      id: roomId,
      type, // 'direct' or 'group'
      name: name || (type === 'direct' ? null : `Room ${roomId}`),
      participants: allParticipants,
      created_by: user.id,
      created_at: now,
      last_activity: now,
      message_count: 0
    };

    await kv.set(`chat_room:${roomId}`, room);

    return c.json({ room }, 201);
  } catch (error) {
    console.log('Create chat room error:', error);
    return c.json({ error: 'Failed to create chat room' }, 500);
  }
});

// Get messages for a chat room
app.get("/make-server-984eea46/chat/rooms/:roomId/messages", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const roomId = c.req.param('roomId');
    const limit = parseInt(c.req.query('limit') || '50');
    const before = c.req.query('before'); // For pagination

    // Check if user has access to this room
    const room = await kv.get(`chat_room:${roomId}`);
    if (!room || !room.participants.includes(user.id)) {
      return c.json({ error: 'Room not found or access denied' }, 404);
    }

    // Get messages for this room
    const allMessages = await kv.getByPrefix(`chat_message:${roomId}:`);
    
    // Sort by timestamp (newest first)
    let sortedMessages = allMessages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply pagination if before timestamp is provided
    if (before) {
      sortedMessages = sortedMessages.filter(msg => 
        new Date(msg.timestamp).getTime() < new Date(before).getTime()
      );
    }

    // Limit results
    const messages = sortedMessages.slice(0, limit);

    return c.json({ messages: messages.reverse() }); // Return in chronological order
  } catch (error) {
    console.log('Get chat messages error:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

// Send a message to a chat room
app.post("/make-server-984eea46/chat/rooms/:roomId/messages", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const roomId = c.req.param('roomId');
    const body = await c.req.json();
    const { content, type = 'text' } = body;

    if (!content || content.trim() === '') {
      return c.json({ error: 'Message content is required' }, 400);
    }

    // Check if user has access to this room
    const room = await kv.get(`chat_room:${roomId}`);
    if (!room || !room.participants.includes(user.id)) {
      return c.json({ error: 'Room not found or access denied' }, 404);
    }

    const messageId = generateId();
    const now = new Date().toISOString();

    const message = {
      id: messageId,
      room_id: roomId,
      user_id: user.id,
      content: content.trim(),
      type, // 'text', 'image', 'file', etc.
      timestamp: now,
      edited: false,
      edited_at: null
    };

    // Save the message
    await kv.set(`chat_message:${roomId}:${messageId}`, message);

    // Update room's last activity and message count
    const updatedRoom = {
      ...room,
      last_activity: now,
      message_count: (room.message_count || 0) + 1
    };
    await kv.set(`chat_room:${roomId}`, updatedRoom);

    return c.json({ message }, 201);
  } catch (error) {
    console.log('Send message error:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Get user profile for chat (lightweight version)
app.get("/make-server-984eea46/chat/users/:userId", requireAuth, async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const profile = await kv.get(`user_profile:${userId}`);
    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Return only necessary chat info
    const chatProfile = {
      id: profile.id,
      full_name: profile.full_name,
      university: profile.university,
      major: profile.major
    };

    return c.json({ user: chatProfile });
  } catch (error) {
    console.log('Get chat user error:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Search users for starting new chats
app.get("/make-server-984eea46/chat/users/search", requireAuth, async (c) => {
  try {
    const query = c.req.query('q')?.toLowerCase() || '';
    
    if (query.length < 2) {
      return c.json({ users: [] });
    }

    // Get all user profiles
    const allProfiles = await kv.getByPrefix('user_profile:');
    
    // Filter by name or university (simple search)
    const matchingUsers = allProfiles
      .filter(profile => 
        profile.full_name?.toLowerCase().includes(query) ||
        profile.university?.toLowerCase().includes(query) ||
        profile.major?.toLowerCase().includes(query)
      )
      .slice(0, 10) // Limit results
      .map(profile => ({
        id: profile.id,
        full_name: profile.full_name,
        university: profile.university,
        major: profile.major
      }));

    return c.json({ users: matchingUsers });
  } catch (error) {
    console.log('Search users error:', error);
    return c.json({ error: 'Failed to search users' }, 500);
  }
});

Deno.serve(app.fetch);