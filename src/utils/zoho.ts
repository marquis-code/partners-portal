const z = (window as any).$zoho || {};
z.salesiq = z.salesiq || {
  widgetcode:
    '422e1cacdcc93da7c9f44fd1f00755a1e2a9bab800dd2fb82e7b2571a045feb9e6550238dd8f55574e883ef8424d6aba',
  values: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ready: function () {}
};
const d = document;
const s = d.createElement('script');
s.type = 'text/javascript';
s.id = 'zsiqscript';
s.defer = true;
s.src = 'https://salesiq.zoho.com/widget';
const t = d.getElementsByTagName('script')[0];
t.parentNode?.insertBefore(s, t);
window.$zoho = z
