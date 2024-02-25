---
"zod-stream": major
---

moving the internal meta around key completino and validity into a single \_meta object on the response and adding explicit types so that consumers can reference it safely - the format has chnaged slightly from indicvidual keys on the resposne to all being wrapped up - additionalyl theres a new utility for checking completed paths
