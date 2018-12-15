npm run build
rsync -rlzv --progress --exclude=.git --exclude=.vscode /Users/bsettle/Documents/Github/nbgwas-frontend/build/ bsettle@nbgwas.ucsd.edu:/var/www/html/
