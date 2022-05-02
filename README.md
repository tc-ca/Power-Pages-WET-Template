# Power-Apps-Portal-WET

Install Instructions:
## Step 1: Clone the repo

## Step 2: Install Microsoft Power Platform CLI
https://docs.microsoft.com/en-us/power-apps/developer/data-platform/powerapps-cli

## Step 3: Upload portal content
### Open Power Shell
### Auth
pac auth create --url https://Myorg.crm.dynamics.com
### Upload
pac paportal upload --path "C:\portals\starter-portal"

## Step 4: Point your portal to the new template
In the Portal Management app, change the 'Website' for the components below.
### Website Header and Footer
Websites -> Your website -> Change 'Header Template' to 'WET4 - Header' and 'Footer Template' to 'WET4 - Footer'
### Portal Languages
- English. Change the Code to 'en'
- French. Change the Code to 'fr'
Note: You may have duplicate English and French records. Please delete the unused ones.
### Site Settings
- DateTime/DateFormat
### Content Snippets
- WET4 - breadcrumbs
- WET4 - menuLinks
- Head/Bottom (English). Please select the right Website language.
- Head/Bottom (French). Please select the right Website language.
### Web Templates
- WET - Header
- WET - Footer
- WET - Page Header
- WET - Full Page without Child Links
### Page Template
- Templates

## Step 5: Update the page template for existing Web Pages

# Q&A
## Where to change WET version?
Content Snippets -> Head/Bottom
## Where to enable/disable IsApplication?
Content Snippets -> Head/Bottom -> Set isApplication to false. Do not forget to change the French one as well.
## How do I create my own menu?
Content Snippets -> menuLinks. It's in json format.




