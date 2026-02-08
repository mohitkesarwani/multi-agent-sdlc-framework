# SETUP GUIDE

## Local Development Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/mohitkesarwani/multi-agent-sdlc-framework.git
   cd multi-agent-sdlc-framework
   ```

2. **Install Dependencies**
   Make sure you have the necessary dependencies installed:
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file based on the `.env.example` provided in the repository and update the necessary configurations.

## Testing
1. **Run Unit Tests**
   Use the following command to run the tests:
   ```bash
   npm test
   ```

2. **Check Test Coverage**
   To see the coverage report, run:
   ```bash
   npm run coverage
   ```

## Running the Orchestrator
1. **Start the Orchestrator**
   Use the following command to start the orchestrator:
   ```bash
   npm start
   ```

2. **Access the Orchestrator**
   You can access the orchestrator dashboard at `http://localhost:3000`.

## Troubleshooting Common Issues
- **Issue 1: Dependency Errors**
  - Ensure that all dependencies are installed correctly and that there are no version conflicts.

- **Issue 2: Orchestrator Won't Start**
  - Check the environment configuration in the `.env` file.
  - Ensure that there are no port conflicts.

- **Issue 3: Test Failures**
  - Review the error messages in the test output and fix any failing tests accordingly.

For further assistance, please consult the documentation or reach out to the support team.