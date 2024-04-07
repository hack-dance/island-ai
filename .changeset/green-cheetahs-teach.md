---
"llm-polyglot": major
---

Updating anthropic provider to use the new tools api that supports json out the box - this moves away from the xml parsing in and out and intro=duces a new limitation in that you can no longer stream tool output - prevously we allowed it although we would only stream content and the tool output wouldnt be available until the end so this isnt really much of a reduction in functionality as it is getting things more inline with what hte underlying api currently supports - because of the signifigant changes this does require a major bump
