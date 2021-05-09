const { execFileSync } = require('child_process');
const https = require('https');

const [url, failed] = process.argv.slice(2);

const COMMIT_TITLE = execFileSync('git', ['log', '-1', '--pretty=%s']).toString();
const COMMIT_DESCRIPTION = execFileSync('git', ['log', '-1', '--pretty=%b']).toString();

const {
  GITHUB_REPOSITORY,
  GITHUB_SERVER_URL,
  GITHUB_WORKFLOW,
  GITHUB_RUN_NUMBER,
  GITHUB_RUN_ID,
  GITHUB_ACTOR,
  GITHUB_SHA
} = process.env;
const GITHUB_REPOSITORY_URL = `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}`;

const formatUrl = (title, href) => `\`[${title}](${href})\``;

const data = {
  embeds: [{
    author: {
      name: GITHUB_REPOSITORY,
      url: GITHUB_REPOSITORY_URL,
      icon_url: 'https://i.imgur.com/Z3lo7tA.png'
    },
    title: `${failed ? 'Failed' : 'Passed'} - ${COMMIT_TITLE}`,
    description: `${COMMIT_DESCRIPTION.slice(0, 2047)}`,
    color: failed ?
      '15158332' :
      '3066993',
    timestamp: new Date().toUTCString(),
    footer: {
      text: `${GITHUB_WORKFLOW} #${GITHUB_RUN_NUMBER}`,
      url: `${GITHUB_REPOSITORY_URL}/actions/runs/${GITHUB_RUN_ID}`
    },
    thumbnail: {
      url: failed ?
        'https://i.imgur.com/niA0XYG.jpg' :
        'https://i.imgur.com/IHAzV8k.jpg'
    },
    fields: [{
      name: 'Author',
      value: formatUrl(GITHUB_ACTOR, `${GITHUB_SERVER_URL}/${GITHUB_ACTOR}`),
      inline: true
    }, {
      name: 'Commit',
      value: formatUrl(
        `${GITHUB_SHA.slice(0, 7)}...`,
        `${GITHUB_REPOSITORY_URL}/commit/${GITHUB_SHA}`
      )
    }]
  }]
};

const request = https.request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Author': 'Chronocide#5250'
  }
}, res => {
  console.log('Status:', res.statusCode);

  const body = [];
  res.on('data', chunk => body.push(chunk));
  res.on('end', () => {
    const message = Buffer.concat(body).toString();

    if (message) console.log('Message:', JSON.parse(message));
  });
});

request.on('error', console.error);
request.write(JSON.stringify(data));
request.end();
