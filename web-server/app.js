import process from 'process';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import logger from 'morgan';
import { fingerprint } from './actions/fingerprint-action';
import { authenticate} from './actions/authenticate-action'
import { StartAngelsWings } from './hashDB/AngelsWings';

const app = express();

function urlPrefix() {
  let prefix = process.env.PUBLIC_URL;
  if (prefix)
    prefix = prefix.trim();

  if (!prefix || prefix.length === 0)
    return null;

  if (prefix[0] === '/')
    return prefix;
  return `/${prefix}`;
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  useTempFiles : true,
  safeFileNames : true,
  preserveExtension : true,
  tempFileDir : '/tmp/'
}));

const routes = express.Router()
routes.get('/', (req, res) => res.redirect(301, 'index.html'));
routes.use(express.static(path.join(__dirname, 'static')));

routes.post('/fingerprint', fingerprint);
routes.get('/authenticate', authenticate);

const prefix = urlPrefix()
if (prefix) {
  app.get('/', (req, res) => res.redirect(301, `${prefix}/index.html`));
  app.use(prefix, routes);
} else {
  app.use('/', routes);
}

console.log(`url prefix is ${prefix}`);

StartAngelsWings();

module.exports = app;
