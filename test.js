const highlightedWithSpanClass = "highlighted-with-span";

function generateContent() {
    let spansQuantity = document.getElementById("span-quantity").valueAsNumber;
    let contentTemplate = "<span>qwertyuiopasdfghjklzxcvbnm</span><wbr>";
    document.getElementById("parent-span").innerHTML = contentTemplate.repeat(spansQuantity);
}

generateContent();

function measureTime(fun) {
    const start = Date.now();
    fun();
    // Force frame update before measuring end time.
    requestAnimationFrame(() => setTimeout(() => {
        const end = Date.now();
        let span = document.getElementById("performance-span");
        span.textContent = `${end - start}`;
    }, 0));
}

function doForEveryTextNode(root, operation) {
    let all = [];
    for (let node = root.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == Node.TEXT_NODE) operation(node)
        else if (node.nodeName == "SCRIPT" || node.nodeName == "STYLE") continue;
        else doForEveryTextNode(node, operation);
    }
    return all;
}

// Fire a click event on #generate-content-button when pressing Enter key while in #span-quantity
document.querySelector("#span-quantity").addEventListener("keyup", event => {
    if (event.key !== "Enter") return;
    document.querySelector("#generate-content-button").click();
    event.preventDefault();
});

/************************************************************************/

const parentSpan = document.getElementById('parent-span');

function highlightWithSpans() {
    doForEveryTextNode(parentSpan, wrapTextWithSpan);
}

function highlightWithAPIRanges() {
    let highlight = new Highlight();
    doForEveryTextNode(parentSpan, (node) => { wrapTextWithHighlightAPIRange(highlight, node) });
    CSS.highlights.set("example-highlight", highlight);
}

function highlightWithAPIStaticRanges() {
    let highlight = new Highlight();
    doForEveryTextNode(parentSpan, (node) => { wrapTextWithHighlightAPIStaticRange(highlight, node) });
    CSS.highlights.set("example-highlight", highlight);
}

/************************************************************************/

function wrapTextWithSpan(textNode) {
    let span = document.createElement('span');
    span.className = "highlighted-with-span";
    textNode.parentNode.insertBefore(span, textNode.nextSibling);
    span.appendChild(textNode);
}

function wrapTextWithHighlightAPIRange(highlight, textNode) {
    let r = new Range();
    r.setStart(textNode, 0);
    r.setEnd(textNode, textNode.nodeValue.length);
    highlight.add(r);
}

function wrapTextWithHighlightAPIStaticRange(highlight, textNode) {
    let r = new StaticRange({ startContainer: textNode, startOffset: 0, endContainer: textNode, endOffset: textNode.nodeValue.length });
    highlight.add(r);
}

/************************************************************************/

function restoreWithSpans() {
    let spans = document.getElementsByClassName(highlightedWithSpanClass);
    while (spans.length) {
        let span = spans[0];
        span.parentNode.insertBefore(span.firstChild, span);
        span.parentNode.removeChild(span);
    }
}

function restoreWithAPI() {
    CSS.highlights.delete("example-highlight");
}