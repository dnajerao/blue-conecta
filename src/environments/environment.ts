// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  //production: false
  production: true,

  URL_BLMIDS_API : "http://3.83.101.203/Conecta/ConectaPHP-API/service.php?ids=#IDS#",
  URL_TOKEN_API : "https://qtc2.qiubo.mx/service/oauth/token",
  URL_PUSH_API : "https://qtc2.qiubo.mx/service/api/v1/e/pushNotificationFC",
  
  URL_TOKEN_API_PROXY : "http://3.83.101.203/Conecta/ConectaPHP-API/token.php",
  //URL_PUSH_API_PROXY : "http://3.83.101.203:8080/pushNotif",
  URL_PUSH_API_PROXY : "http://3.83.101.203:8080/pushNotif?blmid=#blmid#&subject=#subject#&message=#message#",


  auth_username : 'aggregator',
  auth_password :  'paS5worD.AGg4egat0r',
  auth_grant_type : 'password',
  auth_client_id :  'qiubo-secure-aggreg-s1',

  oauth_username : 'qiubo-secure-aggreg-s1',
  oauth_password :  'qiubo-1909-pwd.3n1gma3'

};
