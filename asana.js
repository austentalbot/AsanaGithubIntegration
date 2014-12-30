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
    ghToAsana: JSON.parse(process.env['ghToAsana']),
    redisHost: process.env['redisHost'],
    redisPort: process.env['redisPort'],
    redisAuth: process.env['redisAuth'],
    asanaOAuthClientID: process.env['asanaOAuthClientID']
  };
}

console.log(credentials);

var redis = require('redis');
var client = redis.createClient(credentials.redisPort, credentials.redisHost);
client.auth(credentials.redisAuth);

var asana = {
  addFollowers: function(followers, task, responseText, res) {
    request.post({
      url: [asanaUrl,'/tasks/',task.id,'/addFollowers'].join(''),
      auth: {
        'user': credentials.key,
        'pass': '',
        'sendImmediately': true
      },
      form: {
        followers: followers
      }
    }, function(err, resp, body) {
      console.log(err);
      console.log(body);
      var response = JSON.parse(body);
      if ('errors' in response) {
        res.status(501).send([responseText, ' but did not add follower/n', JSON.stringify(response.errors)].join(''));
      } else {
        res.status(201).send(responseText + ' and added follower');
      }
    });
  },
  addUser: function(req, res) {
    client.set(req.body.github, req.body.asana, function(err, asanaId) {
      if (err) {
        res.status(501).send('Could not create ' + err);
        return;
      }
      res.status(201).send('Added new user');
    });
  },
  assignPull: function(req, res) {
    var that = this;
    var action = req.body;
    var assignment = {
      assignee: action.pull_request.assignee.login,
      date: moment(action.pull_request.updated_at)
        .tz("America/Los_Angeles")
        .format('MMMM Do YYYY, h:mm:ss a'),
      title: [action.pull_request.title, action.pull_request.number].join(' ')
    };
    //map gh handle to asana id through redis
    client.get(assignment.assignee, function(err, asanaId) {
      if (err) {
        res.status(501).send('Assignee not in database');
        return;
      }
      that.findTask(assignment.title, req.params.project, function(task, err) {
        if (!task) {
          res.status(501).send(err || 'Could not find task associated with pull request');
        } else {
          console.log(task);
          request.put({
            url: [asanaUrl,'/tasks/',task.id].join(''),
            auth: {
              'user': credentials.key,
              'pass': '',
              'sendImmediately': true
            },
            form: {
              assignee: asanaId
            }
          }, function(err, resp, body) {
            console.log(err);
            console.log(body);
            var response = JSON.parse(body);
            if ('errors' in response) {
              res.status(501).send(JSON.stringify(response.errors));
            } else {
              res.status(201).send('Assigned task');
            }
          });
        }
      });
    });
  },
  closePullComment: function(req, res) {
    var action = req.body;
    var close = {
      closer: action.pull_request.merged_by ? action.pull_request.merged_by.login : 'no one',
      time: moment(action.pull_request.merged_at || action.pull_request.closed_atg)
        .tz("America/Los_Angeles")
        .format('MMMM Do YYYY, h:mm:ss a'),
      notes: function() {
        return [
          '\nPull request closed by',
          this.closer,
          'on',
          this.time
        ].join(' ');
      },
      title: [action.pull_request.title, action.pull_request.number].join(' ')
    };
    //find associated task id by task name
    this.findTask(close.title, req.params.project, function(task, err) {
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
            text: close.notes()
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
  createTask: function(req, res) {
    var action = req.body;
    var pull = {
      creationDate: moment(action.pull_request.created_at)
        .tz("America/Los_Angeles")
        .format('MMMM Do YYYY, h:mm:ss a'),
      creator: action.pull_request.user.login,
      notes: function() {
        return [
          action.pull_request.body,
          '\nPull by:', this.creator, 
          '\nDate:',
          this.creationDate,
          '\nURL:',
          this.url
        ].join(' ');
      },
      title: [action.pull_request.title, action.pull_request.number].join(' '),
      url: action.pull_request.html_url
    }
    client.get(pull.creator, function(err, asanaId) {
      request.post({
        url: asanaUrl + '/tasks',
        auth: {
          'user': credentials.key,
          'pass': '',
          'sendImmediately': true
        },
        form: {
          assignee: asanaId || credentials.defaultAssignee,
          name: pull.title,
          workspace: credentials.asanaWorkspace,
          projects: [req.params.project],
          notes: pull.notes(),
          followers: [asanaId]
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
    });
  },
  createIssueComment: function(req, res) {
    var action = req.body;
    //pull out relevant info from comment
    var comment = {
      author: action.comment.user.login,
      creationDate: moment(action.comment.created_at)
        .tz("America/Los_Angeles")
        .format('MMMM Do YYYY, h:mm:ss a'),
      notes: function() {
        return [
          '\nComment:\n',
          action.comment.body,
          '\n\nBy:',
          this.author,
          '\nDate:',
          this.creationDate
        ].join(' ');
      },
      title: [action.issue.title, action.issue.number].join(' '),
      url: action.issue.html_url
    };
    //find associated task id by task name
    // this.findTask('Pull request: This is a test. Please ignore.', function(task, err) {
    var that = this;
    this.findTask(comment.title, req.params.project, function(task, err) {
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
            client.get(comment.author, function(err, asanaId) {
              if (err) {
                res.status(501).send('Assignee not in database');   
                return;             
              }
              that.addFollowers([asanaId], task, 'Created comment', res);
            });
          }
        });
      }
    });
  },
  createPullComment: function(req, res) {
    var action = req.body;
    //pull out relevant info from comment
    var comment = {
      author: action.comment.user.login,
      creationDate: moment(action.comment.created_at)
        .tz("America/Los_Angeles")
        .format('MMMM Do YYYY, h:mm:ss a'),
      notes: function() {
        return [
          '\nComment:\n',
          action.comment.body,
          '\n\nBy:',
          this.author,
          '\nDate:',
          this.creationDate
        ].join(' ');
      },
      title: [action.pull_request.title, action.pull_request.number].join(' '),
      url: action.pull_request.html_url
    };
    //find associated task id by task name
    // this.findTask('Pull request: This is a test. Please ignore.', function(task, err) {
    var that = this;
    this.findTask(comment.title, req.params.project, function(task, err) {
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
            client.get(comment.author, function(err, asanaId) {
              if (err) {
                res.status(501).send('Assignee not in database');   
                return;             
              }
              that.addFollowers([asanaId], task, 'Created comment', res);
            });
          }
        });
      }
    });
  },
  findTask: function(name, project, callback) {
    request.get({
      url: [asanaUrl,'/projects/', project, '/tasks'].join(''),
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
