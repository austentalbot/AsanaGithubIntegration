var request = require('request');
var moment = require('moment-timezone');

var asanaUrl = 'https://app.asana.com/api/1.0'


//load credentials locally or from host
var credentials = {};
if (process.env.PORT===undefined) {
  credentials = require('./credentials.js');
} else {
  credentials = {
    key: process.env['key'],
    defaultAssignee: process.env['defaultAssignee'],
    asanaWorkspace: process.env['asanaWorkspace'],
    asanaProject: process.env['asanaProject'],
    ghToAsana: JSON.parse(process.env['ghToAsana'])
  };
}

console.log(credentials);

var asana = {
  createTask: function(action, res) {
    var pull = {
      assignee: action.issue.assignee,
      creationDate: moment(action.issue.created_at)
        .tz("America/Los_Angeles")
        .format('MMMM Do YYYY, h:mm:ss a'),
      creator: action.issue.user.login,
      id: action.issue.id,
      name: action.issue.title,
      notes: function() {
        return [
          action.comment.body,
          '\nPull by:', this.creator, 
          '\nAssigned to:',
          this.assignee || 'no one',
          '\nDate:',
          this.creationDate,
          '\nURL:',
          this.url
        ].join(' ');
      },
      url: action.issue.pull_request.html_url
    }
    request.post({
      url: asanaUrl + '/tasks',
      auth: {
        'user': credentials.key,
        'pass': '',
        'sendImmediately': true
      },
      form: {
        assignee: 
          credentials.ghToAsana[pull.assignee] || 
          credentials.ghToAsana[pull.creator] || 
          credentials.defaultAssignee,
        name: pull.name + ' ' + pull.id,
        workspace: credentials.asanaWorkspace,
        projects: [credentials.asanaProject],
        notes: pull.notes()
      }
    }, function(err, resp, body) {
      console.log(err);
      console.log(body);
      res.status(201).send();
    });
  },
  createComment: function(action, res) {
    //find associated task id by task name
    //add comment to that task
    request.get({
      url: [asanaUrl, '/projects/', credentials.asanaProject, 'asdf/tasks'].join(''),
      auth: {
        'user': credentials.key,
        'pass': '',
        'sendImmediately': true
      }
    }, function(err, resp, body) {
      var tasks = JSON.parse(body);
      if ('errors' in tasks) {
        res.status(501).send(JSON.stringify(tasks.errors))
      } else {
        console.log(tasks);
        // console.log(body);
        res.status(201).send();
      }
    });
  }
};

module.exports = asana;
