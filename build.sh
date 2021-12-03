npm run build

rsync -avz --delete dist/*  root@106.52.242.121:/home/service/api-service
rsync -avz --delete package.json  root@106.52.242.121:/home/service/api-service
