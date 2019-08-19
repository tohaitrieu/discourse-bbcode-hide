import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => {
  opts.features["bbcode-hideto"] = true;
});

function replaceContentHide(text) {
  text = text || "";
  while (
    text !==
    (text = text.replace(
      /\[hideto=([^\]]+)\]((?:(?!\[hideto=[^\]]+\]|\[\/hideto\])[\S\s])*)\[\/hideto\]/gi,
      function(match, p1, p2) {
        return `<div class='hideto ${p1}'>${p2}</div>`;
      }
    ))
  );
  return text;
}

export function setup(helper) {
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "class") {
        return /^hideto ?[a-zA-Z0-9]+$/.exec(value);
      }
    }
  });

  if (helper.markdownIt) {
    helper.registerPlugin(md => {
      const ruler = md.block.bbcode.ruler;

      ruler.push("hideto", {
        tag: "hideto",
        wrap: function(token, tagInfo) {
      token.attrs = [['class', 'hideto '+ tagInfo.attrs['_default']]];
       }
      });
    });
  } else {
    helper.addPreProcessor(text => replaceContentHide(text));
  }
}
