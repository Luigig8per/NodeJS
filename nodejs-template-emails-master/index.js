const nodemailer = require('nodemailer'),
    
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'celdjl@gmail.com',
            pass: 'djl544bb',
        },
    }),
    EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path'),
    Promise = require('bluebird');

// I changed the emails from what's in the tutorial because people kept using
// info@geeklaunch.net and sending me their test emails. :P Lesson learned. :)
//
// So yeah, change the emails below from 'example@example.tld' to YOUR email,
// please.
//
// Thank you!
let users = [
    {
        name: 'Jack',
        email: 'luis.m4a@gmail.com',
    },
    {
        name: 'John',
        email: 'luis.m4a@gmail.com',
    },
    {
        name: 'Joe',
        email: 'luis.m4a@gmail.com',
    },
];

function sendEmail (obj) {
    return transporter.sendMail(obj);
}

function loadTemplate (templateName, contexts) {
    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}

loadTemplate('updates-april-2017', users).then((results) => {
    return Promise.all(results.map((result) => {
        sendEmail({
            to: result.context.email,
            from: 'Me :)',
            subject: result.email.subject,
            html: result.email.html,
            text: result.email.text,
        });
    }));
}).then(() => {
    console.log('Yay!');
});
