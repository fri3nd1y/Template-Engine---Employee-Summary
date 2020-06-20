const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

teamArray = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

const managerQuestions = [ 
    {
        type: 'input',
        name: 'name',
        message: "What is your name?",
        validate: function(value) {
            let pass = value.match(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/);
            if (pass) {
                return true;
            }
        
            return 'Please enter a valid name.';
            }
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is your ID number?',
        validate: function(value) {
            let pass = value.match(/^\d+$/);
            if (pass) {
                return true;
            }
        
            return 'Please enter a ID number.';
            }
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is your Email address?',
        validate: function(value) {
            let pass = value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
            if (pass) {
                return true;
            }
        
            return 'Please enter a Email.';
            }
    },
    {
        type: 'input',
        name: 'officeNumber',
        message: 'What is your office number?',
        validate: function(value) {
            let pass = value.match(
              /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
            );
            if (pass) {
              return true;
            }
      
            return 'Please enter a valid office number.';
          }
    }
];

const employeeQuestions = [
    {
        type: 'input',
        name: 'name',
        message: "What is your name?"
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is your ID number?',
        validate: function(value) {
            let pass = value.match(/^\d+$/);
            if (pass) {
                return true;
            }
        
            return 'Please enter a ID number.';
            }
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is your Email address?',
        validate: function(value) {
            let pass = value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
            if (pass) {
                return true;
            }
        
            return 'Please enter a Email.';
            }
    },
    {
        name: "class",
        type: "list",
        message: "What kind of employee are you?",
        choices: [ "Intern", "Engineer"]
    }, 
    {
        type: 'input',
        name: 'school',
        message: 'What school are you currently attending or have graduated from?',
        when: (answers) => answers.class === 'Intern'
    },
    {
        type: 'input',
        name: 'github',
        message: 'What is your github username?',
        when: (answers) => answers.class === 'Engineer'
    },
    {
        type: 'confirm',
        name: 'askAgain',
        message: 'Do you want to add another team member? (just hit enter for YES)?',
        default: true
    }
];

async function ask() {
    console.log('\nPlease first enter the Manager\'s information before filling out the team\'s.\n')
    inquirer.prompt(managerQuestions).then(answers => {
        let manager = new Manager(
            answers.name,
             answers.id, 
             answers.email, 
             answers.officeNumber
             );
        teamArray.push(manager);
        askTeam ();
    });
};

function askTeam () {
    console.log('\nEnter Employee\'s information\n')
    inquirer.prompt(employeeQuestions).then(answers => {
        if (answers.askAgain) {
            switch (answers.class) {
                case 'Intern':
                    let intern = new Intern(
                        answers.name, 
                        answers.id, 
                        answers.email, 
                        answers.school
                        );
                    teamArray.push(intern);
                    break;
                case 'Engineer':
                    let engineer = new Engineer(
                        answers.name, 
                        answers.id, 
                        answers.email, 
                        answers.github
                        );
                    teamArray.push(engineer);
                    break;
                }
            askTeam();
            }
        else {
            switch (answers.class) {
                case 'Intern':
                    let intern = new Intern(answers.name, answers.id, answers.email, answers.school);
                    teamArray.push(intern);
                    break;
                case 'Engineer':
                    let engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
                    teamArray.push(engineer);
                    break;
                }
            renderhtml = render(teamArray);

            let logger = fs.createWriteStream(outputPath, {
              flags: 'a'
            })

            logger.write(renderhtml);
            logger.end();
        };
    });
};





ask();