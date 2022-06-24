heroku whoami || heroku login \
&& heroku container:login \
&& for i in {1..5}; 
    do docker compose -f docker-compose.prod.yml up --build -d && break || sleep 5; 
    done \
&& docker image rmi registry.heroku.com/the-constellation-assets/web || true \
&& docker tag learn-and-share_prod registry.heroku.com/the-constellation-assets/web \
&& docker push registry.heroku.com/the-constellation-assets/web \
&& heroku container:release web --app the-constellation-assets