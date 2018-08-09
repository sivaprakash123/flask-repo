FROM egovio/ci-react:v8.4.0
RUN npm install yarn
RUN yarn -y init
RUN yarn add express  pg-promise
COPY . /opt/
WORKDIR /opt
CMD ['node' 'index.js']

