// Register a global custom directive called `v-markdown`

// https://www.markdownguide.org/cheat-sheet
const rules = [
  [/#{1}\s?([^\n]+)/g, '<h1>$1</h1>'],
  [/#{2}\s?([^\n]+)/g, '<h2>$1</h2>'],
  [/#{3}\s?([^\n]+)/g, '<h3>$1</h3>'],
  [/#{4}\s?([^\n]+)/g, '<h4>$1</h4>'],
  [/#{5}\s?([^\n]+)/g, '<h5>$1</h5>'],
  [/#{6}\s?([^\n]+)/g, '<h6>$1</h6>'],

  [/\*\*([^\*]+)\*\*/g, '<b>$1</b>'],
  [/\~\~([^\~]+)\~\~/g, '<del>$1</del>'],
  [/\*([^\*]+)\*/g, '<i>$1</i>'],
  [/>{1}\s?([^\n]+)/g, '<blockquote>$1</blockquote>'],

  [/-{1}\s?([^\-]+)/g, '<li>$1</li>'], // <ul>
  [/(1.){1}\s?([^(1.)]+)/g, '<li>$1</li>'], // <ol>

  [/\`([^\`]+)\`/g, '<code>$1</code>'],

  [/-{3}\s?([^\n]+)/g, '<hr>'],

  //link
  //image
];

export default {
  // When the bound element is mounted into the DOM...
  mounted(el: HTMLElement) {
    // Regex it to html
    let html = el.textContent || '';
    rules.map(([rule, template]) => {
      html = html.replace(rule, template.toString());
    });
    el.innerHTML = html;
  },
};
