# Playwright Exercice ![image](https://user-images.githubusercontent.com/539541/210092660-4d92971d-d83d-4477-b389-4e9f4bbb6a42.png)



## Introduction  
This project includes two tests that verifies some features of the Builder and the Live App, both explained in the following lines.  
#### <b>Test One:</b> Icon Color for Display Rules     
1.    Randomize the color for a Display Rule warning symbol icon.
2.    Validate that the warning symbol icon has the correct color in the Live App.
#### <b>Test Two:</b> Filtering Inventory   
1.    Filter records in the Inventory object where "Needs Re-Order" is Yes, count the records, and confirm their value. 
2.    Validate that a Table displaying these same records in the Live App properly filters in the same way with the same results.

## Stack
- Playwright
- JavaScript
- TypeScript
- Pengrape


## Installation
This project assumes that you have Node.js properly installed in your computer.   
To install the project, follow these steps:
- Clone this project locally `git clone <repository_url>`
- Navigate to it `cd <dir_path>`
- Install the project dependencies `npm install`
- Install playwright `npx playwright install`


## Instructions

Before run the tests:
 - Go to the `data.json` file update the data.json file with you
 - Modify the user and password fields with your test username, email and his password  

Test the individual test file by running `npx playwright test filename.spec.ts` or all tests using the `npx playwright test` command.

## ⚠️ Technical decision 

I created a `data.json` file to store sensitive user data. It is used by all the tests and allows to quickly update the user's data in case they change.  
In the perspective of this recruitment process I have committed this file so that you know the content of it.   
However, in the real world, this file would be ignored by git in order not to disclose the data of the test user.
