
Convert json to jsonl file

```bash

node -e "fs=require('fs');data=JSON.parse(fs.readFileSync('/Users/rocked/Documents/elastic-Search/search/learnings/dealerships.json'));fs.writeFileSync('/Users/rocked/Documents/elastic-Search/search/learnings/dealerships.jsonl',data.map(d=>{d.id=String(d.id);return JSON.stringify(d)}).join('\n'))"

```