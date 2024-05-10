const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = (app: any) => {
  app.use(
    '/ws', // 프록시할 웹소켓 엔드포인트
    createProxyMiddleware({
      target: 'http://192.168.249.131:8080', // 프록시할 대상 서버의 주소
      ws: true, // 웹소켓을 사용하겠다!
    }),
  );
};
