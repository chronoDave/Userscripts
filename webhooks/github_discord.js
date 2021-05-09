const { execFileSync } = require('child_process');
const https = require('https');

const [url, status] = process.argv.slice(2);

const getStatusParams = () => {
  switch (status) {
    case 'success':
      return ({
        COLOR: '3066993',
        TITLE: 'Passed',
        AVATAR: 'https://i.imgur.com/IHAzV8k.jpg'
      });
    case 'error':
      return ({
        COLOR: '15158332',
        TITLE: 'Failure',
        AVATAR: 'https://i.imgur.com/niA0XYG.jpg'
      });
    default:
      return ({
        COLOR: '0',
        TITLE: 'Unknown',
        AVATAR: 'https://i.imgur.com/XoGketV.jpg'
      });
  }
};

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
const STATUS = getStatusParams();

const formatUrl = (title, href) => `[\`${title}\`](${href})`;

const data = {
  embeds: [{
    author: {
      name: GITHUB_REPOSITORY,
      url: GITHUB_REPOSITORY_URL,
      icon_url: 'https://i.imgur.com/Z3lo7tA.png'
    },
    title: `${STATUS.TITLE} - ${COMMIT_TITLE}`,
    description: `${COMMIT_DESCRIPTION.slice(0, 2047)}`,
    color: STATUS.COLOR,
    timestamp: new Date(),
    footer: {
      text: `${GITHUB_WORKFLOW} #${GITHUB_RUN_NUMBER}`,
      url: `${GITHUB_REPOSITORY_URL}/actions/runs/${GITHUB_RUN_ID}`
    },
    thumbnail: {
      url: STATUS.AVATAR
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
