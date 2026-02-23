# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - button "Toggle dark mode" [ref=e3]:
      - img
    - main [ref=e4]:
      - generic [ref=e5]:
        - heading "Password Generator" [level=1] [ref=e6]
        - generic [ref=e7]:
          - tablist [ref=e8]:
            - tab "Password" [ref=e9]
            - tab "PIN" [selected] [ref=e10]
            - tab "Passphrase" [ref=e11]
          - tabpanel "PIN" [ref=e12]:
            - generic [ref=e13]:
              - generic [ref=e14]:
                - paragraph [ref=e17]: "903"
                - generic [ref=e21]: VERY WEAK
                - generic [ref=e22]:
                  - button "Refresh" [ref=e23]
                  - button "Copy" [ref=e24]
                  - button "Check Breach" [active] [ref=e25]
                - generic [ref=e26]: ⚠️ Found in 20393 breaches
              - generic [ref=e27]:
                - generic [ref=e28]:
                  - generic [ref=e30]: "Length: 3"
                  - slider [ref=e34]
                  - generic [ref=e35]:
                    - generic [ref=e36]: "3"
                    - generic [ref=e37]: "12"
                - paragraph [ref=e39]: PINs are numeric-only codes (0-9) commonly used for device access.
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e45] [cursor=pointer]:
    - img [ref=e46]
  - alert [ref=e49]
```