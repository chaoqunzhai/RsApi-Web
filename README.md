# use node v14
npm config set strict-ssl false
npm install 
npm run dev
npm run build:prod && rm -rf dist.tar.gz && tar -czvf dist.tar.gz dist
