# Deployment Assignment To-Do Plan
# The POST /api/create-answer endpoint expects a JSON body and a Content-Type: application/json header. 

## Phase A: Backend Preparation (Local Development)
**Goal:** Modify the existing backend to meet the new assignment's API endpoint requirements.

- [x] **P-A1: Update State Management (`backend/src/state.ts`)**
  - [x] P-A1-S1: Add a new state variable to store the latest "answer" string.
  - [x] P-A1-S2: Implement `setLatestAnswer(answer: string)` function.
  - [x] P-A1-S3: Implement `getLatestAnswer(): string | null` function.

- [x] **P-A2: Implement New API Endpoints (`backend/src/routes/apiRoutes.ts`)**
  - [x] P-A2-S1: Create `POST /api/create-answer` endpoint.  
    *Details:* Accepts JSON body `{ "data": "string" }`. Calls `state.setLatestAnswer()` with the received data. Returns 201 status with success message. Includes input validation for `data` field.
  - [x] P-A2-S2: Create `GET /api/get-latest-answer` endpoint.  
    *Details:* Calls `state.getLatestAnswer()`. Returns 200 status with JSON body `{ "latestAnswer": string | null }`.

- [x] **P-A3: Local Backend Testing**
  - [x] P-A3-S1: Test `POST /api/create-answer` using Postman (send data, verify 201 response, check backend logs).
  - [x] P-A3-S2: Test `GET /api/get-latest-answer` using Postman (verify it returns the data sent in P-A3-S1).
  - [x] P-A3-S3: Send a new value to `POST /api/create-answer` and re-test `GET /api/get-latest-answer` to confirm it updates.

---

## Phase B: Frontend Preparation (Local Development)
**Goal:** Modify the existing React frontend to display the data from the new backend endpoint.

- [x] **P-B1: Update API Service (`frontend/src/services/api.ts`)**
  - [x] P-B1-S1: Add `fetchLatestAnswer()` function to call `GET /api/get-latest-answer`.

- [x] **P-B2: Create Answer Display Component (`frontend/src/components/AnswerDisplay.tsx`)**
  - [x] P-B2-S1: Create a new React functional component.
  - [x] P-B2-S2: Implement `useEffect` to call `fetchLatestAnswer()` on mount.
  - [x] P-B2-S3: Implement state for `answer`, `isLoading`, `error`.
  - [x] P-B2-S4: Render loading message, error message, or the fetched answer.
  - [x] P-B2-S5: Ensure the answer is displayed within `<span id="answer">...</span>`.

- [x] **P-B3: Integrate Component (`frontend/src/App.tsx` or Router)**
  - [x] P-B3-S1: Add `AnswerDisplay` component to `App.tsx` (or create a new route for it if using React Router).

- [x] **P-B4: Local Frontend Testing**
  - [x] P-B4-S1: Run both local backend and frontend dev servers.
  - [x] P-B4-S2: Verify the frontend page loads and displays the current "latestAnswer" from the backend.
  - [x] P-B4-S3: Use Postman to send new data to `POST /api/create-answer` on the local backend. Verify the frontend page updates (either on refresh or via polling).

- [x] **P-B5: Git: Commit Frontend Changes**
  - [x] P-B5-S1: Create a new feature branch (e.g., `feature/deployment-assignment-frontend`).
  - [x] P-B5-S2: Commit changes to `api.ts`, `AnswerDisplay.tsx`, and `App.tsx`.

---

## Phase C: AWS EC2 Deployment & Configuration
**Goal:** Deploy the modified backend and frontend to a live EC2 instance.  
_Reference provided: `aws-deployment-guide.md`_

- [x] **P-C1: Prepare EC2 Instance**
  - [x] P-C1-S1: Create AWS Account (if not already done).
  - [x] P-C1-S2: Launch EC2 Instance (Amazon Linux 2023, t2.micro, new key pair).
  - [x] P-C1-S3: Configure initial EC2 Security Group (Allow SSH, HTTP, HTTPS from Anywhere for setup).
  - [x] P-C1-S4: Connect to EC2 instance (e.g., via EC2 Instance Connect).
  - [x] P-C1-S5: Install required software on EC2 (`dnf update`, `nodejs`, `git`, `pm2`).

- [x] **P-C2: Deploy Code to EC2**
  - [x] P-C2-S1: Merge `feature/deployment-assignment-backend` and `feature/deployment-assignment-frontend` into your main development branch (e.g., `develop` or `main`) and push.
  - [x] P-C2-S2: Clone the repository onto the EC2 instance (`git clone ...`).
  - [x] P-C2-S3: Install backend dependencies on EC2 (`cd backend && npm install --production`).
  - [x] P-C2-S4: Install frontend dependencies and build on EC2 (`cd frontend && npm install && npm run build`).

- [x] **P-C3: Configure Application on EC2**
  - [x] P-C3-S1: Configure Backend Server Listen Address.  
    *Details:* Ensure `app.listen` in `backend/src/server.ts` (or its compiled version) uses `'0.0.0.0'` or is not restricted to `localhost`. Rebuild backend on EC2 if source code changed.
  - [x] P-C3-S2: Create Backend `.env` file on EC2.  
    *Details:* In `backend/`, create `.env` with `PORT=3001`.
  - [x] P-C3-S3: Update Frontend API Endpoint URL.  
    *Details:* Modify `frontend/src/services/api.ts` on EC2 to point `API_BASE_URL` to `http://<YOUR_EC2_PUBLIC_IP>:<BACKEND_PORT>/api`.
  - [x] P-C3-S4: Rebuild Frontend on EC2 after API URL change (`cd frontend && npm run build`).
  - [x] P-C3-S5: Configure EC2 Security Group Inbound Rules.  
    *Details:*  
    - Allow Custom TCP for backend port (e.g., 3001) from Anywhere.  
    - Allow Custom TCP for frontend serving port (e.g., 5173/5174 or 80) from Anywhere.

- [x] **P-C4: Run Applications with PM2 on EC2**
  - [x] P-C4-S1: Start Backend with PM2.  
    `cd backend && pm2 start dist/server.js --name "assignment-backend"`
  - [x] P-C4-S2: Start Frontend with PM2 (serving built assets).  
    `cd frontend && pm2 start serve --name "assignment-frontend" -- -s dist -l 5174`
  - [x] P-C4-S3: Verify PM2 status (`pm2 list`).
  - [x] P-C4-S4 _(Optional)_: Configure PM2 startup on reboot (`pm2 startup`, `pm2 save`).

- [x] **P-C5: Final Testing on Live URLs**
  - [x] P-C5-S1: Use Postman to send data to the live backend URL:  
    `POST http://<EC2_IP>:<BACKEND_PORT>/api/create-answer` with body `{ "data": "Live EC2 Test!" }`.
  - [x] P-C5-S2: Open the live frontend URL `http://<EC2_IP>:<FRONTEND_PORT>` in a browser.
  - [x] P-C5-S3: Verify the frontend displays "Live EC2 Test!" within `<span id="answer">...</span>`.

---

## Phase D: Submission
- [x] **P-D1: Finalize URLs**
  - [x] P-D1-S1: Confirm the live Backend URL (e.g., `http://<EC2_IP>:3001/api/create-answer`).
  - [x] P-D1-S2: Confirm the live Frontend URL (e.g., `http://<EC2_IP>:5174`).

- [x] **P-D2: Submit URLs**
  - [x] P-D2-S1: Submit the two URLs to the provided assignment link.
