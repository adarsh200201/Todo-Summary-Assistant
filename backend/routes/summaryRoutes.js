const express = require('express');
const router = express.Router();

// Fallback summary generator function when OpenAI API is unavailable
const generateFallbackSummary = (todos) => {
  // Count todos by priority
  const priorityCounts = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length
  };

  // Group todos with due dates
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(todayDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(todayDate);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const overdueItems = todos.filter(todo => todo.dueDate && new Date(todo.dueDate) < todayDate);
  const dueTodayItems = todos.filter(todo => {
    if (!todo.dueDate) return false;
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === todayDate.getTime();
  });
  const dueTomorrowItems = todos.filter(todo => {
    if (!todo.dueDate) return false;
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === tomorrow.getTime();
  });
  const dueThisWeekItems = todos.filter(todo => {
    if (!todo.dueDate) return false;
    const dueDate = new Date(todo.dueDate);
    return dueDate > tomorrow && dueDate <= nextWeek;
  });

  // Create summary sections
  let summary = `*Todo Summary*\n\n`;
  
  summary += `*Overview:*\n`;
  summary += `You have ${todos.length} pending tasks: ${priorityCounts.high} high priority, ${priorityCounts.medium} medium priority, and ${priorityCounts.low} low priority.\n\n`;
  
  if (overdueItems.length > 0) {
    summary += `*Overdue Tasks (${overdueItems.length}):*\n`;
    overdueItems.forEach(todo => {
      summary += `• ${todo.title}${todo.priority === 'high' ? ' (High Priority)' : ''}\n`;
    });
    summary += '\n';
  }
  
  if (dueTodayItems.length > 0) {
    summary += `*Due Today (${dueTodayItems.length}):*\n`;
    dueTodayItems.forEach(todo => {
      summary += `• ${todo.title}${todo.priority === 'high' ? ' (High Priority)' : ''}\n`;
    });
    summary += '\n';
  }
  
  if (dueTomorrowItems.length > 0) {
    summary += `*Due Tomorrow (${dueTomorrowItems.length}):*\n`;
    dueTomorrowItems.forEach(todo => {
      summary += `• ${todo.title}${todo.priority === 'high' ? ' (High Priority)' : ''}\n`;
    });
    summary += '\n';
  }
  
  if (dueThisWeekItems.length > 0) {
    summary += `*Due This Week (${dueThisWeekItems.length}):*\n`;
    dueThisWeekItems.forEach(todo => {
      summary += `• ${todo.title}${todo.priority === 'high' ? ' (High Priority)' : ''}\n`;
    });
    summary += '\n';
  }

  const otherItems = todos.filter(todo => !todo.dueDate);
  if (otherItems.length > 0) {
    summary += `*Other Tasks (${otherItems.length}):*\n`;
    otherItems.forEach(todo => {
      summary += `• ${todo.title}${todo.priority === 'high' ? ' (High Priority)' : ''}\n`;
    });
  }
  
  summary += '\n*Note: This summary was generated using the fallback system due to OpenAI API limitations.*';
  
  return summary;
};
const axios = require('axios');
const OpenAI = require('openai');
const Todo = require('../models/Todo');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST generate summary and send to Slack
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(`Generating summary for userId: ${userId || 'all users'}`);
    
    // Get incomplete todos, filtered by userId if provided
    const filter = { completed: false };
    if (userId) filter.userId = userId;
    
    const todos = await Todo.find(filter);
    
    if (todos.length === 0) {
      return res.status(400).json({ message: 'No pending todos to summarize' });
    }

    // Format todos for OpenAI prompt
    const todoList = todos.map((todo, index) => {
      return `${index + 1}. ${todo.title}${todo.description ? ` - ${todo.description}` : ''}${todo.priority ? ` (Priority: ${todo.priority})` : ''}${todo.dueDate ? ` (Due: ${new Date(todo.dueDate).toLocaleDateString()})` : ''}`;
    }).join('\n');

    // Generate summary using OpenAI
    let summary;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", 
            content: "You are a helpful assistant that creates concise yet informative summaries of todo lists. Group related items, identify priorities, and organize by urgency. Keep the summary professional and actionable."
          },
          {
            role: "user",
            content: `Please summarize the following list of pending todos:\n\n${todoList}`
          }
        ],
        max_tokens: 500
      });
      
      summary = completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Check for quota error
      if (error.error?.type === 'insufficient_quota' || error.code === 'insufficient_quota') {
        // Create a fallback summary without using OpenAI
        summary = generateFallbackSummary(todos);
      } else {
        throw error; // Re-throw other errors
      }
    }

    // Send to Slack
    const slackPayload = {
      text: "*Todo Summary*",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*📋 Todo Summary Assistant - Pending Tasks*"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: summary
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `_Generated on ${new Date().toLocaleString()}_`
            }
          ]
        }
      ]
    };

    await axios.post(process.env.SLACK_WEBHOOK_URL, slackPayload);

    res.json({ 
      success: true, 
      message: 'Summary generated and sent to Slack successfully',
      summary
    });
  } catch (err) {
    console.error('Error in summary generation or Slack posting:', err);
    res.status(500).json({ 
      message: 'Failed to generate summary or send to Slack',
      error: err.message 
    });
  }
});

module.exports = router;
