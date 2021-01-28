const pwdRules = [
  { required: true, message: '请输入密码.' },
  { min: 3, max: 30, message: '密码长度在3-30个字符之间.', trigger: ['change'] },
];

module.exports = {
  pwdRules,
};
