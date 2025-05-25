# Todo Summary Assistant

A modern, full-stack MERN application that helps you manage your todos with priority levels and due dates, generate AI summaries using OpenAI, and send them directly to Slack.

## Features

- **Todo Management**
  - Create, read, update, and delete todo items
  - Set priority levels (low, medium, high) with visual indicators
  - Add due dates with natural language display (Today, Tomorrow, Overdue)
  - Visual indicators for overdue tasks

- **AI-Powered Summaries**
  - Generate concise summaries of your tasks using OpenAI's API
  - Robust fallback summary generation when API quota is exceeded
  - Send summaries directly to Slack with one click

- **Advanced Filtering & Sorting**
  - Filter by status (All, Active, Completed)
  - Sort by creation date, priority, or due date
  - Task statistics and progress tracking

- **Modern UI**
  - Clean, responsive design with a consistent color scheme
  - Intuitive user interface with visual feedback
  - Priority badges and due date indicators

## Tech Stack

- **Frontend**: React, React Router, Axios, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **External APIs**: OpenAI, Slack Webhooks

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key
- Slack Incoming Webhook URL

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/todo-summary-assistant.git
   cd todo-summary-assistant
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Slack Setup Guide

1. Go to [Slack API Apps](https://api.slack.com/apps) and click "Create New App"
2. Choose "From scratch" and give your app a name and workspace
3. In the sidebar, click on "Incoming Webhooks" and toggle "Activate Incoming Webhooks" to On
4. Click "Add New Webhook to Workspace" at the bottom
5. Choose the channel where you want the summaries to be posted
6. Copy the Webhook URL provided and add it to your `.env` file as `SLACK_WEBHOOK_URL`

## OpenAI Setup Guide

1. Create an account at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to the [API keys section](https://platform.openai.com/account/api-keys)
3. Create a new API key
4. Copy the API key and add it to your `.env` file as `OPENAI_API_KEY`

## Architecture Decisions

- **Separation of Concerns**: Frontend and backend are completely separate, communicating via REST API
- **State Management**: Using React's Context API for managing application state
- **Authentication**: (Optional) JWT-based authentication can be added
- **Error Handling**: Comprehensive error handling on both frontend and backend
- **API Design**: RESTful API design with clear endpoint structure
- **LLM Integration**: Using OpenAI's GPT model for generating meaningful summaries
- **Responsive Design**: Mobile-first approach for better user experience

## API Endpoints

- **GET /api/todos**: Get all todos
- **POST /api/todos**: Create a new todo
- **PUT /api/todos/:id**: Update a todo
- **DELETE /api/todos/:id**: Delete a todo
- **POST /api/summarize**: Generate summary of pending todos and send to Slack
