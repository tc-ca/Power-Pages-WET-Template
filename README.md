# Power-Apps-Portal-WET

## Step 1: Clone the repo
## Step 2: Install Microsoft Power Platform CLI
https://docs.microsoft.com/en-us/power-apps/developer/data-platform/powerapps-cli
## Step 3: Upload portal content
### Open Power Shell
### Auth
pac auth create --url https://Myorg.crm.dynamics.com
### Upload
pac paportal upload --path "C:\portals\starter-portal"
### Step 4: Change portal website in Portal Management
