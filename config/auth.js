module.exports = {
  secret: process.env.AUTH_SECRET, // key used to encript
  expires: process.env.AUTH_EXPIRES, // token duration
  rounds: process.env.AUTH_ROUNDS // times the password is encrypted
}