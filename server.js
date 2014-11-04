//server related dependencies
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var asana = require('./asana.js');

var port = process.env.PORT || 4545;

var test = { action: 'opened',
  number: 95,
  pull_request: 
   { url: 'https://api.github.com/repos/Asana/luna-ui/pulls/95',
     id: 23700300,
     html_url: 'https://github.com/Asana/luna-ui/pull/95',
     diff_url: 'https://github.com/Asana/luna-ui/pull/95.diff',
     patch_url: 'https://github.com/Asana/luna-ui/pull/95.patch',
     issue_url: 'https://api.github.com/repos/Asana/luna-ui/issues/95',
     number: 95,
     state: 'open',
     locked: false,
     title: 'This is a test. Please ignore.',
     user: 
      { login: 'austentalbot',
        id: 3654181,
        avatar_url: 'https://avatars.githubusercontent.com/u/3654181?v=2',
        gravatar_id: '',
        url: 'https://api.github.com/users/austentalbot',
        html_url: 'https://github.com/austentalbot',
        followers_url: 'https://api.github.com/users/austentalbot/followers',
        following_url: 'https://api.github.com/users/austentalbot/following{/other_user}',
        gists_url: 'https://api.github.com/users/austentalbot/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/austentalbot/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/austentalbot/subscriptions',
        organizations_url: 'https://api.github.com/users/austentalbot/orgs',
        repos_url: 'https://api.github.com/users/austentalbot/repos',
        events_url: 'https://api.github.com/users/austentalbot/events{/privacy}',
        received_events_url: 'https://api.github.com/users/austentalbot/received_events',
        type: 'User',
        site_admin: false },
     body: 'this is a test comment',
     created_at: '2014-10-31T19:28:13Z',
     updated_at: '2014-10-31T19:28:13Z',
     closed_at: null,
     merged_at: null,
     merge_commit_sha: null,
     assignee: null,
     milestone: null,
     commits_url: 'https://api.github.com/repos/Asana/luna-ui/pulls/95/commits',
     review_comments_url: 'https://api.github.com/repos/Asana/luna-ui/pulls/95/comments',
     review_comment_url: 'https://api.github.com/repos/Asana/luna-ui/pulls/comments/{number}',
     comments_url: 'https://api.github.com/repos/Asana/luna-ui/issues/95/comments',
     statuses_url: 'https://api.github.com/repos/Asana/luna-ui/statuses/b31368fd35fee459c8560e0b819b7dfb54129cd2',
     head: 
      { label: 'Asana:test',
        ref: 'test',
        sha: 'b31368fd35fee459c8560e0b819b7dfb54129cd2',
        user: [Object],
        repo: [Object] },
     base: 
      { label: 'Asana:master',
        ref: 'master',
        sha: 'f1acc1825a99a9516cf0602955e9fc51ac2f445c',
        user: [Object],
        repo: [Object] },
     _links: 
      { self: [Object],
        html: [Object],
        issue: [Object],
        comments: [Object],
        review_comments: [Object],
        review_comment: [Object],
        commits: [Object],
        statuses: [Object] },
     merged: false,
     mergeable: null,
     mergeable_state: 'unknown',
     merged_by: null,
     comments: 0,
     review_comments: 0,
     commits: 1,
     additions: 1,
     deletions: 0,
     changed_files: 1 },
  repository: 
   { id: 24650840,
     name: 'luna-ui',
     full_name: 'Asana/luna-ui',
     owner: 
      { login: 'Asana',
        id: 1472111,
        avatar_url: 'https://avatars.githubusercontent.com/u/1472111?v=2',
        gravatar_id: '',
        url: 'https://api.github.com/users/Asana',
        html_url: 'https://github.com/Asana',
        followers_url: 'https://api.github.com/users/Asana/followers',
        following_url: 'https://api.github.com/users/Asana/following{/other_user}',
        gists_url: 'https://api.github.com/users/Asana/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/Asana/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Asana/subscriptions',
        organizations_url: 'https://api.github.com/users/Asana/orgs',
        repos_url: 'https://api.github.com/users/Asana/repos',
        events_url: 'https://api.github.com/users/Asana/events{/privacy}',
        received_events_url: 'https://api.github.com/users/Asana/received_events',
        type: 'Organization',
        site_admin: false },
     private: true,
     html_url: 'https://github.com/Asana/luna-ui',
     description: 'A library of TypedReact components',
     fork: false,
     url: 'https://api.github.com/repos/Asana/luna-ui',
     forks_url: 'https://api.github.com/repos/Asana/luna-ui/forks',
     keys_url: 'https://api.github.com/repos/Asana/luna-ui/keys{/key_id}',
     collaborators_url: 'https://api.github.com/repos/Asana/luna-ui/collaborators{/collaborator}',
     teams_url: 'https://api.github.com/repos/Asana/luna-ui/teams',
     hooks_url: 'https://api.github.com/repos/Asana/luna-ui/hooks',
     issue_events_url: 'https://api.github.com/repos/Asana/luna-ui/issues/events{/number}',
     events_url: 'https://api.github.com/repos/Asana/luna-ui/events',
     assignees_url: 'https://api.github.com/repos/Asana/luna-ui/assignees{/user}',
     branches_url: 'https://api.github.com/repos/Asana/luna-ui/branches{/branch}',
     tags_url: 'https://api.github.com/repos/Asana/luna-ui/tags',
     blobs_url: 'https://api.github.com/repos/Asana/luna-ui/git/blobs{/sha}',
     git_tags_url: 'https://api.github.com/repos/Asana/luna-ui/git/tags{/sha}',
     git_refs_url: 'https://api.github.com/repos/Asana/luna-ui/git/refs{/sha}',
     trees_url: 'https://api.github.com/repos/Asana/luna-ui/git/trees{/sha}',
     statuses_url: 'https://api.github.com/repos/Asana/luna-ui/statuses/{sha}',
     languages_url: 'https://api.github.com/repos/Asana/luna-ui/languages',
     stargazers_url: 'https://api.github.com/repos/Asana/luna-ui/stargazers',
     contributors_url: 'https://api.github.com/repos/Asana/luna-ui/contributors',
     subscribers_url: 'https://api.github.com/repos/Asana/luna-ui/subscribers',
     subscription_url: 'https://api.github.com/repos/Asana/luna-ui/subscription',
     commits_url: 'https://api.github.com/repos/Asana/luna-ui/commits{/sha}',
     git_commits_url: 'https://api.github.com/repos/Asana/luna-ui/git/commits{/sha}',
     comments_url: 'https://api.github.com/repos/Asana/luna-ui/comments{/number}',
     issue_comment_url: 'https://api.github.com/repos/Asana/luna-ui/issues/comments/{number}',
     contents_url: 'https://api.github.com/repos/Asana/luna-ui/contents/{+path}',
     compare_url: 'https://api.github.com/repos/Asana/luna-ui/compare/{base}...{head}',
     merges_url: 'https://api.github.com/repos/Asana/luna-ui/merges',
     archive_url: 'https://api.github.com/repos/Asana/luna-ui/{archive_format}{/ref}',
     downloads_url: 'https://api.github.com/repos/Asana/luna-ui/downloads',
     issues_url: 'https://api.github.com/repos/Asana/luna-ui/issues{/number}',
     pulls_url: 'https://api.github.com/repos/Asana/luna-ui/pulls{/number}',
     milestones_url: 'https://api.github.com/repos/Asana/luna-ui/milestones{/number}',
     notifications_url: 'https://api.github.com/repos/Asana/luna-ui/notifications{?since,all,participating}',
     labels_url: 'https://api.github.com/repos/Asana/luna-ui/labels{/name}',
     releases_url: 'https://api.github.com/repos/Asana/luna-ui/releases{/id}',
     created_at: '2014-09-30T18:44:22Z',
     updated_at: '2014-10-28T02:21:59Z',
     pushed_at: '2014-10-31T19:27:24Z',
     git_url: 'git://github.com/Asana/luna-ui.git',
     ssh_url: 'git@github.com:Asana/luna-ui.git',
     clone_url: 'https://github.com/Asana/luna-ui.git',
     svn_url: 'https://github.com/Asana/luna-ui',
     homepage: null,
     size: 5320,
     stargazers_count: 4,
     watchers_count: 4,
     language: 'TypeScript',
     has_issues: false,
     has_downloads: true,
     has_wiki: true,
     has_pages: false,
     forks_count: 0,
     mirror_url: null,
     open_issues_count: 1,
     forks: 0,
     open_issues: 1,
     watchers: 4,
     default_branch: 'master' },
  organization: 
   { login: 'Asana',
     id: 1472111,
     url: 'https://api.github.com/orgs/Asana',
     repos_url: 'https://api.github.com/orgs/Asana/repos',
     events_url: 'https://api.github.com/orgs/Asana/events',
     members_url: 'https://api.github.com/orgs/Asana/members{/member}',
     public_members_url: 'https://api.github.com/orgs/Asana/public_members{/member}',
     avatar_url: 'https://avatars.githubusercontent.com/u/1472111?v=2' },
  sender: 
   { login: 'austentalbot',
     id: 3654181,
     avatar_url: 'https://avatars.githubusercontent.com/u/3654181?v=2',
     gravatar_id: '',
     url: 'https://api.github.com/users/austentalbot',
     html_url: 'https://github.com/austentalbot',
     followers_url: 'https://api.github.com/users/austentalbot/followers',
     following_url: 'https://api.github.com/users/austentalbot/following{/other_user}',
     gists_url: 'https://api.github.com/users/austentalbot/gists{/gist_id}',
     starred_url: 'https://api.github.com/users/austentalbot/starred{/owner}{/repo}',
     subscriptions_url: 'https://api.github.com/users/austentalbot/subscriptions',
     organizations_url: 'https://api.github.com/users/austentalbot/orgs',
     repos_url: 'https://api.github.com/users/austentalbot/repos',
     events_url: 'https://api.github.com/users/austentalbot/events{/privacy}',
     received_events_url: 'https://api.github.com/users/austentalbot/received_events',
     type: 'User',
     site_admin: false } };

//initialize app and use cors & body parser
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.status(200).send('Asana Github Integration');
});

app.get('/test', function(req, res){
  // asana.createTask(test, res);
  asana.createComment(test, res);
});

app.post('/luna-ui', function(req, res) {
  if (req.body.action === 'created') {
    asana.createTask(req.body, res);
  } else {
    res.status(501).send('at the moment, only pull requests are supported by asana-gh integration');
  }
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
