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
      assignee: action.pull_request.assignee,
      creationDate: moment(action.pull_request.created_at)
        .tz("America/Los_Angeles")
        .format('MMMM Do YYYY, h:mm:ss a'),
      creator: action.pull_request.user.login,
      notes: function() {
        return [
          action.pull_request.body,
          '\nPull by:', this.creator, 
          '\nAssigned to:',
          this.assignee || 'no one',
          '\nDate:',
          this.creationDate,
          '\nURL:',
          this.url
        ].join(' ');
      },
      title: [action.pull_request.title, action.pull_request.id].join(' '),
      url: action.pull_request.pull_request.html_url
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
        name: pull.title,
        workspace: credentials.asanaWorkspace,
        projects: [credentials.asanaProject],
        notes: pull.notes(),
        followers: [credentials.ghToAsana[pull.creator] || credentials.defaultAssignee]
      }
    }, function(err, resp, body) {
      console.log(err);
      console.log(body);
      var response = JSON.parse(body);
      if ('errors' in response) {
        res.status(501).send(JSON.stringify(response.errors));
      } else {
        res.status(201).send('Created task');
      }
    });
  },
  createComment: function(action, res) {
    //pull out relevant info from comment
    var comment = {
      author: action.comment.user.login,
      creationDate: moment(action.comment.created_at)
        .tz("America/Los_Angeles")
        .format('MMMM Do YYYY, h:mm:ss a'),
      notes: function() {
        return [
          'Comment:\n',
          action.comment.body,
          '\n\nBy:',
          this.author,
          '\nDate:',
          this.creationDate
        ].join(' ');
      },
      title: [action.pull_request.title, action.pull_request.id].join(' '),
      url: action.pull_request.html_url
    };
    //find associated task id by task name
    // this.findTask(comment.title, function(task, err) {
    this.findTask('Pull request: This is a test. Please ignore.', function(task, err) {
      if (!task) {
        res.status(501).send(err || 'Could not find task associated with pull request');
      } else {
        //add comment to task
        console.log(task);
        request.post({
          url: [asanaUrl,'/tasks/',task.id,'/stories'].join(''),
          auth: {
            'user': credentials.key,
            'pass': '',
            'sendImmediately': true
          },
          form: {
            text: comment.notes()
          }
        }, function(err, resp, body) {
          console.log(err);
          console.log(body);
          var response = JSON.parse(body);
          if ('errors' in response) {
            res.status(501).send(JSON.stringify(response.errors));
          } else {
            res.status(201).send('Created comment');
          }
        });
      }
    });
  },
  findTask: function(name, callback) {
    request.get({
      url: [asanaUrl,'/projects/',credentials.asanaProject,'/tasks'].join(''),
      auth: {
        'user': credentials.key,
        'pass': '',
        'sendImmediately': true
      }
    }, function(err, resp, body) {
      var tasks = JSON.parse(body);
      var task;
      if ('errors' in tasks) {
        callback(task, JSON.stringify(tasks.errors));
      } else {
        for (var i=0; i<tasks.data.length; i++) {
          var val = tasks.data[i];
          console.log(val);
          if (val.name===name) {
            task = val;
            break;
          }
        }
        callback(task);
      }
    });

  }
};

module.exports = asana;
