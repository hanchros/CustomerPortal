module.exports = {
  // Secret key for JWT signing and encryption
  secret: 'mysecret',
  // Database connection information
  database: 'mongodb://localhost:27017/customerportal',
  // database: 'mongodb+srv://admin:Admin55555@cluster0-rxvkj.azure.mongodb.net/customerportal?retryWrites=true&w=majority',
  // Setting port for server
  port: 8080,
  // SendGrid API key
  sendgridApiKey: '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',
  // Stripe API key
  stripeApiKey: 'stripe api key goes here',

  // S3 Info
  s3bucket: 'clientintegration-integra',
  s3accessKeyId: 'AKIASSQI5QMCXGIN2CBP',
  s3secretAccessKey: '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',
  s3region: 'us-west-2',

  // necessary in order to run tests in parallel of the main app
  test_port: 3001,
  test_env: 'test',
  test_email: 'sunnyprome30@gmail.com',
  test_db: 'mern-starter-test',
};
