window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // 获取 OpenAPI JSON 的 URL
  function getOpenApiUrl() {
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      return `/api/f/docs/${tenantId}/openapi.json`;
    }
    return '/api/f/docs/openapi.json';
  }

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  window.ui = SwaggerUIBundle({
    url: getOpenApiUrl(),
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      /*SwaggerUIStandalonePreset*/
    ],
   /* plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"*/
  });

  //</editor-fold>
};
