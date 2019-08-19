

String.prototype.minify = function()
{
    return this
        .trim()
        .replace(/>[\n\t ]+/g, ">")
        .replace(/[\n\t ]+</g, "<")
        .replace(/\s+/g, " ");
};




// noinspection ES6UnusedImports
import { parse, stringify } from "css";

/**
 *
 * @param {string} css
 * @returns {string}
 */
export function inlineFromCSS(css)
{
    const stripped = css.replace(/<\/?style>/g, "").minify();
    const styles = parse(stripped);

    let rules = [];

    if(styles.type === "stylesheet" && styles.stylesheet && styles.stylesheet.parsingErrors.length === 0)
    {
        styles.stylesheet.rules.forEach(function(rule)
        {
            rule.selectors.forEach(function(selector)
            {
                if(selector.startsWith(".dynamic-field"))
                {
                    rule.declarations.forEach(function(declaration)
                    {
                        rules.push(`${declaration.property}:${declaration.value};`)
                    });
                }
            });
        });
    }

    return rules.join(" ");
}

