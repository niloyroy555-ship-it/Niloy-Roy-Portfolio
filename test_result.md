#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Premium portfolio website for AI Visual Designer / Motion Designer / Video Editor (Niloy Roy). Cinematic, minimal, monochrome + electric-blue accent, with mind-bending Framer Motion / Lenis / Canvas particle interactions. Sections: Hero, Marquee, Portfolio (case-study modals), About, Experience timeline, Contact form, Footer."

backend:
  - task: "Contact form API (POST /api/contact, GET /api/contact)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Added POST /api/contact (validates name/email/message, stores in 'contacts' collection with uuid, returns cleaned object) and GET /api/contact (lists, sorted desc, _id stripped). Uses MONGO_URL + DB_NAME env. Needs testing for validation, persistence, and error handling."
        -working: true
        -agent: "testing"
        -comment: "Backend testing complete. All 6 tests passed: (1) GET /api/root returns {message:'Hello World'} ✓ (2) POST /api/contact with valid data returns 200 with {success:true, contact:{id(UUID), name, email, message, createdAt}} and NO _id field ✓ (3) POST with missing field returns 400 with error ✓ (4) POST with empty strings returns 400 with error ✓ (5) GET /api/contact returns array with all required fields, NO _id, sorted by createdAt descending ✓ (6) Persistence verified - contact created via POST is retrievable via GET ✓. Contact API is fully functional."

frontend:
  - task: "Portfolio landing experience (hero, particles, morphing role, marquee, portfolio grid, project modal, about, timeline, contact, footer)"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Full site built. Verified via screenshots: hero renders with particles + morphing role, portfolio cards render (image + video posters via ffmpeg), project modal opens with cinematic expand. Frontend testing pending explicit user approval."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "Contact form API (POST /api/contact, GET /api/contact)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    -agent: "main"
    -message: "Please test the backend contact API only. Endpoints: POST /api/contact with JSON {name,email,message} should return {success:true, contact:{...}} and persist to Mongo 'contacts' collection; missing fields should return 400. GET /api/contact should return an array of contacts (no _id). Do not test frontend."
    -agent: "testing"
    -message: "Backend Contact API testing completed successfully. All 6 test cases passed including: root endpoint sanity check, POST with valid data (UUID id, no _id field), POST validation (missing fields & empty strings return 400), GET endpoint (array response, no _id, sorted descending), and persistence verification. The Contact API is fully functional and ready for production use."
