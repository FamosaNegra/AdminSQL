import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import Connect from 'connect-pg-simple'
import session from 'express-session'
import {
  Adapter,
  Database,
  Resource
} from '@adminjs/sql'
import importExportFeature from '@adminjs/import-export';
import {
  ComponentLoader
} from 'adminjs';


const PORT = 3000
const DEFAULT_ADMIN = [
  {
    email: 'admin1@example.com',
    password: 'password1',
    role: 'Admin',
  },
  {
    email: 'pedroramosnext@gmail.com',
    password: '@Ph974985101',
    role: 'Admin',
  },
  {
    email: 'henrique.mansano@metrocasa.com.br',
    password: '@Metrocasa.2023',
    role: 'Admin',
  },
  // Adicione mais objetos para cada usuário administrativo
];


const authenticate = async (email, password) => {
  const admin = DEFAULT_ADMIN.find((admin) => admin.email === email && admin.password === password);
  return admin || null;
};

AdminJS.registerAdapter({
  Database,
  Resource,
})

const start = async () => {
  const app = express()
  const ConnectSession = Connect(session)
  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: 'postgres://admin:admin@localhost:5432/metrocasa',
    },
    tableName: 'session',
    createTableIfMissing: true,
  })

  const db = await new Adapter('postgresql', {
    connectionString: 'postgres://admin:admin@192.168.4.243:5432/metrocasa',
    database: 'metrocasa',
  }).init();

  const usersNavigation = {
    name: 'Corretores',
    icon: 'User',
  }

  const componentLoader = new ComponentLoader();


  const admin = new AdminJS({

    databases: [],
    rootPath: '/',
    componentLoader,


    resources: [{
        resource: db.table('users'),
        options: {
          actions: {
            edit: {
              isAccessible: ({
                currentAdmin
              }) => currentAdmin.role === 'Recep',
              isVisible: ({
                currentAdmin
              }) => currentAdmin.role === 'Recep',
            },
            bulkDelete: {
              isAccessible: ({
                currentAdmin
              }) => currentAdmin.role === 'Recep',
              isVisible: ({
                currentAdmin
              }) => currentAdmin.role === 'Recep',
            },
            delete: {
              isAccessible: ({
                currentAdmin
              }) => currentAdmin.role === 'Recep',
              isVisible: ({
                currentAdmin
              }) => currentAdmin.role === 'Recep',
            },
          }
        }
      },
      {
        resource: db.table('tbcorretores'),
        options: {
          navigation: usersNavigation,
          label: 'Vendas', // Defina o rótulo personalizado que deseja exibir na navegação
        },

      },
      {
        resource: db.table('corretores'),
        options: {},
      },
      {
        resource: db.table('tbleadssi'),
        options: {},
      },
      {
        resource: db.table('tbvendas'),
        options: {},        
      },
    ],
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
      },
      name: 'adminjs',
    }
  )
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()