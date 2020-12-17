#!/bin/bash

case $1 in
  "success" )
    EMBED_COLOR=3066993
    STATUS="Passed"
    AVATAR="https://i.imgur.com/IHAzV8k.jpg"
    ;;
    
  "failure" )
    EMBED_COLOR=15158332
    STATUS="Failed"
    AVATAR="https://i.imgur.com/niA0XYG.jpg"
    ;;
    
  * )
    EMBED_COLOR=0
    STATUS="Unknown"
    AVATAR="https://i.imgur.com/XoGketV.jpg"
    ;;
esac

COMMIT_TITLE="$(git log -1 --pretty=%s)"
COMMIT_DESCRIPTION="$(git log -1 --pretty=%b)"

WEBHOOK_DATA='{
  "embeds": [{
	"author": {
		"name": "'$GITHUB_REPOSITORY'",
		"url": "'$GITHUB_SERVER_URL'/'$GITHUB_REPOSITORY'",
		"icon_url": "https://i.imgur.com/Z3lo7tA.png"
	},
	"title": "'$STATUS' - '$COMMIT_TITLE'",
	"description": "'$COMMIT_DESCRIPTION'",
  "footer": {
    "text": "'$GITHUB_WORKFLOW' #'$GITHUB_RUN_NUMBER' ('$(WEBHOOK_FOOTER || GITHUB_RUN_ID)')",
    "url": "'$GITHUB_SERVER_URL'/'$GITHUB_REPOSITORY'/actions/runs/'$GITHUB_RUN_ID'"
  },
	"thumbnail": {
		"url": "'$AVATAR'"
	},
	"fields": [{
		"name": "Author",
		"value": "[`'$GITHUB_ACTOR'`]('$GITHUB_SERVER_URL'/'$GITHUB_ACTOR')",
		"inline": true
	}, {
		"name": "Commit",
		"value": "[`'${GITHUB_SHA:0:7}'`]('$GITHUB_SERVER_URL'/'$GITHUB_REPOSITORY'/commit/'$GITHUB_SHA')",
		"inline": true
	}],
    "color": '$EMBED_COLOR',
    "timestamp": "'$(date --utc +%FT%TZ)'"
  }]
}'

curl --fail \
	-A "GitHubActions-Webhook" \
	-H Content-Type:application/json \
	-H X-Author:Chronocide#5250 \
	-d "$WEBHOOK_DATA" "$WEBHOOK_URL" \
