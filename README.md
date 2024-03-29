# About Power-Pages-WET-Template
The purpose of this Power Pages template is to be able to easily implement the WET CDTS layer of the Canada.ca or intranet.canada.ca themes into a Power Pages solution.

This will ensure that a Power Pages App uses this template will be accessible, usable, interoperable, mobile friendly and multilingual.

# Install Instructions:
## Step 1: Clone the repo

## Step 2: Install Microsoft Power Platform CLI
https://docs.microsoft.com/en-us/power-apps/developer/data-platform/powerapps-cli

## Step 3: Upload Power Pages content
### Open Power Shell
### Auth
```
pac auth create --url https://MYPOWERPAGE.crm3.dynamics.com
``````
### Upload
```
pac paportal upload --path "C:\path\to\local\repo\Power-Pages-WET-Template"
```

If your site uses the Enhanced data model ([Enhanced data model | Microsoft Learn](https://learn.microsoft.com/en-us/power-pages/admin/enhanced-data-model)):
```
pac powerpages upload --path <path> --modelVersion 2
```

## Step 4: Change languages code
If Enhanced data model, go to Power Pages Management > Websites > Supported Languages

If Standard data model, go to Portal Management > Portal Languages
- English. Change Language Code to 'en'
- French. Change Language Code to 'fr'

## Step 5: Point your Power Pages Website to WET template
### Website Header and Footer
Websites -> Your website -> Change 'Header Template' to 'WET4 - Header' and 'Footer Template' to 'WET4 - Footer'

> ⚠️ **fail to set up the languages and their codes will result the header now showing.** You may have duplicate English and French records. Please delete the unused ones (usually the 2nd ones in your list).

### Site Settings, Content Snippets, Web Templates, Page Template

In the Power Pages Management app, change the 'Website' for the components below from `TC-WET-CDTS - TC-WET-CDTS` to you Power Page.

#### Site Settings
- DateTime/DateFormat
- WET4 - IsApplication
- WET4 - IsExternal
- WET4 - Version

#### Content Snippets
- WET4 - AppName
- WET4 - breadcrumbs
- WET4 - menuLinks. By default, it's using the 'Primary Navigation' Web Link Sets.
- WET4 - prepreFooter. App version and modified date on bottom of the page.
- Head/Bottom. Please select the right Website language.

#### Web Templates
- WET4 - Header
- WET4 - Footer
- WET4 - Full Page without Child Links

#### Page Template
- WET4 - Full Page without Child Links

## Step 5: Update the page template for existing Web Pages

Web Pages > Select page > Page Template

# Q&A
## I don't see the header and get error on console 'wet is not defined'.
Check if 'English' and 'French' is setup and their code is 'en' and 'fr'.
## Where to change WET version?
Content Snippets -> Head/Bottom
## Where to enable/disable IsApplication?
Content Snippets -> Head/Bottom -> Set isApplication to false. Do not forget to change the French one as well.
## How do I create my own menu?
Content Snippets -> menuLinks. It's in json format.




