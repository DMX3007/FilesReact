const express = require('express');
const config = require('config');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

const app = express();
app.use(session({
  secret: 'fsdfahtcdgdg2342343',
  resave: true,
  saveUninitialized: true,
}));

app.use(cors());
app.use(express.json());
app.use('/', require('../auth/server'));
app.use('/static', express.static(path.join(__dirname, '../../node_modules')));
app.use('/dist', express.static(path.join(__dirname, '/dist/admin-web2')));
app.use(require('./routes'));

app.use(express.json({ limit: '2MB' }));
const publicPath = path.resolve(__dirname, '../../apps/admin-web2/public');
app.use('/', express.static(publicPath));

const reactBuildPath = path.resolve(process.cwd(), 'dist/admin-web2');
app.use('/', express.static(reactBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(reactBuildPath, 'index.html'));
});
const bootstrap = async () => {
  try {
    app.listen(config.get('apps.admin-web.port'), () => {
      console.log('✅ Admin web started on port', config.get('apps.admin-web.port'));
    });
  } catch (e) {
    console.log('❌ Error on startup, exiting:', e);
    process.exit(1);
  }
};

bootstrap();
