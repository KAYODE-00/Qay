async function main() {
  const url = 'https://templates-virid.vercel.app/api/templates/tpl-mp14wlx19az7n';
  console.log('Fetching', url);
  const res = await fetch(url);
  const data = await res.json();
  console.log('Template Details:', JSON.stringify(data, null, 2));
}

main().catch(console.error);
